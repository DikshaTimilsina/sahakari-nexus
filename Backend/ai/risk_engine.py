"""
Risk Engine: rule-based financial ratios + graph community detection.

Produces:
  - a 0-100 risk score (higher = safer, lower = riskier — matches the
    "score drops as fraud is revealed" demo beat)
  - a list of explainable flags, each with severity + a plain description
  - the set of node ids belonging to the most suspicious cluster (for
    highlighting in the graph visualization)

No trained ML model here by design — every flag maps to a named,
inspectable rule. This is a deliberate choice for a hackathon MVP:
explainable-by-construction beats a black box you can't defend under
judge questioning.
"""

from datetime import date, datetime
import networkx as nx


def _parse(d: str) -> date:
    return datetime.fromisoformat(d).date()


def compute_financial_ratios(dataset: dict) -> dict:
    deposits = dataset["deposits"]
    loans = dataset["loans"]
    members = dataset["members"]

    total_deposits_in = sum(d["amount"] for d in deposits if d["txn_type"] == "deposit")
    total_withdrawals = sum(d["amount"] for d in deposits if d["txn_type"] == "withdrawal")
    total_loans_out = sum(l["amount"] for l in loans)
    related_party_loans = sum(l["amount"] for l in loans if l["related_party_flag"])

    net_deposits = total_deposits_in - total_withdrawals
    loan_to_deposit_ratio = (total_loans_out / net_deposits) if net_deposits > 0 else float("inf")
    related_party_share = (related_party_loans / total_loans_out) if total_loans_out > 0 else 0.0

    # deposit velocity in the most recent 60 days vs. the prior period —
    # a sudden surge is the Ponzi-shape signal
    today = date.today()
    recent_cutoff = today.toordinal() - 60
    recent_deposits = sum(
        d["amount"] for d in deposits
        if d["txn_type"] == "deposit" and _parse(d["txn_date"]).toordinal() >= recent_cutoff
    )
    older_deposits = total_deposits_in - recent_deposits
    # normalize to a daily rate so the two periods are comparable
    n_days_total = 730
    recent_daily_rate = recent_deposits / 60
    older_daily_rate = older_deposits / max(n_days_total - 60, 1)
    deposit_surge_ratio = (recent_daily_rate / older_daily_rate) if older_daily_rate > 0 else 1.0

    # recent insider withdrawals concentration
    board_ids = {m["id"] for m in members if m["role"] == "board"}
    recent_board_withdrawals = sum(
        d["amount"] for d in deposits
        if d["txn_type"] == "withdrawal" and d["member_id"] in board_ids
        and _parse(d["txn_date"]).toordinal() >= recent_cutoff
    )
    recent_total_withdrawals = sum(
        d["amount"] for d in deposits
        if d["txn_type"] == "withdrawal" and _parse(d["txn_date"]).toordinal() >= recent_cutoff
    ) or 1

    board_withdrawal_share = recent_board_withdrawals / recent_total_withdrawals

    return {
        "total_deposits_in": round(total_deposits_in, 2),
        "total_withdrawals": round(total_withdrawals, 2),
        "total_loans_out": round(total_loans_out, 2),
        "loan_to_deposit_ratio": round(loan_to_deposit_ratio, 3) if loan_to_deposit_ratio != float("inf") else 999,
        "related_party_loan_share": round(related_party_share, 3),
        "deposit_surge_ratio": round(deposit_surge_ratio, 2),
        "recent_board_withdrawal_share": round(board_withdrawal_share, 3),
    }


def detect_suspicious_clusters(G: nx.Graph) -> list:
    """Louvain community detection; returns communities sorted by
    avg related-party-loan concentration, most suspicious first."""
    if G.number_of_edges() == 0:
        return []
    communities = nx.community.louvain_communities(G, weight="weight", seed=42)

    scored = []
    for community in communities:
        if len(community) < 2:
            continue
        related_loans = sum(G.nodes[n].get("related_party_loans", 0) for n in community)
        total_loans = sum(G.nodes[n].get("total_loans", 0) for n in community)
        concentration = (related_loans / total_loans) if total_loans > 0 else 0
        scored.append({
            "members": list(community),
            "size": len(community),
            "related_party_loan_total": related_loans,
            "concentration": round(concentration, 3),
        })
    scored.sort(key=lambda c: c["concentration"], reverse=True)
    return scored


FLAG_DEFINITIONS = {
    "high_loan_to_deposit": {
        "severity": "high",
        "template": "Loan-to-deposit ratio is {value}x — the cooperative has lent out "
                     "far more than its net deposit base, a classic solvency red flag.",
    },
    "related_party_concentration": {
        "severity": "critical",
        "template": "{pct}% of all loan value has gone to related parties (board members, "
                     "their family, or business partners) — a pattern seen in prior cooperative collapses.",
    },
    "deposit_surge": {
        "severity": "high",
        "template": "New deposits have surged {value}x above the historical daily rate in the "
                     "last 60 days — often a sign new member money is funding old withdrawals.",
    },
    "board_withdrawal_concentration": {
        "severity": "critical",
        "template": "{pct}% of all recent withdrawals were made by board members themselves, "
                     "coinciding with the deposit surge above.",
    },
    "dense_related_party_cluster": {
        "severity": "critical",
        "template": "A tightly connected group of {size} members — mostly board members and their "
                     "associates — holds {pct}% of loan value among themselves.",
    },
}


def score_cooperative(dataset: dict, G: nx.Graph) -> dict:
    ratios = compute_financial_ratios(dataset)
    clusters = detect_suspicious_clusters(G)
    top_cluster = clusters[0] if clusters else None

    flags = []
    penalty = 0

    if ratios["loan_to_deposit_ratio"] > 1.5:
        flags.append({
            "flag": "high_loan_to_deposit",
            "severity": FLAG_DEFINITIONS["high_loan_to_deposit"]["severity"],
            "explanation": FLAG_DEFINITIONS["high_loan_to_deposit"]["template"].format(
                value=ratios["loan_to_deposit_ratio"]),
        })
        penalty += 15

    if ratios["related_party_loan_share"] > 0.25:
        pct = round(ratios["related_party_loan_share"] * 100, 1)
        flags.append({
            "flag": "related_party_concentration",
            "severity": FLAG_DEFINITIONS["related_party_concentration"]["severity"],
            "explanation": FLAG_DEFINITIONS["related_party_concentration"]["template"].format(pct=pct),
        })
        penalty += 25

    if ratios["deposit_surge_ratio"] > 2.0:
        flags.append({
            "flag": "deposit_surge",
            "severity": FLAG_DEFINITIONS["deposit_surge"]["severity"],
            "explanation": FLAG_DEFINITIONS["deposit_surge"]["template"].format(
                value=ratios["deposit_surge_ratio"]),
        })
        penalty += 15

    if ratios["recent_board_withdrawal_share"] > 0.4:
        pct = round(ratios["recent_board_withdrawal_share"] * 100, 1)
        flags.append({
            "flag": "board_withdrawal_concentration",
            "severity": FLAG_DEFINITIONS["board_withdrawal_concentration"]["severity"],
            "explanation": FLAG_DEFINITIONS["board_withdrawal_concentration"]["template"].format(pct=pct),
        })
        penalty += 20

    if top_cluster and top_cluster["concentration"] > 0.5 and top_cluster["size"] >= 3:
        pct = round(top_cluster["concentration"] * 100, 1)
        flags.append({
            "flag": "dense_related_party_cluster",
            "severity": FLAG_DEFINITIONS["dense_related_party_cluster"]["severity"],
            "explanation": FLAG_DEFINITIONS["dense_related_party_cluster"]["template"].format(
                size=top_cluster["size"], pct=pct),
        })
        penalty += 25

    score = max(0, min(100, 100 - penalty))

    if score >= 75:
        band = "healthy"
    elif score >= 45:
        band = "watch"
    else:
        band = "high_risk"

    return {
        "score": score,
        "band": band,
        "flags": flags,
        "ratios": ratios,
        "flagged_cluster_members": set(top_cluster["members"]) if (top_cluster and flags) else set(),
    }


if __name__ == "__main__":
    from data_generator import generate_healthy_cooperative, generate_collapsing_cooperative
    from graph_builder import build_graph

    for label, gen in [("HEALTHY", generate_healthy_cooperative), ("COLLAPSING", generate_collapsing_cooperative)]:
        ds = gen().to_dict()
        G = build_graph(ds)
        result = score_cooperative(ds, G)
        print(f"\n=== {label} ===")
        print("Score:", result["score"], "| Band:", result["band"])
        print("Ratios:", result["ratios"])
        for f in result["flags"]:
            print(f" - [{f['severity']}] {f['explanation']}")

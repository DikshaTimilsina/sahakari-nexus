"""
Builds a NetworkX graph from a cooperative dataset.

Nodes: members (attributed with role)
Edges:
  - 'loan' edges: borrower -> cooperative-pool, weighted by amount, flagged if related_party
  - 'relationship' edges: member <-> member (family/board_colleague/business_partner)

This graph is the input to the risk engine's cluster/anomaly detection.
"""

import networkx as nx
from datetime import date


def build_graph(dataset: dict) -> nx.Graph:
    G = nx.Graph()

    for m in dataset["members"]:
        G.add_node(m["id"], type="member", name=m["name"], role=m["role"],
                   join_date=m["join_date"])

    # relationship edges (family / board_colleague / business_partner)
    for r in dataset["relationships"]:
        G.add_edge(r["member_a"], r["member_b"],
                   edge_type="relationship",
                   relationship_type=r["relationship_type"],
                   weight=1.0)

    # loan edges: connect borrower to every board member who is "related" via
    # relationship edges, so loan concentration shows up as graph density,
    # and also tag loan totals directly on the node for scoring.
    loan_totals = {}
    related_party_loan_totals = {}
    for l in dataset["loans"]:
        bid = l["borrower_member_id"]
        loan_totals[bid] = loan_totals.get(bid, 0) + l["amount"]
        if l["related_party_flag"]:
            related_party_loan_totals[bid] = related_party_loan_totals.get(bid, 0) + l["amount"]

    for node_id in G.nodes:
        G.nodes[node_id]["total_loans"] = loan_totals.get(node_id, 0)
        G.nodes[node_id]["related_party_loans"] = related_party_loan_totals.get(node_id, 0)

    # strengthen edges between members who both appear in related-party loans
    # together with a board member (this is what makes the "ring" visually dense)
    related_borrowers = [bid for bid in related_party_loan_totals]
    for i, a in enumerate(related_borrowers):
        for b in related_borrowers[i + 1:]:
            if G.has_edge(a, b):
                G[a][b]["weight"] += 2.0
            else:
                G.add_edge(a, b, edge_type="inferred_ring", weight=2.0)

    return G


def graph_summary(G: nx.Graph) -> dict:
    """Lightweight stats used both for display and as risk engine inputs."""
    return {
        "n_nodes": G.number_of_nodes(),
        "n_edges": G.number_of_edges(),
        "density": round(nx.density(G), 4),
        "connected_components": nx.number_connected_components(G),
    }


def to_vis_json(G: nx.Graph, highlighted_nodes: set = None) -> dict:
    """Serialize graph into {nodes: [], edges: []} for frontend force-graph rendering."""
    highlighted_nodes = highlighted_nodes or set()
    nodes = []
    for node_id, data in G.nodes(data=True):
        nodes.append({
            "id": node_id,
            "name": data.get("name"),
            "role": data.get("role"),
            "total_loans": data.get("total_loans", 0),
            "related_party_loans": data.get("related_party_loans", 0),
            "flagged": node_id in highlighted_nodes,
        })
    edges = []
    for a, b, data in G.edges(data=True):
        edges.append({
            "source": a,
            "target": b,
            "edge_type": data.get("edge_type"),
            "weight": data.get("weight", 1.0),
        })
    return {"nodes": nodes, "edges": edges}


if __name__ == "__main__":
    from data_generator import generate_collapsing_cooperative
    ds = generate_collapsing_cooperative().to_dict()
    G = build_graph(ds)
    print(graph_summary(G))

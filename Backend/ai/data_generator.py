"""
Synthetic cooperative data generator.

Generates two kinds of scenarios:
  - "healthy": normal, boring cooperative with organic growth and diversified lending
  - "collapsing": mirrors patterns reported in real cooperative collapses —
        * a handful of board members receive disproportionate loan volume
        * new-member deposit growth outpaces organic growth right before large withdrawals
        * a tight cluster of related-party loans forms a "ring"

This is deliberately hand-tuned so the demo tells a clean, legible story.
Real-world data is messier; this is a stand-in until you wire up OCR + real ledgers.
"""

import random
import uuid
from datetime import date, timedelta
from dataclasses import dataclass, field, asdict


def _id() -> str:
    return str(uuid.uuid4())


@dataclass
class Member:
    id: str
    name: str
    member_number: str
    join_date: str
    role: str  # 'member', 'board', 'staff'


@dataclass
class Deposit:
    id: str
    member_id: str
    amount: float
    txn_date: str
    txn_type: str  # 'deposit' | 'withdrawal'


@dataclass
class Loan:
    id: str
    borrower_member_id: str
    amount: float
    issue_date: str
    due_date: str
    status: str  # 'active' | 'repaid' | 'default'
    related_party_flag: bool = False


@dataclass
class Relationship:
    id: str
    member_a: str
    member_b: str
    relationship_type: str  # 'family' | 'business_partner' | 'board_colleague'


@dataclass
class CooperativeDataset:
    cooperative_id: str
    name: str
    scenario: str  # 'healthy' | 'collapsing'
    members: list
    deposits: list
    loans: list
    relationships: list

    def to_dict(self):
        return {
            "cooperative_id": self.cooperative_id,
            "name": self.name,
            "scenario": self.scenario,
            "members": [asdict(m) for m in self.members],
            "deposits": [asdict(d) for d in self.deposits],
            "loans": [asdict(l) for l in self.loans],
            "relationships": [asdict(r) for r in self.relationships],
        }


FIRST_NAMES = ["Ram", "Sita", "Hari", "Gita", "Krishna", "Maya", "Bikash", "Sunita",
               "Rajesh", "Anita", "Suresh", "Kamala", "Dipesh", "Sarita", "Bishnu",
               "Laxmi", "Prakash", "Radha", "Nabin", "Sabina"]
LAST_NAMES = ["Sharma", "Gurung", "Thapa", "Shrestha", "Tamang", "Rai", "Magar",
              "Karki", "Adhikari", "Bhattarai", "Poudel", "Basnet", "Khadka"]


def _random_name(rng: random.Random) -> str:
    return f"{rng.choice(FIRST_NAMES)} {rng.choice(LAST_NAMES)}"


def _date_str(d: date) -> str:
    return d.isoformat()


def generate_healthy_cooperative(seed: int = 42, n_members: int = 60) -> CooperativeDataset:
    rng = random.Random(seed)
    coop_id = _id()
    start = date.today() - timedelta(days=730)

    members = []
    board_ids = []
    for i in range(n_members):
        role = "board" if i < 5 else ("staff" if i < 8 else "member")
        m = Member(
            id=_id(),
            name=_random_name(rng),
            member_number=f"M-{1000+i}",
            join_date=_date_str(start + timedelta(days=rng.randint(0, 500))),
            role=role,
        )
        members.append(m)
        if role == "board":
            board_ids.append(m.id)

    deposits = []
    for m in members:
        # organic, steady deposit activity over time
        n_txns = rng.randint(10, 40)
        for _ in range(n_txns):
            txn_date = start + timedelta(days=rng.randint(0, 730))
            is_withdrawal = rng.random() < 0.35
            amount = rng.uniform(500, 15000)
            deposits.append(Deposit(
                id=_id(), member_id=m.id,
                amount=round(amount, 2),
                txn_date=_date_str(txn_date),
                txn_type="withdrawal" if is_withdrawal else "deposit",
            ))

    loans = []
    # loans spread fairly evenly across members, not concentrated on board
    borrowers = rng.sample(members, k=min(25, len(members)))
    for b in borrowers:
        amount = rng.uniform(5000, 80000)
        issue = start + timedelta(days=rng.randint(100, 600))
        loans.append(Loan(
            id=_id(), borrower_member_id=b.id,
            amount=round(amount, 2),
            issue_date=_date_str(issue),
            due_date=_date_str(issue + timedelta(days=365)),
            status=rng.choice(["active", "repaid", "repaid", "active"]),
            related_party_flag=False,
        ))

    relationships = []
    # a few normal family ties, not concentrated around board/loans
    for _ in range(6):
        a, b = rng.sample(members, 2)
        relationships.append(Relationship(
            id=_id(), member_a=a.id, member_b=b.id,
            relationship_type=rng.choice(["family", "business_partner"]),
        ))

    return CooperativeDataset(
        cooperative_id=coop_id,
        name="Samriddhi Bachat tatha Sahakari Sanstha",
        scenario="healthy",
        members=members, deposits=deposits, loans=loans, relationships=relationships,
    )


def generate_collapsing_cooperative(seed: int = 7, n_members: int = 60) -> CooperativeDataset:
    """
    Mirrors reported real-world collapse patterns:
      1. A tight related-party ring among board members receives outsized loans.
      2. Deposit growth accelerates sharply in the final months (new money funding
         old withdrawals — classic Ponzi-shape).
      3. Loan-to-deposit ratio balloons right before collapse.
    """
    rng = random.Random(seed)
    coop_id = _id()
    start = date.today() - timedelta(days=730)
    # Must land inside the risk engine's "last 60 days" window, so keep this
    # recent (not 60 days ago, which sits right on the window's edge).
    collapse_point = date.today() - timedelta(days=10)

    members = []
    for i in range(n_members):
        role = "board" if i < 5 else ("staff" if i < 8 else "member")
        m = Member(
            id=_id(),
            name=_random_name(rng),
            member_number=f"M-{2000+i}",
            join_date=_date_str(start + timedelta(days=rng.randint(0, 500))),
            role=role,
        )
        members.append(m)

    board = [m for m in members if m.role == "board"]
    ordinary_members = [m for m in members if m.role == "member"]

    deposits = []
    for m in members:
        n_txns = rng.randint(8, 30)
        for _ in range(n_txns):
            txn_date = start + timedelta(days=rng.randint(0, 670))
            is_withdrawal = rng.random() < 0.3
            amount = rng.uniform(500, 12000)
            deposits.append(Deposit(
                id=_id(), member_id=m.id, amount=round(amount, 2),
                txn_date=_date_str(txn_date),
                txn_type="withdrawal" if is_withdrawal else "deposit",
            ))

    # Ponzi-shape: sharp deposit surge in final 60 days, funding withdrawals by insiders
    late_joiners = []
    for i in range(25):
        m = Member(
            id=_id(), name=_random_name(rng), member_number=f"M-NEW-{i}",
            join_date=_date_str(collapse_point - timedelta(days=rng.randint(0, 45))),
            role="member",
        )
        members.append(m)
        late_joiners.append(m)
        deposit_date = collapse_point - timedelta(days=rng.randint(0, 45))
        deposits.append(Deposit(
            id=_id(), member_id=m.id, amount=round(rng.uniform(20000, 90000), 2),
            txn_date=_date_str(deposit_date), txn_type="deposit",
        ))

    # large insider withdrawals right as new deposits flood in
    for b in board:
        for _ in range(rng.randint(2, 4)):
            wd_date = collapse_point - timedelta(days=rng.randint(0, 45))
            deposits.append(Deposit(
                id=_id(), member_id=b.id, amount=round(rng.uniform(40000, 150000), 2),
                txn_date=_date_str(wd_date), txn_type="withdrawal",
            ))

    loans = []
    # normal-looking loans to ordinary members
    for m in rng.sample(ordinary_members, k=min(15, len(ordinary_members))):
        amount = rng.uniform(5000, 40000)
        issue = start + timedelta(days=rng.randint(100, 500))
        loans.append(Loan(
            id=_id(), borrower_member_id=m.id, amount=round(amount, 2),
            issue_date=_date_str(issue), due_date=_date_str(issue + timedelta(days=365)),
            status=rng.choice(["active", "repaid"]), related_party_flag=False,
        ))

    # THE RING: board members lending heavily to each other / to shell "family" members
    ring_extra_members = []
    for i in range(4):
        rm = Member(
            id=_id(), name=_random_name(rng), member_number=f"M-RING-{i}",
            join_date=_date_str(start + timedelta(days=rng.randint(0, 200))),
            role="member",
        )
        members.append(rm)
        ring_extra_members.append(rm)

    ring_pool = board + ring_extra_members
    for b in board:
        for _ in range(rng.randint(3, 5)):
            counterpart = rng.choice([r for r in ring_pool if r.id != b.id])
            amount = rng.uniform(100000, 400000)
            issue = start + timedelta(days=rng.randint(300, 650))
            loans.append(Loan(
                id=_id(), borrower_member_id=counterpart.id, amount=round(amount, 2),
                issue_date=_date_str(issue), due_date=_date_str(issue + timedelta(days=365)),
                status=rng.choice(["active", "default", "active"]),
                related_party_flag=True,
            ))

    relationships = []
    for b in board:
        for r in ring_extra_members:
            relationships.append(Relationship(
                id=_id(), member_a=b.id, member_b=r.id,
                relationship_type=rng.choice(["family", "board_colleague"]),
            ))
    for i, b1 in enumerate(board):
        for b2 in board[i + 1:]:
            relationships.append(Relationship(
                id=_id(), member_a=b1.id, member_b=b2.id,
                relationship_type="board_colleague",
            ))

    return CooperativeDataset(
        cooperative_id=coop_id,
        name="Samunnat Bikash Sahakari Sanstha",
        scenario="collapsing",
        members=members, deposits=deposits, loans=loans, relationships=relationships,
    )


if __name__ == "__main__":
    import json
    healthy = generate_healthy_cooperative()
    collapsing = generate_collapsing_cooperative()
    print("Healthy:", healthy.name, "| members:", len(healthy.members),
          "| deposits:", len(healthy.deposits), "| loans:", len(healthy.loans))
    print("Collapsing:", collapsing.name, "| members:", len(collapsing.members),
          "| deposits:", len(collapsing.deposits), "| loans:", len(collapsing.loans),
          "| related-party loans:", sum(1 for l in collapsing.loans if l.related_party_flag))

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TrailRequest(BaseModel):
    accused_id: str
    max_hops: int = 5

@router.post("/money-trail")
async def analyze_money_trail(req: TrailRequest):
    # STUB: Neo4j query for money trails and shell account detection
    print(f"STUB: Executing Cypher to trace money trail for {req.accused_id} up to {req.max_hops} hops")
    
    return {
        "network": {
            "nodes": [
                {"id": 1, "label": "ACC-1234", "group": "person"},
                {"id": 2, "label": "Acct 9918", "group": "account", "suspicious": True},
                {"id": 3, "label": "Acct 5542", "group": "account"},
                {"id": 4, "label": "Shell Corp XYZ", "group": "company"}
            ],
            "edges": [
                {"from": 1, "to": 2, "value": 500000},
                {"from": 2, "to": 3, "value": 490000},
                {"from": 3, "to": 4, "value": 485000}
            ]
        },
        "money_trail_summary": "Detected a 3-hop transaction sequence originating from ACC-1234 ending in a suspected shell corporation, indicating potential layering.",
        "total_suspicious_amount": 500000,
        "layering_detected": True,
        "integration_accounts": ["Shell Corp XYZ"],
        "recommended_actions": ["Freeze Acct 9918", "Issue notice to Shell Corp XYZ"]
    }

@router.post("/transaction-anomaly")
async def transaction_anomaly(req: TrailRequest):
    # STUB: Run Isolation Forest over historical transactions
    return {
        "anomalies": [
            {"tx_id": "TX-991", "amount": 950000, "time": "03:15 AM", "score": 0.95, "reason": "Unusual time and round amount"}
        ]
    }

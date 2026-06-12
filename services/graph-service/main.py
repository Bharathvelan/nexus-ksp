from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from graph_ops import GraphOps
from routers import financial

app = FastAPI(title="NEXUS-KSP Graph Analysis Service")
graph_ops = GraphOps()

app.include_router(financial.router, prefix="/api/v1/financial", tags=["Financial"])


class AnalyzeRequest(BaseModel):
    accused_id: str
    depth: int = 2

class FinancialRequest(BaseModel):
    accused_id: str

class LinkRequest(BaseModel):
    entity_id: str
    entity_type: str

@app.post("/network/analyze")
def analyze_network(req: AnalyzeRequest):
    network = graph_ops.get_ego_network(req.accused_id, req.depth)
    key_players = graph_ops.run_pagerank()
    communities = graph_ops.run_louvain()
    
    return {
        "network": network,
        "key_players": key_players,
        "communities": communities,
        "bridge_nodes": ["ACC-2"], # Stub
        "threat_assessment": "HIGH"
    }

@app.post("/network/syndicates")
def get_syndicates():
    communities = graph_ops.run_louvain()
    syndicates = []
    for c in communities:
        if len(c["members"]) >= 5:
            syndicates.append({
                "syndicate_id": f"SYN-{c['community']}",
                "members": c["members"],
                "score": 85.0
            })
    return {"syndicates": syndicates}

@app.post("/network/financial-trail")
def financial_trail(req: FinancialRequest):
    trail = graph_ops.analyze_financial_trail(req.accused_id)
    return {
        "transaction_network": trail,
        "flagged_patterns": ["Rapid Sequential Transfer"],
        "estimated_laundering_amount": 1500000.00
    }

@app.post("/network/link-analysis")
def link_analysis(req: LinkRequest):
    # Stub implementation
    return {
        "entity": req.entity_id,
        "type": req.entity_type,
        "connections": []
    }

@app.get("/hotspots/realtime")
def realtime_hotspots():
    hotspots = graph_ops.get_hotspots()
    # Format as GeoJSON
    features = []
    for h in hotspots:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [h["l.longitude"], h["l.latitude"]]
            },
            "properties": {
                "id": h["l.id"],
                "district": h["l.district"],
                "score": h["l.hotspot_score"]
            }
        })
    return {"type": "FeatureCollection", "features": features}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "graph-service"}

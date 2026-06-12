from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import PatternAnalyzer
from routers import forecast

app = FastAPI(title="NEXUS-KSP Pattern Engine")
analyzer = PatternAnalyzer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/api/v1/forecast", tags=["Forecast"])


class MORequest(BaseModel):
    crime_type: str

class HotspotForecastRequest(BaseModel):
    district: str
    days_ahead: int

class RecidivismRequest(BaseModel):
    accused_id: str

@app.post("/patterns/temporal")
def analyze_temporal():
    return analyzer.temporal_analysis()

@app.post("/patterns/spatial-cluster")
def analyze_spatial_cluster():
    return analyzer.spatial_clustering()

@app.post("/patterns/modus-operandi")
def analyze_mo(req: MORequest):
    return analyzer.mo_clustering(req.crime_type)

@app.post("/forecast/hotspot")
def forecast_hotspot(req: HotspotForecastRequest):
    return analyzer.forecast_hotspot(req.district, req.days_ahead)

@app.post("/forecast/repeat-crime")
def forecast_repeat_crime(req: RecidivismRequest):
    return analyzer.forecast_recidivism(req.accused_id)

@app.get("/predict/spatial")
def predict_spatial():
    return {
        "hotspots": [
            {
                "id": "HS-001",
                "lat": 12.9716, 
                "lng": 77.5946, 
                "risk_score": 92,
                "description": "High probability of property crime based on historical DBSCAN cluster",
                "radius_meters": 500
            },
            {
                "id": "HS-002",
                "lat": 12.9352, 
                "lng": 77.6245, 
                "risk_score": 85,
                "description": "Elevated risk of vehicle theft near Koramangala block 5",
                "radius_meters": 350
            },
            {
                "id": "HS-003",
                "lat": 12.9982, 
                "lng": 77.5530, 
                "risk_score": 78,
                "description": "Anomaly detected: recent spike in petty crime reports in Rajajinagar",
                "radius_meters": 400
            }
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "pattern-engine"}

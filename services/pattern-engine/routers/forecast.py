from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()

class HotspotRequest(BaseModel):
    district: str
    crime_type: str
    days_ahead: int = 30

class RecidivismRequest(BaseModel):
    accused_id: str

@router.post("/hotspot")
async def predict_hotspot(req: HotspotRequest):
    # STUB: In production, load LSTM model, extract 90-day feature sequence
    # run inference with MC dropout for confidence intervals
    
    predictions = []
    base_val = random.randint(10, 50)
    for i in range(req.days_ahead):
        val = base_val + random.randint(-5, 5)
        predictions.append({
            "day": i+1,
            "predicted_count": val,
            "lower_ci": val - 3,
            "upper_ci": val + 3
        })
        
    return {
        "district": req.district,
        "crime_type": req.crime_type,
        "predictions": predictions,
        "hotspot_coords": [
            {"lat": 12.9716, "lng": 77.5946, "intensity": 0.9},
            {"lat": 12.9352, "lng": 77.6245, "intensity": 0.75}
        ],
        "risk_level": "HIGH" if base_val > 30 else "MEDIUM",
        "contributing_factors": [
            {"factor": "Historical Crime Density", "importance_score": 0.45},
            {"factor": "Recent Network Activity", "importance_score": 0.30},
            {"factor": "Upcoming Festival Season", "importance_score": 0.15}
        ],
        "model_confidence": 0.85,
        "similar_historical_periods": ["Q3 2023", "Q3 2022"]
    }

@router.post("/recidivism")
async def predict_recidivism(req: RecidivismRequest):
    # STUB: Load XGBoost model, calculate SHAP values
    score = random.uniform(0.1, 0.95)
    tier = "LOW"
    if score > 0.8: tier = "CRITICAL"
    elif score > 0.6: tier = "HIGH"
    elif score > 0.3: tier = "MEDIUM"
    
    return {
        "accused_id": req.accused_id,
        "risk_score": round(score * 100, 1),
        "risk_tier": tier,
        "top_risk_factors": [
            {"feature": "Bail Violation History", "shap_value": 0.25},
            {"feature": "Co-offender Network Size", "shap_value": 0.18}
        ]
    }

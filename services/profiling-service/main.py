from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from profiler import Profiler

app = FastAPI(title="NEXUS-KSP Profiling Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

profiler = Profiler()

class OffenderRequest(BaseModel):
    accused_id: str

class SimilarCaseRequest(BaseModel):
    fir_id: str
    top_k: int = 5

class RiskRankRequest(BaseModel):
    district: str
    limit: int = 10

class AudioForensicRequest(BaseModel):
    file_id: str
    audio_type: str = "voice_note"

class BiometricRequest(BaseModel):
    image_hash: str

@app.post("/profile/offender")
def get_offender_profile(req: OffenderRequest):
    return profiler.get_offender_profile(req.accused_id)

@app.post("/profile/similar-cases")
def get_similar_cases(req: SimilarCaseRequest):
    return profiler.get_similar_cases(req.fir_id, req.top_k)

@app.post("/profile/risk-rank")
def get_risk_rank(req: RiskRankRequest):
    return profiler.get_risk_rank(req.district, req.limit)

@app.post("/analyze/audio-authenticity")
def analyze_audio_authenticity(req: AudioForensicRequest):
    import random
    # 80% chance of being authentic, 20% chance of detecting a deepfake simulation
    is_authentic = random.random() > 0.2
    
    if is_authentic:
        return {
            "file_id": req.file_id,
            "authenticity_score": random.randint(92, 99),
            "status": "VERIFIED_HUMAN",
            "forensic_flags": ["Natural vocal cord flutter detected", "Background noise profile matches outdoor environment"]
        }
    else:
        return {
            "file_id": req.file_id,
            "authenticity_score": random.randint(12, 35),
            "status": "SYNTHETIC_SPOOF_DETECTED",
            "forensic_flags": ["Phase manipulation artifacts present", "Unnatural pitch modulation at 4kHz", "Vocoder signature matched to known TTS engine"]
        }

@app.post("/biometrics/scan")
def biometric_scan(req: BiometricRequest):
    import random
    return {
        "status": "MATCH_FOUND",
        "match_percentage": round(random.uniform(92.5, 99.8), 2),
        "identity": {
            "name": "Ravi Kumar",
            "accused_id": "ACC-8091",
            "known_aliases": ["Raka"],
            "risk_level": "HIGH"
        },
        "landmarks_mapped": 128
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "profiling-service"}

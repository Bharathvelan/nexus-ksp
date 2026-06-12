import os
import psycopg2
from qdrant_client import QdrantClient
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy_key"))

def get_pg_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        database=os.getenv("POSTGRES_DB", "nexus_ksp"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "nexus_secure_pass"),
        port=os.getenv("POSTGRES_PORT", "5432")
    )

qdrant_client = QdrantClient(host=os.getenv("QDRANT_HOST", "localhost"), port=int(os.getenv("QDRANT_PORT", 6333)))

class Profiler:
    def get_offender_profile(self, accused_id: str):
        # Stub: query Postgres for accused details, linked FIRs, etc.
        # Then generate LLM narrative.
        narrative = "This individual exhibits a strong pattern of organized two-wheeler theft. High likelihood of repeat offense."
        return {
            "accused_id": accused_id,
            "risk_score": 88.5,
            "threat_level": "HIGH",
            "specialization_index": "Theft",
            "behavioral_summary": narrative,
            "investigation_recommendations": [
                "Check known chop shops in the area",
                "Monitor known associates in SYN-1"
            ],
            "crime_history_count": 5
        }

    def get_similar_cases(self, fir_id: str, top_k: int):
        # Stub: Generate embedding for the given FIR text and query Qdrant.
        return [
            {"fir_id": "FIR/2023/5012", "similarity_score": 0.92, "investigation_outcome": "Charge Sheet Filed", "useful_leads": ["CCTV outside bank"]},
            {"fir_id": "FIR/2023/1105", "similarity_score": 0.85, "investigation_outcome": "Closed", "useful_leads": ["Informant tip"]}
        ]

    def get_risk_rank(self, district: str, limit: int):
        # Stub: query Postgres for top risk offenders in a district.
        return [
            {"accused_id": "ACC-5", "name": "Raju (Alias)", "risk_score": 95.0, "status": "Out on bail"},
            {"accused_id": "ACC-12", "name": "Kumar", "risk_score": 92.5, "status": "Custody"}
        ]

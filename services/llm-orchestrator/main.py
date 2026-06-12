from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from pydantic import BaseModel
import time
import asyncio
import json

from memory import ConversationMemory
from agents import AIAgents
from routers import voice, tts, feedback, cases
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NEXUS-KSP LLM Orchestrator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice.router, prefix="/api/v1/voice", tags=["Voice"])
app.include_router(tts.router, prefix="/api/v1/tts", tags=["TTS"])
app.include_router(feedback.router, prefix="/api/v1/feedback", tags=["Feedback"])
app.include_router(cases.router, prefix="/api/v1/cases", tags=["Cases"])


class QueryRequest(BaseModel):
    query: str
    session_id: str
    language: str = "en"
    user_role: str = "INVESTIGATOR"
    jurisdiction: str = "STATE"

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class DraftRequest(BaseModel):
    suspect_id: str
    case_type: str

class InterrogationRequest(BaseModel):
    suspect_id: str
    question: str
    stress_level: int

@app.post("/query")
async def process_query(request: QueryRequest):
    start_time = time.time()
    
    # Add user query to memory
    ConversationMemory.add_message(request.session_id, "user", request.query)
    
    # Retrieve history for context
    history = ConversationMemory.get_history(request.session_id)
    history_str = json.dumps(history)

    # 1. Classify Intent
    intent = await AIAgents.classify_intent(request.query)
    
    # 2. Route to Agents
    tasks = []
    if intent in ["RETRIEVAL", "FINANCIAL"]:
        tasks.append(AIAgents.execute_sql_agent(request.query, history_str))
    elif intent in ["GRAPH_ANALYSIS", "PATTERN_ANALYSIS"]:
        tasks.append(AIAgents.execute_graph_agent(request.query, history_str))
    elif intent == "PROFILING":
        tasks.append(AIAgents.execute_vector_agent(request.query, history_str))
    elif intent == "MULTI_HOP" or intent == "PREDICTION":
        # Spawn all agents
        tasks.extend([
            AIAgents.execute_sql_agent(request.query, history_str),
            AIAgents.execute_graph_agent(request.query, history_str),
            AIAgents.execute_vector_agent(request.query, history_str)
        ])
    else:
        tasks.append(AIAgents.execute_sql_agent(request.query, history_str))

    # 3. Execute concurrently
    results = await asyncio.gather(*tasks)
    
    # 4. Synthesize Response
    synthesis = await AIAgents.synthesize_response(request.query, results)
    
    # Add AI response to memory
    ConversationMemory.add_message(request.session_id, "assistant", synthesis["answer"])
    
    latency_ms = int((time.time() - start_time) * 1000)
    
    # Log to audit (to be implemented via event/request or direct DB call)
    
    return {
        "answer": synthesis["answer"],
        "citations": synthesis["citations"],
        "evidence_chain": {"intent": intent, "steps": [r.get("query") for r in results]},
        "sources_used": synthesis["sources_used"],
        "confidence": synthesis["confidence"],
        "query_executed": [r.get("query") for r in results],
        "latency_ms": latency_ms
    }

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    # Stub for IndicTrans2
    # In production, this would call the AI4Bharat model API
    return {"translated_text": f"[Translated to {request.target_lang}] {request.text}"}

@app.post("/voice-to-text")
async def voice_to_text(file: UploadFile = File(...)):
    # Stub for OpenAI Whisper
    return {"text": "Transcribed voice query", "language": "en", "confidence": 0.95}

@app.post("/text-to-speech")
async def text_to_speech(text: str, language: str = "en"):
    # Stub for TTS
    return {"audio_url": "http://localhost:8001/static/audio.mp3"}

@app.post("/draft/warrant")
async def draft_warrant(req: DraftRequest):
    await asyncio.sleep(2)
    text = f"""IN THE COURT OF THE CHIEF METROPOLITAN MAGISTRATE, BENGALURU

SEARCH AND SEIZURE WARRANT
(Under Section 93 of the Code of Criminal Procedure, 1973)

To:
The Station House Officer / Investigating Officer
Cyber Crime Police Station, Bengaluru

WHEREAS information has been laid before me and on due inquiry there is reason to believe that the suspect identified as {req.suspect_id} is involved in organized offenses relating to {req.case_type}.

AND WHEREAS it has been made to appear to me that the production of specific digital devices, financial ledgers, and communication equipment is essential to the investigation of FIR No. 204/2026.

This is to authorize and require you to enter the premises associated with the suspect, to search for the said devices and documents, and if found, to seize and produce the same forthwith before this Court.

Given under my hand and the seal of the Court, this {time.strftime('%d day of %B, %Y')}.

_____________________________
Chief Metropolitan Magistrate
Bengaluru"""
    return {"draft_text": text, "status": "DRAFT_READY"}

@app.post("/interrogate")
async def interrogate_suspect(req: InterrogationRequest):
    import random
    await asyncio.sleep(1.5)
    
    if req.stress_level > 80:
        responses = [
            "I want my lawyer! I'm not answering that!",
            "I don't know what you're talking about! Leave me alone!",
            "You're trying to set me up!"
        ]
        deception = random.uniform(85, 99)
    elif req.stress_level > 50:
        responses = [
            "Look, I was at home that night. You can check the cameras.",
            "I might know a guy who knows a guy, but I wasn't there.",
            "Why are you asking me this?"
        ]
        deception = random.uniform(50, 80)
    else:
        responses = [
            "I'm telling the truth, Officer. I have nothing to hide.",
            "I don't remember exactly, it was a few days ago.",
            "I just want to cooperate."
        ]
        deception = random.uniform(10, 40)
        
    return {
        "response": random.choice(responses),
        "deception_probability": round(deception, 1),
        "stress_delta": random.randint(-5, 15)
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "llm-orchestrator"}

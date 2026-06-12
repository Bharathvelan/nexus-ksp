from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class FeedbackRequest(BaseModel):
    session_id: str
    message_id: str
    rating: int # 1 for up, -1 for down, 0 for corrected
    query: str
    response: Optional[str] = None
    failure_mode: Optional[str] = None
    corrected_response: Optional[str] = None
    citations_used: Optional[list] = None

@router.post("/submit")
async def submit_feedback(req: FeedbackRequest):
    # STUB: In production, insert into rlhf_feedback table
    print(f"STUB: Received feedback rating {req.rating} for message {req.message_id}")
    if req.rating == -1:
        print(f"STUB: Failure mode logged: {req.failure_mode}")
    elif req.rating == 0:
        print(f"STUB: Corrected response saved for fine-tuning")
        
    return {"status": "success", "message": "Feedback recorded for RLHF pipeline"}

from fastapi import APIRouter, UploadFile, File, HTTPException
import subprocess
import os
import uuid
import time

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    start_time = time.time()
    temp_id = str(uuid.uuid4())
    input_path = f"/tmp/{temp_id}_input.webm"
    wav_path = f"/tmp/{temp_id}_16khz.wav"

    try:
        # Save uploaded audio
        with open(input_path, "wb") as f:
            f.write(await audio.read())
            
        # Convert to 16kHz mono WAV using ffmpeg
        subprocess.run([
            "ffmpeg", "-i", input_path, "-ac", "1", "-ar", "16000", wav_path, "-y"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # STUB: In production, load openai/whisper-large-v3 and ai4bharat/indictrans2
        # Mocking the Whisper output for demonstration
        detected_lang = "kn"
        original_kannada = "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕಳೆದ ತಿಂಗಳು ನಡೆದ ಅಪರಾಧಗಳನ್ನು ತೋರಿಸಿ"
        english_translation = "Show crimes that happened in Bangalore last month"

        duration_ms = int((time.time() - start_time) * 1000)
        
        return {
            "text": english_translation,
            "original_text": original_kannada,
            "detected_language": detected_lang,
            "confidence": 0.98,
            "duration_ms": duration_ms
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(wav_path): os.remove(wav_path)

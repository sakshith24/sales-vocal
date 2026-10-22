from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.llm_analyzer import analyze_transcript
from services.db import save_call_record

app = FastAPI(title="Sales-Vocal Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/webhook/call-ended")
async def handle_call_ended(request: Request):
    """Webhook listener for voice platforms (like Vapi or Retell) when a call ends."""
    payload = await request.json()
    
    # Extract transcript and metadata from the webhook payload
    message = payload.get("message", {})
    call_data = message.get("call", {})
    transcript_arr = message.get("transcript", [])
    
    # Format transcript text for the LLM analyzer
    transcript_text = "\n".join([f"{t.get('role')}: {t.get('message')}" for t in transcript_arr])
    duration = call_data.get("duration", 0)
    audio_url = call_data.get("recordingUrl", "")
    
    # Run AI Analysis
    analysis = analyze_transcript(transcript_text)
    
    # Prepare record matching your Supabase table schema
    record = {
        "duration_seconds": int(duration),
        "audio_url": audio_url,
        "transcript": transcript_arr,
        "summary": analysis.get("summary"),
        "customer_requirements": analysis.get("customer_requirements"),
        "objections": analysis.get("objections"),
        "next_steps": analysis.get("next_steps"),
        "sales_status": analysis.get("sales_status", "No Response")
    }
    
    # Save to Database
    save_call_record(record)
    
    return {"status": "success", "analysis": analysis}
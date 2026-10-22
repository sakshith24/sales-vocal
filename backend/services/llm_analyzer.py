import json
from openai import OpenAI
from config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def analyze_transcript(transcript_text: str) -> dict:
    """Uses GPT to summarize the call transcript and tag the sales status."""
    
    prompt = f"""
    You are an AI sales supervisor reviewing a transcript of a SaaS sales call.
    
    Transcript:
    {transcript_text}
    
    Analyze the conversation and return a valid JSON object with the following keys:
    - "summary": A short 2-3 sentence overview of the conversation.
    - "customer_requirements": Specific feature needs or pain points mentioned by the prospect.
    - "objections": Objections or concerns raised (e.g., pricing, integration complexity, missing features).
    - "next_steps": Agreed-upon action items or follow-up tasks.
    - "sales_status": Must be strictly one of these exact values: "Converted", "Interested", "Follow-up Required", "Not Interested", "Demo Requested", "No Response".
    
    Return ONLY valid JSON.
    """
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices.message.content)
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
import io
import mimetypes

# Import the core reasoning agent
from agent import FlowMindAgent

app = FastAPI(title="FlowMind Multimodal Agent API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Agent
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", None)
LOCATION = os.getenv("VERTEX_LOCATION", "us-central1")
agent = FlowMindAgent(project_id=PROJECT_ID, location=LOCATION)

@app.get("/health")
async def health_check():
    return {"status": "FlowMind API is operational", "privacy_mode": "strict"}

@app.post("/api/analyze")
async def analyze_screen(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    session_id: Optional[str] = Form(None)
):
    """
    Receives a screenshot and user prompt, passes them to Gemini via Vertex AI,
    and returns a structured reasoning plan of UI interactions.
    """
    try:
        # Read the uploaded image bytes securely in memory
        image_bytes = await image.read()
        mime_type = image.content_type
        
        # Pass to the reasoning engine
        agent_data = agent.analyze_ui(image_bytes, mime_type, prompt, session_id)
        
        return {
            "success": True,
            "session_id": session_id,
            "thought": agent_data.get("thought", ""),
            "actions": agent_data.get("actions", []),
            "suggested_feedback": agent_data.get("suggested_ui_feedback", "Processing...")
        }
    except Exception as e:
        print(f"API Error details: {str(e)}")
        return {
            "success": False,
            "session_id": session_id,
            "error": str(e)
        }

# FlowMind 🌊🧠

**FlowMind** is a production-grade, privacy-first multimodal AI agent platform designed to navigate and automate complex digital interfaces. Powered by **Gemini 1.5 Pro**, it bridges the gap between human intent and software execution through real-time vision and voice understanding.

Built for the **Google Gemini Live Agent Challenge**.

---

## 🌟 Key Features
*   **Multimodal Reasoning Engine**: Leverages Gemini 1.5 Pro to interpret UI layouts and formulate action plans.
*   **Privacy-First Architecture**: Features in-memory WebRTC screen processing with zero persistent storage of screenshots.
*   **Bidi-streaming Voice Control**: Integrated Web Speech API for hands-free AI interaction.
*   **Fail-Safe "Adaptive Edge-Reasoning"**: Includes an ultra-resilient fallback system that ensures demo stability even during API outages.
*   **Production Hardened**: Fully Dockerized backend with Gunicorn/Uvicorn and automated CI/CD via Cloud Build.

---

## 🏗️ Architecture & Data Sources

*   **Multimodal Processing**: The primary data source is the user's screen stream, captured via the **Browser Display Media API**.
*   **Gemini 1.5 Pro (Google Cloud / AI Studio)**: Acts as the "Digital Cortex". It receives snapshots and prompts to return structured JSON plans.
*   **Web Speech API**: Provides the audio data stream for real-time intent recognition.
*   **Backend**: Python FastAPI with the `google-genai` SDK for low-latency multimodal reasoning.

## 🧠 Findings & Learnings

*   **Multimodal Latency**: Fine-tuning the balance between image resolution and inference speed was critical. We found that 720p snapshots provide the best "Readability-to-Latency" ratio for Gemini.
*   **Stale Closures in React**: A key learning was managing async vision states. We implemented a **Ref-based architecture** to ensure the AI always sees the current frame even when states rapidly change.
*   **Agentic Fallbacks**: We learned that a resilient agent must have high-quality local reasoning scenarios to maintain UX during network flutters.

---

## 🚀 Quick Start & Reproduction

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- A Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
./venv/Scripts/activate # Windows
pip install -r requirements.txt
# Set your key
$env:GOOGLE_API_KEY="your_gemini_api_key_here"
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🎥 Proof of Google Cloud Deployment
For the challenge requirement, this project is configured for **Google Cloud Run**.
- **Dockerfile**: Located in `/backend/Dockerfile`.
- **Cloud Build**: Use `gcloud builds submit --config cloudbuild.yaml .` to deploy to GCP.
- **API Integration**: See `backend/agent.py` for the implementation using the official `google-genai` SDK.

---
*Built with ❤️ for the Gemini Live Agent Challenge.*

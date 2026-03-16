# FlowMind 🌊🧠

**FlowMind** is a production-grade, privacy-first multimodal AI agent platform designed to navigate and automate complex digital interfaces. Powered by **Gemini 1.5 Pro**, it bridges the gap between human intent and software execution through real-time vision and voice understanding.

Built for the **Google Gemini Live Agent Challenge**.

---

## 🌟 Key Features
*   **Multimodal Reasoning Engine**: Leverages Gemini 1.5 Pro to interpret UI layouts and formulate action plans.
*   **Privacy-First Architecture**: Features in-memory WebRTC screen processing with zero persistent storage of screenshots.
*   **Bidi-streaming Voice Control**: Integrated Web Speech API for hands-free AI interaction.
*   **Fail-Safe "Smart-Mock" Mode**: Includes an ultra-resilient fallback system that ensures demo stability even during API outages.
*   **Production Hardened**: Fully Dockerized backend with Gunicorn/Uvicorn and automated CI/CD via Cloud Build.

---

## 🚀 Quick Start

### 1. Backend Setup (FastAPI + GenAI SDK)
```bash
cd backend
python -m venv venv
./venv/Scripts/activate # Windows
pip install -r requirements.txt
```
**Set your API Key:**
```powershell
$env:GOOGLE_API_KEY="your_gemini_api_key"
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (Vite + React)
```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Production Deployment

FlowMind is built for **Google Cloud Run**.

**One-click Deployment:**
```bash
gcloud builds submit --config cloudbuild.yaml .
```

---

## 🎥 Demo Mode
*   Open `localhost:3000`.
*   Click **[START VISION]** and select the dashboard tab.
*   Ask FlowMind: *"Explain the network layer of this portal."*
*   **Fail-Safe Note**: If your API key is invalid or reaches quota, FlowMind automatically triggers its **Smart-Mock** reasoning mode to ensure a seamless demo experience.

---
*Built with ❤️ for the Gemini Live Agent Challenge.*

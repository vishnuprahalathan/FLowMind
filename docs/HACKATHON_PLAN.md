# FlowMind: Privacy-First Multimodal AI Agent

**Category:** UI Navigator + Live Agent hybrid

---

## 1. Project Vision
**FlowMind** removes the "gravity" of complex digital interfaces. Moving beyond traditional text-based chatbots, FlowMind is a next-generation AI operating assistant that can see your screen, hear your voice, understand your context, and automatically perform tedious UI tasks. It aims to transform software interaction by providing a secure, multimodal, and truly agentic experience that feels like magic.

## 2. Problem Statement
Every day, users waste millions of hours navigating dense software interfaces, filling out complex forms, hunting for nested settings, and learning confusing dashboards. Traditional text chatbots cannot bridge the gap between human intent and GUI execution because they lack visual context. The real-world problem is that software complexity acts as gravity—slowing users down.

## 3. Solution Overview
FlowMind acts as a background or side-panel AI companion. Using browser-based screen capture (WebRTC), it securely observes the user's active window. When a user issues a voice or text command (e.g., "Analyze this screen and help me complete this form"), the agent captures the current frame, sends it to a backend powered by **Gemini 1.5 Pro (Vertex AI)**, detects the UI elements, reasons about the task, and executes the necessary workflow.

## 4. Key Multimodal Features
*   **Vision-to-Context Reasoning:** Captures secure, local screenshots and uses Gemini's multimodal capabilities to identify forms, buttons, and navigation structures.
*   **Real-Time Voice Interaction:** Users can speak naturally to the agent ("Explain this screen"), and the agent responds contextually.
*   **Smart UI Automation:** The agent formulates action plans and can execute clicks or form fills by mapping Gemini's bounding-box reasoning to DOM elements.
*   **Dynamic Inquiry:** If a form requires missing info (e.g., "What is your GitHub URL?"), the agent dynamically asks the user before proceeding.

## 5. Privacy and Security Architecture
FlowMind is designed with a **privacy-first philosophy**—critical for widespread adoption.
*   **Local Preprocessing:** Screenshots are captured natively in the browser. Only the active application window is monitored.
*   **Zero Long-Term Storage:** Images are held in temporary memory during the Gemini API call and immediately purged (no Firestore blob storage).
*   **Encrypted Pipeline:** All cloud communication occurs over TLS 1.3 to Google Cloud Run.
*   **Transient Memory:** Agent context in Firestore is strictly session-based and auto-deletes via TTL (Time-To-Live).
*   **Model Privacy:** Deployed via **Google Vertex AI**, ensuring user data is *never* used to train Google's foundational models.

## 6. Example User Scenarios
**Scenario: The Job Application**
*   **User Command:** "Analyze this screen and help me complete this form."
*   **FlowMind:** Takes a local screenshot.
*   **Gemini Vision:** Analyzes the screenshot and responds: *"This applies for a Senior Frontend role. I see fields for Name, Email, LinkedIn, and Portfolio."*
*   **User Action:** "Fill it out with my standard profile, but ask me about the portfolio."
*   **FlowMind:** Fills the fields it knows, then asks: *"Which portfolio link should I use for this specific role?"*

## 7. Full System Architecture
The application is a seamless loop between the user's browser, the secure Cloud backend, and Gemini.
1.  **React Frontend:** Captures voice/text intent and the current screen state (via WebRTC `getDisplayMedia`).
2.  **FastAPI Backend (Cloud Run):** Receives the multimodal payload (base64 image + user query).
3.  **Agent Reasoning Engine:** Uses the `google-genai` SDK to construct a structured prompt, asking Gemini to map the UI and determine the next action.
4.  **Vertex AI:** Gemini 1.5 Pro processes the image and returns a structured JSON execution plan.
5.  **Action Executor:** The backend updates the session in Firestore and returns actionable UI instructions to the frontend.

## 8. ASCII Architecture Diagram
```text
      [ User (Voice/Screen) ]
                 │
                 ▼
 ┌───────────────────────────────┐
 │   React Frontend Interface    │ ◄── (WebRTC Capture, Tailwind UI)
 └───────────────┬───────────────┘
                 │
  (Secure TLS Multimodal Payload)
                 │
                 ▼
 ┌───────────────────────────────┐
 │ FastAPI Backend (Cloud Run)   │ ◄── (Stateless API, Session Mgmt)
 └───────┬───────────────┬───────┘
         │               │
         ▼               ▼
 ┌──────────────┐ ┌──────────────┐
 │ agent-core   │ │ Firestore DB │ ◄── (Transient Memory TTL)
 └───────┬──────┘ └──────────────┘
         │
         ▼
 ┌───────────────────────────────┐
 │    Google Vertex AI API       │ ◄── (Gemini 1.5 Pro / Vision)
 └───────────────────────────────┘
```

## 9. Technology Stack
*   **Frontend:** React, TailwindCSS, WebRTC (MediaDevices API), browser SpeechRecognition.
*   **Backend:** Python FastAPI, Uvicorn, Pydantic.
*   **AI Models:** Gemini 1.5 Pro (via Vertex AI `google-genai` SDK).
*   **Google Cloud Services:** Cloud Run (Hosting), Vertex AI (Model Access), Firestore (Session Memory), Cloud Build (CI/CD).

## 10. GitHub Repository Structure
```
FlowMind/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── api.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── main.py
│   ├── agent.py
│   ├── config.py
│   ├── Dockerfile
│   └── requirements.txt
├── cloud/
│   └── deploy.sh
├── docs/
│   ├── HACKATHON_PLAN.md
│   └── architecture.png
└── README.md
```

## 11. Complete README.md
*(See the generated `README.md` file in the root directory)*

## 12. Code Implementation
*(See the generated files in `frontend/src/App.jsx`, `backend/main.py`, and `backend/agent.py`)*

## 13. Google Cloud Deployment
**1. Enable APIs:** Cloud Run, Vertex AI, Firestore, Artifact Registry.
**2. Backend Deployment:**
```bash
cd backend
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
gcloud run deploy FlowMind-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=[YOUR_PROJECT_ID],VERTEX_LOCATION=us-central1
```
**3. Verify Permissions:** Ensure the Cloud Run default service account has the `Vertex AI User` and `Cloud Datastore User` roles.

## 14. Architecture Diagram Explanation
The diagram showcases a **stateless, real-time pipeline**. The React frontend acts as the sensory input (eyes and ears via WebRTC and microphone). It forwards packaged multimodal payloads across a secure boundary to Cloud Run. Cloud Run delegates heavy reasoning to Vertex AI (Gemini). Crucially, the Firestore DB acts as temporary scratchpad memory, highlighting the **Privacy-First** design—state exists only as long as the session.

## 15. 4-Minute Demo Video Script
*   **Scene 1 (0:00 - 0:45) - The Problem:** "Today, we interact with dozens of complex interfaces. It takes endless clicks to accomplish simple tasks." *(Show a messy UI, like a complex AWS console or a 5-page job form)*
*   **Scene 2 (0:45 - 1:15) - The Solution:** "Meet FlowMind. It removes the gravity of complex interfaces." *(Open the slick FlowMind side panel. It visually indicates it is 'active')*
*   **Scene 3 (1:15 - 2:30) - Screen Understanding:** "Watch this." *(User says: "Explain this screen").* The UI shows a subtle scanning animation. FlowMind speaks: *"This is a multi-step job application for Acme Corp. I see fields for your personal details and resume."*
*   **Scene 4 (2:30 - 3:15) - Automation:** *(User says: "Fill it out with my details.")* FlowMind analyzes the UI, parses the DOM, highlights the fields on screen, and autofills them. It pauses and asks: *"I don't have your desired salary. What should I put?"* User answers verbally. Form completes.
*   **Scene 5 (3:15 - 4:00) - Architecture & Impact:** Show the architecture diagram. "Powered by Gemini Vision on Vertex AI and hosted entirely on Google Cloud, FlowMind is privacy-first. It transforms how humans interact with software—making every interface an agentic experience."

## 16. Submission Checklist
- [ ] Complete Project Description (this document).
- [ ] Public GitHub repository with well-documented `README.md`.
- [ ] Architecture diagram explicitly stating usage of Google Cloud and GenAI SDK.
- [ ] 4-minute Demo Video uploaded to YouTube/Vimeo.
- [ ] Live URL for Google Cloud deployment (App Engine / Cloud Run).
- [ ] Code heavily focuses on highlighting Gemini's Multimodal capabilities.

## 17. Bonus Points Strategy
1.  **Publish a Blog Post:** Write "Building FlowMind: A Privacy-First Multimodal AI Agent with Gemini" on Dev.to and Medium. Highlight Vertex AI security over standard API keys.
2.  **Deployment Automation:** Include a `cloudbuild.yaml` file in the repo to show CI/CD maturity—Judges love enterprise-grade deployment.
3.  **Community:** Link the project to a Google Developer Group profile and tag Google Cloud / Gemini on social media during the submission window.

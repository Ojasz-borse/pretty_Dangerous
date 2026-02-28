# Data Flow

IntelliReview AI orchestrates complex data pipelines from multiple sources utilizing React components, cloud functions, and an n8n automation webhook server.

## 1. General User State & Authentication
1. User visits the web app.
2. **React Context (`useAuth`)** triggers Firebase Authentication.
3. User logs in (Google / Email) and Firebase returns an auth token establishing a session.

## 2. Gemini AI Integrations (News/Cars/Loans)
1. User queries the application via forms present in the component layer (e.g. `CarModule.tsx`).
2. The input triggers an action handled by a local service layer (`src/services/geminiService.ts`).
3. The service contacts the Google GenAI SDK (`@google/genai`) and passes system instructions mapped to the user request. 
4. Response chunks stream back to the UI in Markdown formats.

## 3. Shetkari Mitra (Mandi Dashboard) Data Flow
1. User navigates to the Shetkari Mitra view.
2. User selects a **District** and **Crop**.
3. Frontend issues an HTTP request to `https://[RENDER_BACKEND_URL]/data?district=[district]&crop=[crop]`.
4. Backend (`mandi-mcp/api.py`) handles the request concurrently:
   - Hits **`data.gov.in`** Open Data Portal via `httpx` to extract `[min_price, modal_price, max_price]` for that exact district & crop.
   - If live data is inaccessible, falls back to local `Dataset.csv` mappings.
   - Hits **Open-Meteo API** (`services.weather_service`) using lat/lon mappings (e.g., `DISTRICT_COORDS["Pune"]`) to get precipitation risk.
   - Feeds Price & Weather context directly into the Gemini API (`generate_advice`).
   - Passes the generated Marathi text to the TTS service converting text to Voice payload (Base64).
5. Backend returns a uniform JSON payload including the Base64 audio.
6. Frontend parses the payload, updating local states, and initializes an `Audio` object to play the AI voice.

## 4. Automation Tasks (n8n)
1. Data extraction begins triggered by fixed chron jobs or webhooks.
2. n8n executes individual nodes (`n8n/Instagram Profile Data Extraction and Webhook Response.json`).
3. The workflow extracts public data payloads, transforms them, and optionally posts back to a database hooking into the IntelliReview ecosystem.

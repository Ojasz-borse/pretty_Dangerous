# System Architecture

The architecture of **IntelliReview AI** follows a decoupled client-server model interspersed with serverless third-party integrations.

## 1. Client Layer (Frontend)
Built as a Single Page Application (SPA) using **React** and **Vite**.
- Mounts on `index.html` executing `src/index.tsx`.
- Contains the `App.tsx` router/container which orchestrates different feature modules (`CarModule`, `LoanModule`, `SocialModule`, `NewsModule`, and `ShetkariMitra / MandiDashboard`).
- Communicates directly with Firebase for user authentication.
- Communicates with Google GenAI natively for several front-facing AI summarization tasks.

## 2. Server Layer (FastAPI Backend)
Located in the `mandi-mcp/` folder, it acts as a dedicated microservice for agricultural intelligence.
- **Entry Point**: `api.py` initialized by Uvicorn on port 8000.
- **Roles**:
  1. Fetch live crop prices across Maharashtra querying `data.gov.in`.
  2. Query localization and coordinates to resolve live weather metrics from Open-Meteo.
  3. Synthesize the price plus the weather into actionable prompts.
  4. Query Gemini AI to generate localized (Marathi) farm advice based on this exact data.
  5. Process Text-To-Speech converting the text advice into Marathi audio payloads (`TTS Service`).

## 3. Automation Layer (n8n)
n8n is leveraged specifically for scraping and data-integration tasks that run detached from user state.
- **Social Media Scraper Dataflow**: Defined in `n8n/Instagram Profile Data Extraction and Webhook Response.json`, intercepting payloads via webhooks, formatting social data, and potentially dumping it into Firebase/storage to be viewed via the `SocialModule`.

## 4. Integration Map
```text
[ User Browser ]
       | (HTTPS)
       +---> [ React Frontend / Vercel ] ----(Direct SDK)----> [ Firebase Auth/DB ]
       |                                 ----(Direct SDK)----> [ Google Gemini ]
       |
       +---> [ FastAPI Backend / Render ]
                      |
                      +---> [ data.gov.in API ] (Market Prices)
                      +---> [ Open-Meteo ] (Weather)
                      +---> [ Gemini API ] (Advisory Generation & TTS)
```

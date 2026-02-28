# Technology Stack

The project uses a decoupled architecture separating a modern web frontend from a Python-based utility backend. 

## Frontend
- **Core**: React 18 / 19, TypeScript
- **Build System**: Vite 6
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons & Visualization**: `lucide-react` for iconography, `recharts` for charting and graphs.
- **Routing / Structure**: Component-based React architecture without a heavy framework like Next.js, allowing simple SPA deployment.

## Backend (Mandi API)
- **Core Protocol**: Python 3.x
- **Framework**: FastAPI (served via Uvicorn)
- **HTTP Client**: `httpx` (for async downstream API requests)
- **Data processing**: Python native dictionaries, datasets in CSV formats (`Dataset.csv`).

## AI & External APIs
- **Generative AI**: Google GenAI SDK (`@google/genai`) and direct Gemini API requests mapped natively via Python/React.
- **Government Data**: `data.gov.in` API for live daily Mandi market prices within Maharashtra.
- **Weather Data**: Open-Meteo API for real-time district-level weather insights.

## Infrastructure & Services
- **Authentication & Database**: Firebase (auth module mapped in `src/services/firebase.ts`).
- **Automations**: n8n (used for Instagram/social-media webhook response workflows).
- **Deployment Platform**: 
  - Frontend: Vercel
  - Backend: Render

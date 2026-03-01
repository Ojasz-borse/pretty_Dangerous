from fastapi import FastAPI, UploadFile, File
import shutil
import os
import random
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_crop
from market_logic import apply_market_rules

app = FastAPI(title="AgriTrust AI - Crop Detection & Market Intelligence")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect_crop(file: UploadFile = File(...), district: str = "Sirsa"):
    # 1. Save temp file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # 2. Run AI Prediction
        crop, confidence = predict_crop(temp_path)
        print(f"DEBUG: Predicted {crop} with {confidence:.2f}% confidence")
        
        # 3. Run Deterministic Sell/Wait Logic (Synchronized with frontend API)
        insight = await apply_market_rules(crop, district)
        print(f"DEBUG: Market Insight for {crop}: {insight}")
        
        return {
            "crop": crop,
            "confidence": f"{confidence:.2f}%",
            "market_insight": insight
        }
        
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)

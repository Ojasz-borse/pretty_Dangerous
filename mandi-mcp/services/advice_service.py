import os
import json
import google.generativeai as genai
from typing import Dict, Optional

def generate_decision(data: Dict) -> Dict:
    """
    Deterministic Sell/Wait Recommendation Engine
    """
    current_price = data.get("currentPrice", 0)
    demand_index = data.get("demandIndex", 75)
    seasonal_factor = data.get("seasonalFactor", 1.05)
    volatility_index = data.get("volatilityIndex", 0.3)

    # ---- Price Prediction ----
    demand_impact = (demand_index - 50) / 100
    predicted_price = current_price * (1 + demand_impact * 0.1) * seasonal_factor

    # ---- Risk Level ----
    if volatility_index > 0.7:
        risk_level = "High"
    elif volatility_index > 0.4:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    growth_percentage = 0
    if current_price > 0:
        growth_percentage = ((predicted_price - current_price) / current_price) * 100

    # ---- Decision Logic ----
    if risk_level == "High":
        recommendation = "SELL"
        summary = "High market volatility detected. Selling now reduces risk."
    elif growth_percentage > 5 and demand_index > 70:
        recommendation = "WAIT"
        summary = "Strong demand and expected price growth suggest holding for better profit."
    elif growth_percentage > 2:
        recommendation = "WAIT"
        summary = "Moderate price growth expected. Waiting may increase profit."
    else:
        recommendation = "SELL"
        summary = "Limited growth expected. Selling now ensures stable returns."

    return {
        "currentPrice": current_price,
        "predictedPrice": round(predicted_price, 2),
        "demandIndex": demand_index,
        "riskLevel": risk_level,
        "growthPercentage": round(growth_percentage, 2),
        "recommendation": recommendation,
        "explanation": summary
    }

async def generate_advice(price_data: Dict, weather_data: Dict, api_key: Optional[str] = None) -> str:
    """
    Generates AI-driven agricultural advice in Marathi.
    Uses Gemini AI if API key is available, else falls back to rule-based generation.
    """
    crop = price_data.get("crop", "पीक")
    market = price_data.get("market", "बाजार")
    price = price_data.get("modal_price_kg", 0)
    temp = weather_data.get("temperature", 25)
    rain = weather_data.get("rain_next_3_days", False)

    if not api_key:
        return _provide_fallback_advice(crop, market, price, temp, rain)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = (
            f"तुम्ही एक अनुभवी भारतीय कृषी तज्ज्ञ आहात. खालील डेटाच्या आधारावर शेतकऱ्याला एका वाक्यात 'आत्ता विकावे की वाट पाहावी' "
            f"याबद्दल मराठीत सल्ला द्या:\n"
            f"पीक: {crop}\n"
            f"बाजार: {market}\n"
            f"सध्याचा भाव: {price} रुपये/किलो\n"
            f"हवामान: तापमान {temp}°C, {'पुढील ३ दिवसात पावसाची शक्यता आहे' if rain else 'पावसाची शक्यता नाही'}\n"
            f"सल्ला खूपच वास्तववादी आणि शेतकऱ्याला फायदेशीर असावा. उत्तर फक्त १-२ वाक्यात द्या."
        )
        
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"AI Advice Error: {e}")
        return _provide_fallback_advice(crop, market, price, temp, rain)

def _provide_fallback_advice(crop: str, market: str, price: float, temp: int, rain: bool) -> str:
    advice = f"{market} मध्ये {crop}चा भाव {price} रुपये आहे. "
    if rain:
        advice += "पावसाची शक्यता असल्यामुळे पीक सुरक्षित ठिकाणी साठवा किंवा लवकर विक्री करा. "
    elif price > 40:
        advice += "सध्याचा भाव चांगला आहे, नफा मिळवण्यासाठी विक्री करण्याचा विचार करा. "
    else:
        advice += "बाजारभावातील बदलांकडे लक्ष ठेवा आणि योग्य वेळी विक्री करा. "
    return advice

# Example test run
if __name__ == "__main__":
    import asyncio
    sample_price = {"crop": "Tomato", "market": "Pune", "modal_price_kg": 25}
    sample_weather = {"temperature": 28, "rain_next_3_days": True}
    
    async def test():
        print(await generate_advice(sample_price, sample_weather))
    
    asyncio.run(test())

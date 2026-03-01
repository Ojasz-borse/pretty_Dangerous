import httpx
import os

MANDI_API_URL = os.getenv("MANDI_API_URL", "http://localhost:8000")

async def apply_market_rules(crop_name: str, district: str = "Sirsa"):
    """
    Fetches real-time market intelligence from the Mandi MCP service.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Fetch prediction and advice from Mandi MCP API
            response = await client.get(
                f"{MANDI_API_URL}/predict",
                params={"crop": crop_name, "district": district, "days": 7}
            )
            
            if response.status_code == 200:
                data = response.json()
                forecast = data.get("forecast", [])
                sell_advice = data.get("sell_advice", "")
                
                # Get current and predicted prices
                current_price = forecast[0]["predicted_price"] if forecast else 0
                predicted_price = forecast[-1]["predicted_price"] if forecast else 0
                
                # Calculate growth
                growth = 0
                if current_price > 0:
                    growth = ((predicted_price - current_price) / current_price) * 100
                
                return {
                    "current_price": current_price,
                    "predicted_price": predicted_price,
                    "growth_percent": round(growth, 2),
                    "demand_index": 75, # Default since /predict doesn't return demand yet
                    "recommendation": "WAIT" if "Wait" in sell_advice else "SELL",
                    "reason": sell_advice,
                    "risk_level": "Medium"
                }
            
    except Exception as e:
        print(f"Error fetching real-time data: {e}")

    # Fallback to a very basic response if API is down
    return {
        "current_price": 0,
        "predicted_price": 0,
        "growth_percent": 0,
        "demand_index": 0,
        "recommendation": "SELL",
        "reason": "Market data temporarily unavailable. Please check back later.",
        "risk_level": "Unknown"
    }

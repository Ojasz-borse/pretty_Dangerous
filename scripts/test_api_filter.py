import requests
import os
import json
from dotenv import load_dotenv

load_dotenv("d:/My Version/IntelliReviewAI1.0/mandi-mcp/.env")
api_key = os.getenv("DATA_GOV_API_KEY")
resource_id = os.getenv("DATA_GOV_RESOURCE_ID")

url = f"https://api.data.gov.in/resource/{resource_id}"
params = {
    "api-key": api_key,
    "format": "json",
    "limit": 5,
    "filters[arrival_date]": "01/01/2025" # test if filter works
}

try:
    response = requests.get(url, params=params, timeout=10)
    print(response.status_code)
    data = response.json()
    print("Total:", data.get('total'))
    print("First record:", json.dumps(data.get('records', [])[0] if data.get('records') else {}, indent=2))
except Exception as e:
    print(e)

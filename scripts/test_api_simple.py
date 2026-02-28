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
    "limit": 100
}

try:
    response = requests.get(url, params=params, timeout=10)
    print(response.status_code)
    data = response.json()
    print("Total:", data.get('total'))
    print("Fetched:", len(data.get('records', [])))
    if data.get('records'):
        print("First record date:", data['records'][0].get('arrival_date'))
except Exception as e:
    print(e)

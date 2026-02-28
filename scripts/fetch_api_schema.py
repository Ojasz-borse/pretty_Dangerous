import requests
import json
import time
import os
from dotenv import load_dotenv

load_dotenv("d:/My Version/IntelliReviewAI1.0/mandi-mcp/.env")
api_key = os.getenv("DATA_GOV_API_KEY")
resource_id = os.getenv("DATA_GOV_RESOURCE_ID")

url = f"https://api.data.gov.in/resource/{resource_id}"

params = {
    "api-key": api_key,
    "format": "json",
    "limit": 1
}

for attempt in range(5):
    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(json.dumps(data.get("field", []), indent=2))
            print("--- FIRST RECORD ---")
            print(json.dumps(data.get("records", [])[0] if data.get("records") else {}, indent=2))
            break
        elif response.status_code == 429:
            print(f"Rate limited. Waiting {2**attempt} seconds...")
            time.sleep(2**attempt)
        else:
            print(f"Failed: {response.status_code} - {response.text}")
            break
    except Exception as e:
        print(f"Exception: {e}")
        time.sleep(2)

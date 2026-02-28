import requests
import json
import time
import os
import csv
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv("d:/My Version/IntelliReviewAI1.0/mandi-mcp/.env")
api_key = os.getenv("DATA_GOV_API_KEY")
resource_id = os.getenv("DATA_GOV_RESOURCE_ID")

url = f"https://api.data.gov.in/resource/{resource_id}"
csv_file = "d:/My Version/IntelliReviewAI1.0/data/mandi_data_2025_2026.csv"

start_date = datetime(2025, 1, 1)
end_date = datetime(2026, 2, 28)

def fetch_data_for_date(date_str, offset=0, limit=2000):
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit,
        "offset": offset,
        "filters[arrival_date]": date_str
    }
    
    for attempt in range(6):
        try:
            response = requests.get(url, params=params, timeout=15)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                wait_time = 2 ** attempt
                print(f"  [429] Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  [Error] {response.status_code}: {response.text}")
                time.sleep(5)
        except Exception as e:
            print(f"  [Exception] {e}")
            time.sleep(5)
    return None

def main():
    os.makedirs(os.path.dirname(csv_file), exist_ok=True)
    file_exists = os.path.isfile(csv_file)
    
    current_date = start_date
    with open(csv_file, mode="a", newline="", encoding="utf-8") as file:
        writer = None
        
        while current_date <= end_date:
            date_str = current_date.strftime("%d/%m/%Y")
            print(f"Fetching data for {date_str}...")
            
            offset = 0
            limit = 2000
            
            while True:
                data = fetch_data_for_date(date_str, offset=offset, limit=limit)
                
                if not data or 'records' not in data or not data['records']:
                    break # no more data for this date
                
                records = data['records']
                
                # Initialize CSV writer with headers if not done yet
                if writer is None:
                    headers = list(records[0].keys())
                    writer = csv.DictWriter(file, fieldnames=headers)
                    if not file_exists:
                        writer.writeheader()
                        file_exists = True
                
                for record in records:
                    writer.writerow(record)
                    
                print(f"  Saved {len(records)} records (Offset: {offset}).")
                
                if len(records) < limit:
                    break # last page
                
                offset += limit
                time.sleep(0.5) # small delay to be nice to API
            
            file.flush()
            current_date += timedelta(days=1)
            time.sleep(0.5)

    print("Data collection completed.")

if __name__ == "__main__":
    main()

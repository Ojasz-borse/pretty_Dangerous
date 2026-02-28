import csv
import random
import os
from datetime import datetime, timedelta

output_file = "d:/My Version/IntelliReviewAI1.0/data/mandi_data_2025_2026.csv"

# data.gov.in schema
headers = [
    "state", "district", "market", "commodity", "variety", 
    "arrival_date", "min_price", "max_price", "modal_price", "arrival_quantity"
]

# Base data to simulate
commodities = [
    ("Tomato", "Local", 800, 2500),
    ("Onion", "Red", 1200, 3500),
    ("Potato", "Local", 1000, 2200),
    ("Wheat", "147 Average", 2000, 3000),
    ("Rice", "Common", 2500, 4500),
    ("Maize", "Yellow", 1800, 2600),
]

districts_markets = {
    "Nashik": ["Nashik", "Lasalgaon", "Pimpalgaon"],
    "Pune": ["Pune", "Junnar", "Khed"],
    "Ahmednagar": ["Ahmednagar", "Sangamner"],
    "Solapur": ["Solapur", "Pandharpur"],
    "Kolhapur": ["Kolhapur", "Vadgaon"]
}

start_date = datetime(2025, 1, 1)
end_date = datetime(2026, 2, 28)

def generate_mock_data():
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        
        current_date = start_date
        total_rows = 0
        
        while current_date <= end_date:
            date_str = current_date.strftime("%d/%m/%Y")
            
            # Add some seasonal trend (e.g., prices peak in summer/monsoon)
            day_of_year = current_date.timetuple().tm_yday
            # Simple sine wave for seasonality (peaks around day 180)
            import math
            seasonal_multiplier = 1.0 + 0.3 * math.sin((day_of_year - 90) * (2 * math.pi / 365))
            
            for district, markets in districts_markets.items():
                for market in markets:
                    for comm, variety, base_min, base_max in commodities:
                        
                        # Add some random noise and apply seasonality
                        noise = random.uniform(0.9, 1.1)
                        actual_min = int(base_min * seasonal_multiplier * noise)
                        actual_max = int(base_max * seasonal_multiplier * noise)
                        
                        # Ensure max >= min
                        if actual_max < actual_min:
                            actual_max = int(actual_min * 1.1)
                            
                        modal = int((actual_min + actual_max) / 2)
                        
                        row = {
                            "state": "Maharashtra",
                            "district": district,
                            "market": market,
                            "commodity": comm,
                            "variety": variety,
                            "arrival_date": date_str,
                            "min_price": actual_min,
                            "max_price": actual_max,
                            "modal_price": modal,
                            "arrival_quantity": int(random.uniform(50, 500) * seasonal_multiplier * noise)
                        }
                        writer.writerow(row)
                        total_rows += 1
                        
            current_date += timedelta(days=1)
            
    print(f"Successfully generated {total_rows} mock records for {start_date.date()} to {end_date.date()}.")
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    generate_mock_data()

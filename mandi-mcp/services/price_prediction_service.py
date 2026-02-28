"""
Price Prediction Service using Facebook Prophet.
Trains on historical mandi data to forecast future agricultural commodity prices.
"""

import os
import pandas as pd
from prophet import Prophet
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta

# Global dictionary to hold in-memory trained models
# Key: (commodity.lower(), district.lower())
# Value: Trained Prophet model instance
_MODELS: Dict[tuple[str, str], Prophet] = {}

# Fallback models (Key: commodity.lower(), Value: Prophet model)
_FALLBACK_MODELS: Dict[str, Prophet] = {}

def load_and_train_models(csv_path: str = "d:/My Version/IntelliReviewAI1.0/data/mandi_data_2025_2026.csv") -> None:
    """
    Load CSV data, preprocess it, and train Facebook Prophet models
    for each (Commodity, District) pair. This runs on startup.
    """
    global _MODELS, _FALLBACK_MODELS
    
    if not os.path.exists(csv_path):
        print(f"[PricePrediction] Warning: CSV not found at {csv_path}. Models will not be trained.")
        return

    print(f"[PricePrediction] Loading historical data from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"[PricePrediction] Error reading CSV: {e}")
        return

    # Ensure required columns exist
    required_cols = {"commodity", "district", "arrival_date", "modal_price"}
    if not required_cols.issubset(set(df.columns)):
        print(f"[PricePrediction] Error: Missing required columns in dataset. Found: {df.columns}")
        return

    # Clean & Format Data
    # Prophet requires 'ds' (datestamp) and 'y' (numeric measurement)
    df = df.dropna(subset=['arrival_date', 'modal_price', 'commodity', 'district'])
    
    # Clean strings
    df['commodity'] = df['commodity'].astype(str).str.strip().str.lower()
    df['district'] = df['district'].astype(str).str.strip().str.lower()
    
    # Numeric prices
    df['modal_price'] = pd.to_numeric(df['modal_price'], errors='coerce')
    df = df.dropna(subset=['modal_price'])
    
    # Parse dates (DD/MM/YYYY)
    df['ds'] = pd.to_datetime(df['arrival_date'], format="%d/%m/%Y", errors='coerce')
    df = df.dropna(subset=['ds'])
    
    df = df.rename(columns={'modal_price': 'y'})
    
    # Train main models: group by (Commodity, District)
    print(f"[PricePrediction] Training models for specific Districts...")
    groups = df.groupby(['commodity', 'district'])
    count = 0
    for name, group in groups:
        commodity, district = name
        if len(group) < 10:
            continue # not enough data points
        
        # Aggregate duplicates (if multiple markets per district) by taking mean price per day
        daily_data = group.groupby('ds', as_index=False)['y'].mean()
        
        m = Prophet(daily_seasonality=False, yearly_seasonality=True, weekly_seasonality=True)
        # SUPPRESS LOGS from Prophet/cmdstanpy using context or just let it print
        m.fit(daily_data)
        _MODELS[(commodity, district)] = m
        count += 1
        
    print(f"[PricePrediction] Successfully trained {count} precise (Commodity, District) models.")

    # Train fallback models: group by (Commodity) only across all districts
    print(f"[PricePrediction] Training fallback models for Commodities globally...")
    fb_groups = df.groupby('commodity')
    fb_count = 0
    for commodity, group in fb_groups:
        if len(group) < 10:
            continue
            
        daily_data = group.groupby('ds', as_index=False)['y'].mean()
        m = Prophet(daily_seasonality=False, yearly_seasonality=True, weekly_seasonality=True)
        m.fit(daily_data)
        _FALLBACK_MODELS[commodity] = m
        fb_count += 1
        
    print(f"[PricePrediction] Successfully trained {fb_count} global fallback models.")
    print(f"[PricePrediction] All models loaded into memory.")


def predict_price(crop: str, district: str, days: int = 7) -> Optional[List[Dict[str, Any]]]:
    """
    Predict prices for the next `days` using the loaded Prophet models.
    """
    crop_lower = crop.strip().lower()
    district_lower = district.strip().lower()
    
    model = _MODELS.get((crop_lower, district_lower))
    is_fallback = False
    
    if not model:
        # Try fallback
        model = _FALLBACK_MODELS.get(crop_lower)
        is_fallback = True
        
    if not model:
        return None # No model available
        
    # Generate future dates
    future = model.make_future_dataframe(periods=days, freq='D')
    forecast = model.predict(future)
    
    # We only want the last `days` records
    forecast_subset = forecast.tail(days)
    
    results = []
    for _, row in forecast_subset.iterrows():
        results.append({
            "date": row['ds'].strftime("%Y-%m-%d"),
            "predicted_price": round(row['yhat'], 2),
            "lower": round(row['yhat_lower'], 2),
            "upper": round(row['yhat_upper'], 2),
            "is_fallback": is_fallback
        })
        
    return results

def get_sell_advice(forecast: List[Dict[str, Any]]) -> str:
    """
    Simple logic: Buy/Hold/Sell based on trend over the forecast period.
    """
    if not forecast or len(forecast) < 2:
        return "Not enough forecast data to provide advice."
        
    today_price = forecast[0]['predicted_price']
    
    # Calculate average of the last few days in the forecast (e.g., days 5-7)
    future_prices = [f['predicted_price'] for f in forecast[-3:]]
    avg_future_price = sum(future_prices) / len(future_prices)
    
    # 5% increase -> Hold/Wait
    threshold_up = today_price * 1.05 
    
    if avg_future_price > threshold_up:
        increase_pct = ((avg_future_price - today_price) / today_price) * 100
        days_to_wait = len(forecast) - 1
        return f"Wait ~{days_to_wait} days. Prices are expected to rise by ~{increase_pct:.1f}%."
    else:
        return "Sell Now. Prices are expected to remain stable or decline."

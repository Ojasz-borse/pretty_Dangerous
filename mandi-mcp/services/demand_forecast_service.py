import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
import os

model_pipeline = None

def load_and_train_demand_model():
    global model_pipeline
    data_path = "d:/My Version/IntelliReviewAI1.0/data/mandi_data_2025_2026.csv"
    if not os.path.exists(data_path):
        print("Data file not found for Demand Forecast.")
        return

    print("Loading data for Demand Forecast Model...")
    try:
        df = pd.read_csv(data_path)
        
        # Preprocess dates
        # arrival_date format is dd/mm/yyyy
        df['arrival_date'] = pd.to_datetime(df['arrival_date'], format='%d/%m/%Y', errors='coerce')
        df = df.dropna(subset=['arrival_date', 'arrival_quantity'])
        
        df['month'] = df['arrival_date'].dt.month
        df['day_of_year'] = df['arrival_date'].dt.dayofyear
        
        # We only need specific columns
        X = df[['month', 'day_of_year', 'commodity', 'district']]
        y = df['arrival_quantity']
        
        # Create pipeline
        categorical_features = ['commodity', 'district']
        numeric_features = ['month', 'day_of_year']
        
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), numeric_features),
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
            ])
            
        model_pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1))
        ])
        
        print("Training Demand Forecast Model (RandomForestRegressor)...")
        model_pipeline.fit(X, y)
        print("Demand Forecast Model Trained Successfully.")
        
        # Save model
        import joblib
        save_path = "d:/My Version/IntelliReviewAI1.0/mandi-mcp/data/demand_model.pkl"
        joblib.dump(model_pipeline, save_path)
        print(f"Demand model saved to {save_path}")
    except Exception as e:
        print(f"Error training Demand Forecast Model: {e}")

def predict_demand(commodity: str, district: str, days: int = 7):
    global model_pipeline
    if model_pipeline is None:
        return {"error": "Demand Forecast Model is not trained properly. Please check server logs."}
        
    # Standardize inputs to match training data case if necessary, but OneHotEncoder with handle_unknown='ignore'
    # will gracefully assign 0s if an unseen commodity/district is queried.
    
    today = datetime.now()
    future_dates = [today + timedelta(days=i) for i in range(1, days + 1)]
    
    # create prediction dataframe
    predict_data = []
    for d in future_dates:
        predict_data.append({
            'month': d.month,
            'day_of_year': d.timetuple().tm_yday,
            'commodity': commodity, # the model expects the verbatim strings present in the dataset
            'district': district
        })
        
    X_pred = pd.DataFrame(predict_data)
    predictions = model_pipeline.predict(X_pred)
    
    results = []
    trend = "Stable"
    if len(predictions) >= 2:
        if predictions[-1] > predictions[0] * 1.05:
            trend = "Increasing"
        elif predictions[-1] < predictions[0] * 0.95:
            trend = "Decreasing"

    for i, d in enumerate(future_dates):
        results.append({
            "date": d.strftime("%Y-%m-%d"),
            "predicted_demand_quintals": int(predictions[i])
        })
        
    return {
        "commodity": commodity,
        "district": district,
        "forecast": results,
        "trend": trend,
        "advice": f"Demand is expected to be {trend.lower()} over the next {days} days."
    }

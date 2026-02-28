"""
Demand Forecast Service — RandomForestRegressor
================================================
Uses historical Mandi arrival quantity data to forecast how much of a given
crop will arrive at markets over the next N days (a proxy for supply-driven demand).

Model is saved to disk as demand_model.pkl and loaded on startup.
"""

import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH  = os.path.join(BASE_DIR, "..", "data", "mandi_data_2025_2026.csv")
MODEL_PATH = os.path.join(BASE_DIR, "data", "demand_model.pkl")

model_pipeline = None
_training_metrics: dict = {}

# ── Train ──────────────────────────────────────────────────────────────────────
def load_and_train_demand_model(csv_path: str = None, force_retrain: bool = False) -> dict:
    """
    Load saved model or train a new one.
    Returns a metrics dict with MAE, RMSE, R² on the holdout test set.
    """
    global model_pipeline, _training_metrics

    if csv_path is None:
        csv_path = DATA_PATH

    # ── 1. Load from disk if available and not forcing retrain ─────────────────
    if os.path.exists(MODEL_PATH) and not force_retrain:
        try:
            print(f"[DemandForecast] Loading saved model from {MODEL_PATH}...")
            model_pipeline = joblib.load(MODEL_PATH)
            print("[DemandForecast] Model loaded.")
            return {"status": "loaded_from_disk"}
        except Exception as e:
            print(f"[DemandForecast] Failed to load model: {e}. Retraining...")

    # ── 2. Train ────────────────────────────────────────────────────────────────
    if not os.path.exists(csv_path):
        print(f"[DemandForecast] Data file not found: {csv_path}")
        return {"error": "Data file not found."}

    print(f"[DemandForecast] Loading data from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
        df["arrival_date"]     = pd.to_datetime(df["arrival_date"], format="%d/%m/%Y", errors="coerce")
        df["arrival_quantity"] = pd.to_numeric(df["arrival_quantity"], errors="coerce")
        df = df.dropna(subset=["arrival_date", "arrival_quantity", "commodity", "district"])

        # Feature engineering
        df["month"]       = df["arrival_date"].dt.month
        df["day_of_year"] = df["arrival_date"].dt.dayofyear
        df["day_of_week"] = df["arrival_date"].dt.dayofweek
        df["quarter"]     = df["arrival_date"].dt.quarter

        # Indian festival months (rough approximation): Oct=10, Nov=11 (Diwali), Mar=3 (Holi)
        festival_months = {10, 11, 3, 4, 9}
        df["is_festival_season"] = df["month"].isin(festival_months).astype(int)

        # Clip extreme outliers (top 1%)
        q99 = df["arrival_quantity"].quantile(0.99)
        df  = df[df["arrival_quantity"] <= q99]

        X = df[["month", "day_of_year", "day_of_week", "quarter", "is_festival_season",
                 "commodity", "district"]]
        y = df["arrival_quantity"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=42, shuffle=True
        )

        categorical_features = ["commodity", "district"]
        numeric_features     = ["month", "day_of_year", "day_of_week", "quarter", "is_festival_season"]

        preprocessor = ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), numeric_features),
                ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ]
        )

        # GradientBoosting outperforms plain RandomForest on tabular regression; keep RF as fallback
        model_pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", GradientBoostingRegressor(
                n_estimators=200,
                learning_rate=0.08,
                max_depth=5,
                min_samples_leaf=10,
                subsample=0.8,
                random_state=42,
            )),
        ])

        print("[DemandForecast] Training GradientBoostingRegressor...")
        model_pipeline.fit(X_train, y_train)

        # ── Evaluate on test set ───────────────────────────────────────────────
        y_pred = model_pipeline.predict(X_test)
        mae    = float(mean_absolute_error(y_test, y_pred))
        rmse   = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2     = float(r2_score(y_test, y_pred))
        mape   = float(np.mean(np.abs((y_test.values - y_pred) / (y_test.values + 1))) * 100)

        _training_metrics = {
            "algorithm":  "GradientBoostingRegressor",
            "n_estimators": 200,
            "test_size":  len(y_test),
            "train_size": len(y_train),
            "MAE":        round(mae, 2),
            "RMSE":       round(rmse, 2),
            "R2":         round(r2, 4),
            "MAPE_pct":   round(mape, 2),
        }

        print(f"[DemandForecast] Training complete.")
        print(f"  MAE={mae:.2f}  RMSE={rmse:.2f}  R²={r2:.4f}  MAPE={mape:.2f}%")

        # ── Save to disk ───────────────────────────────────────────────────────
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(model_pipeline, MODEL_PATH)
        print(f"[DemandForecast] Model saved to {MODEL_PATH}")

        return _training_metrics

    except Exception as e:
        print(f"[DemandForecast] Error: {e}")
        return {"error": str(e)}


def get_training_metrics() -> dict:
    """Return cached training metrics (set when the model was last trained)."""
    return _training_metrics


# ── Predict ────────────────────────────────────────────────────────────────────
def predict_demand(commodity: str, district: str, days: int = 7) -> dict:
    """
    Generate demand forecast for the next `days` days.
    Returns: dict with forecast list, trend label, and advice string.
    """
    global model_pipeline
    if model_pipeline is None:
        load_and_train_demand_model()
        if model_pipeline is None:
            return {"error": "Demand Model not available. Check server logs."}

    today        = datetime.now()
    future_dates = [today + timedelta(days=i) for i in range(1, days + 1)]
    festival_months = {10, 11, 3, 4, 9}

    predict_data = [
        {
            "month":             d.month,
            "day_of_year":       d.timetuple().tm_yday,
            "day_of_week":       d.weekday(),
            "quarter":           (d.month - 1) // 3 + 1,
            "is_festival_season": 1 if d.month in festival_months else 0,
            "commodity":         commodity,
            "district":          district,
        }
        for d in future_dates
    ]

    X_pred      = pd.DataFrame(predict_data)
    predictions = model_pipeline.predict(X_pred)
    predictions = np.clip(predictions, 0, None)   # no negative quantities

    # Trend
    trend = "Stable"
    if predictions[-1] > predictions[0] * 1.05:
        trend = "Increasing"
    elif predictions[-1] < predictions[0] * 0.95:
        trend = "Decreasing"

    demand_index = int(np.mean(predictions))
    if demand_index > 500:
        demand_label = "High"
    elif demand_index > 150:
        demand_label = "Medium"
    else:
        demand_label = "Low"

    forecast = [
        {"date": d.strftime("%Y-%m-%d"), "predicted_demand_quintals": int(max(p, 0))}
        for d, p in zip(future_dates, predictions)
    ]

    return {
        "commodity":     commodity,
        "district":      district,
        "forecast":      forecast,
        "trend":         trend,
        "demand_label":  demand_label,
        "advice":        f"Demand is expected to be {trend.lower()} ({demand_label}) over the next {days} days.",
        "model_metrics": _training_metrics,
    }

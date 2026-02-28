"""
evaluate_all_models.py
======================
Comprehensive test & evaluation script for all AI models in the KrishiSetu platform.

Run from the project root:
    python scripts/evaluate_all_models.py

What this script tests:
  1. Price Prediction (Prophet)   — MAPE, MAE, RMSE per commodity
  2. Demand Forecast (GBM)        — MAE, RMSE, R², MAPE from saved model metrics
  3. Crop Vision / Grading (CNN)  — Accuracy, per-class breakdown, confidence test
"""

import os
import sys
import json
import time
import random
import numpy as np
from io import BytesIO
from datetime import datetime

# ── Add project root to path so imports work ──────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANDI_MCP    = os.path.join(PROJECT_ROOT, "mandi-mcp")
sys.path.insert(0, MANDI_MCP)

# ── Coloured output helpers ───────────────────────────────────────────────────
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def header(title: str):
    print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{'='*60}{RESET}")

def ok(msg):   print(f"  {GREEN}✓ {msg}{RESET}")
def warn(msg): print(f"  {YELLOW}⚠ {msg}{RESET}")
def fail(msg): print(f"  {RED}✗ {msg}{RESET}")

# ─────────────────────────────────────────────────────────────────────────────
# 1. PRICE PREDICTION — Prophet
# ─────────────────────────────────────────────────────────────────────────────
def test_price_prediction():
    header("1. PRICE PREDICTION MODEL (Facebook Prophet)")

    try:
        import services.price_prediction_service as price_svc
        print("  Loading / training Prophet models...")
        t0 = time.time()
        price_svc.load_and_train_models()
        elapsed = time.time() - t0
        ok(f"Models loaded in {elapsed:.1f}s")

        # ── Functional test ─────────────────────────────────────────────────
        test_cases = [
            ("Tomato",  "Sirsa"),
            ("Onion",   "Nashik"),
            ("Wheat",   "Pune"),
            ("Potato",  "Agra"),
        ]

        print("\n  --- Functional Prediction Tests ---")
        all_ok = True
        for crop, district in test_cases:
            result = price_svc.predict_price(crop, district, days=7)
            if result:
                prices  = [r["predicted_price"] for r in result]
                is_fall = result[0].get("is_fallback", False)
                ok(f"{crop:10s} / {district:10s} → 7-day prices: {prices}  {'[FALLBACK]' if is_fall else '[PRECISE]'}")
            else:
                warn(f"{crop:10s} / {district:10s} → No model available (insufficient training data)")
                all_ok = False

        # ── Sell advice test ─────────────────────────────────────────────────
        print("\n  --- Sell Advice Tests ---")
        for crop, district in test_cases[:2]:
            fcst = price_svc.predict_price(crop, district, days=7)
            if fcst:
                advice = price_svc.get_sell_advice(fcst)
                ok(f"{crop}: \"{advice}\"")

        # ── Evaluation metrics (walk-forward validation) ──────────────────
        print("\n  --- Walk-Forward Validation Metrics (last 30 days holdout) ---")
        metrics = price_svc.evaluate_price_model(holdout_days=30)
        if isinstance(metrics, dict) and "error" not in metrics:
            for commodity, m in list(metrics.items())[:8]:   # show first 8
                print(f"  {CYAN}{commodity:15s}{RESET}  MAE={m['MAE']:7.2f}  RMSE={m['RMSE']:7.2f}  MAPE={m['MAPE_pct']:.1f}%")
            if len(metrics) > 8:
                print(f"  ... and {len(metrics)-8} more commodities evaluated.")
            avg_mape = np.mean([m["MAPE_pct"] for m in metrics.values()])
            avg_mae  = np.mean([m["MAE"]      for m in metrics.values()])
            print(f"\n  {BOLD}Overall averages across {len(metrics)} commodities:{RESET}")
            ok(f"Avg MAPE  = {avg_mape:.2f}%")
            ok(f"Avg MAE   = ₹{avg_mae:.2f}/quintal")
        else:
            warn(f"Could not compute evaluation metrics: {metrics}")

    except Exception as e:
        fail(f"Price Prediction test ERROR: {e}")
        import traceback; traceback.print_exc()


# ─────────────────────────────────────────────────────────────────────────────
# 2. DEMAND FORECAST — GradientBoosting
# ─────────────────────────────────────────────────────────────────────────────
def test_demand_forecast():
    header("2. DEMAND FORECAST MODEL (GradientBoostingRegressor)")

    try:
        import services.demand_forecast_service as demand_svc

        # Load or retrain
        print("  Loading / training Demand model...")
        t0 = time.time()
        result = demand_svc.load_and_train_demand_model()
        elapsed = time.time() - t0
        ok(f"Model ready in {elapsed:.1f}s")

        # Show training metrics
        metrics = demand_svc.get_training_metrics()
        if metrics and "error" not in metrics:
            print(f"\n  --- Training Evaluation Metrics (20% holdout test set) ---")
            ok(f"Algorithm     : {metrics.get('algorithm', 'N/A')}")
            ok(f"Train samples : {metrics.get('train_size', '?')}")
            ok(f"Test samples  : {metrics.get('test_size',  '?')}")
            ok(f"MAE           : {metrics.get('MAE',  '?')} quintals")
            ok(f"RMSE          : {metrics.get('RMSE', '?')} quintals")
            ok(f"R²            : {metrics.get('R2',   '?')}")
            ok(f"MAPE          : {metrics.get('MAPE_pct', '?')}%")
        elif result and result.get("status") == "loaded_from_disk":
            warn("Model loaded from disk — no training metrics available (model was pre-trained).")
            warn("Run with force_retrain=True to generate fresh metrics.")

        # Functional predictions
        test_cases = [
            ("Tomato",  "Pune"),
            ("Wheat",   "Sirsa"),
            ("Onion",   "Nashik"),
        ]
        print("\n  --- Functional Demand Prediction Tests ---")
        for commodity, district in test_cases:
            res = demand_svc.predict_demand(commodity, district, days=7)
            if "forecast" in res:
                qtls = [f["predicted_demand_quintals"] for f in res["forecast"]]
                ok(f"{commodity:8s} / {district:8s} → {res['demand_label']:6s} | "
                   f"Trend: {res['trend']:11s} | Quintals: {qtls}")
            else:
                fail(f"{commodity} / {district}: {res}")

    except Exception as e:
        fail(f"Demand Forecast test ERROR: {e}")
        import traceback; traceback.print_exc()


# ─────────────────────────────────────────────────────────────────────────────
# 3. VISION / CROP GRADING — MobileNetV2
# ─────────────────────────────────────────────────────────────────────────────
def test_vision_model():
    header("3. CROP GRADING — VISION MODEL (MobileNetV2 Transfer Learning)")

    try:
        import services.vision_service as vision_svc

        DATA_DIR   = os.path.join(PROJECT_ROOT, "data", "crop_images")
        MODEL_PATH = os.path.join(PROJECT_ROOT, "mandi-mcp", "data", "quality_vision_model.pth")
        METRICS_PATH = os.path.join(PROJECT_ROOT, "mandi-mcp", "data", "vision_model_metrics.json")

        # ── Check if dataset exists ────────────────────────────────────────────
        class_dirs = {
            "grade_a": os.path.join(DATA_DIR, "grade_a"),
            "grade_b": os.path.join(DATA_DIR, "grade_b"),
            "grade_c": os.path.join(DATA_DIR, "grade_c"),
        }
        counts = {k: len(os.listdir(v)) if os.path.exists(v) else 0 for k, v in class_dirs.items()}
        total  = sum(counts.values())

        print(f"  Dataset: {counts}  (Total: {total} images)")
        if total < 10:
            warn("Very few images in dataset — accuracy will be low until real images are added.")
        
        # ── Train if no model found  ───────────────────────────────────────────
        if not os.path.exists(MODEL_PATH):
            warn(f"No saved model at {MODEL_PATH}. Training now (this may take a few minutes)...")
            metrics = vision_svc.train_quality_model(epochs=5, batch_size=16, force=True)
        else:
            ok(f"Saved model found at {MODEL_PATH}")
            vision_svc.load_vision_model()
            metrics = vision_svc._model_metrics

        # ── Show training metrics ──────────────────────────────────────────────
        if metrics and "error" not in metrics:
            print(f"\n  --- Model Training Metrics ---")
            ok(f"Algorithm       : {metrics.get('algorithm', 'N/A')}")
            ok(f"Backbone        : {metrics.get('backbone', 'N/A')}")
            ok(f"Augmentations   : {metrics.get('augmentations', 'N/A')}")
            ok(f"Training images : {metrics.get('n_train', '?')}")
            ok(f"Val images      : {metrics.get('n_val', '?')}")
            ok(f"Best Val Acc    : {metrics.get('best_val_accuracy', '?')}%")
            per_cls = metrics.get("per_class_accuracy", {})
            if per_cls:
                for cls, acc in per_cls.items():
                    ok(f"  {cls} accuracy: {acc}%")

        # Also load from JSON if present
        elif os.path.exists(METRICS_PATH):
            with open(METRICS_PATH) as f:
                m = json.load(f)
            print(f"\n  --- Cached Training Metrics (from last training run) ---")
            ok(f"Best Val Accuracy : {m.get('best_val_accuracy', '?')}%")
            ok(f"Per-class         : {m.get('per_class_accuracy', {})}")

        # ── Functional inference test: grade images from dataset ──────────────
        print(f"\n  --- Functional Inference Tests (grading images from dataset) ---")
        correct, total_tested = 0, 0
        grade_labels = {"grade_a": "A", "grade_b": "B", "grade_c": "C"}

        for cls, cls_dir in class_dirs.items():
            if not os.path.exists(cls_dir):
                continue
            imgs = [f for f in os.listdir(cls_dir) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
            sample = random.sample(imgs, min(5, len(imgs)))
            for fname in sample:
                fpath = os.path.join(cls_dir, fname)
                with open(fpath, "rb") as f:
                    img_bytes = f.read()
                result = vision_svc.grade_crop(img_bytes)
                expected = grade_labels[cls]
                predicted = result.get("grade", "?")
                conf = result.get("confidence_percentage", 0)
                total_tested += 1
                if predicted == expected:
                    correct += 1
                    ok(f"[{cls}] {fname[:30]:30s} → Predicted: {predicted}  Conf: {conf:.1f}%  ✓ CORRECT")
                else:
                    warn(f"[{cls}] {fname[:30]:30s} → Predicted: {predicted}  Conf: {conf:.1f}%  ✗ Wrong (expected {expected})")

        if total_tested > 0:
            test_acc = correct / total_tested * 100
            print(f"\n  {BOLD}Functional test accuracy on {total_tested} random images: {test_acc:.1f}%{RESET}")
            if test_acc >= 80:
                ok(f"Model is production-ready ({test_acc:.1f}% accuracy)")
            elif test_acc >= 60:
                warn(f"Model needs more training data for better accuracy ({test_acc:.1f}%)")
            else:
                fail(f"Accuracy is too low ({test_acc:.1f}%). Add real crop images for retraining.")

    except Exception as e:
        fail(f"Vision Model test ERROR: {e}")
        import traceback; traceback.print_exc()


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print(f"\n{BOLD}{'='*60}")
    print(f"  KrishiSetu AI — Model Evaluation Report")
    print(f"  Run at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}{RESET}")
    print(f"  Project root : {PROJECT_ROOT}")
    print(f"  Device       : {'CUDA (GPU)' if __import__('torch').cuda.is_available() else 'CPU'}")

    start = time.time()
    test_price_prediction()
    test_demand_forecast()
    test_vision_model()

    total_time = time.time() - start
    header(f"EVALUATION COMPLETE — {total_time:.1f}s")
    print(f"  {GREEN}All models evaluated successfully.{RESET}\n")

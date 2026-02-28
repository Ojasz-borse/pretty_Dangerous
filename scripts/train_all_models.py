"""
train_all_models.py
===================
Standalone script to (re)train and save ALL AI models for KrishiSetu.

Run from the project root:
    python scripts/train_all_models.py

Models that will be trained & saved:
  1. Price Prediction  → mandi-mcp/data/prophet_models/*.pkl  (one per commodity/district)
  2. Demand Forecast   → mandi-mcp/data/demand_model.pkl
  3. Crop Vision CNN   → mandi-mcp/data/quality_vision_model.pth
                         mandi-mcp/data/vision_model_metrics.json
"""

import os
import sys
import time
import argparse
from datetime import datetime

# ── Path setup ─────────────────────────────────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANDI_MCP    = os.path.join(PROJECT_ROOT, "mandi-mcp")
sys.path.insert(0, MANDI_MCP)

GREEN  = "\033[92m"
RED    = "\033[91m"
CYAN   = "\033[96m"
YELLOW = "\033[93m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def section(title):
    print(f"\n{BOLD}{CYAN}{'─'*60}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{'─'*60}{RESET}")


def train_price_model():
    section("TRAINING: Price Prediction (Facebook Prophet)")
    try:
        import services.price_prediction_service as price_svc
        # Delete old models to force full retrain
        model_dir = os.path.join(MANDI_MCP, "data", "prophet_models")
        if os.path.exists(model_dir):
            for f in os.listdir(model_dir):
                if f.endswith(".pkl"):
                    os.remove(os.path.join(model_dir, f))
            print(f"  {YELLOW}Cleared {model_dir}{RESET}")

        t0 = time.time()
        price_svc.load_and_train_models()
        elapsed = time.time() - t0
        n = len(price_svc._MODELS) + len(price_svc._FALLBACK_MODELS)
        print(f"  {GREEN}✓ Trained and saved {n} Prophet models in {elapsed:.1f}s{RESET}")
        return True
    except Exception as e:
        print(f"  {RED}✗ ERROR: {e}{RESET}")
        import traceback; traceback.print_exc()
        return False


def train_demand_model():
    section("TRAINING: Demand Forecast (GradientBoostingRegressor)")
    try:
        import services.demand_forecast_service as demand_svc
        t0 = time.time()
        metrics = demand_svc.load_and_train_demand_model(force_retrain=True)
        elapsed = time.time() - t0
        if "error" not in metrics:
            print(f"  {GREEN}✓ Trained in {elapsed:.1f}s{RESET}")
            print(f"    MAE   = {metrics.get('MAE', '?')} quintals")
            print(f"    RMSE  = {metrics.get('RMSE', '?')} quintals")
            print(f"    R²    = {metrics.get('R2', '?')}")
            print(f"    MAPE  = {metrics.get('MAPE_pct', '?')}%")
        else:
            print(f"  {RED}✗ ERROR: {metrics['error']}{RESET}")
        return True
    except Exception as e:
        print(f"  {RED}✗ ERROR: {e}{RESET}")
        import traceback; traceback.print_exc()
        return False


def train_vision_model(epochs: int = 10):
    section(f"TRAINING: Crop Vision / Grading (MobileNetV2, {epochs} epochs)")
    try:
        import services.vision_service as vision_svc
        t0 = time.time()
        metrics = vision_svc.train_quality_model(epochs=epochs, batch_size=32, force=True)
        elapsed = time.time() - t0
        if "error" not in metrics:
            print(f"  {GREEN}✓ Trained in {elapsed:.1f}s{RESET}")
            print(f"    Best Val Accuracy : {metrics.get('best_val_accuracy', '?')}%")
            print(f"    Per-class Accuracy: {metrics.get('per_class_accuracy', {})}")
        else:
            print(f"  {RED}✗ ERROR: {metrics['error']}{RESET}")
        return True
    except Exception as e:
        print(f"  {RED}✗ ERROR: {e}{RESET}")
        import traceback; traceback.print_exc()
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train all KrishiSetu AI models.")
    parser.add_argument("--vision-epochs", type=int, default=10,
                        help="Number of epochs for Vision model training (default: 10)")
    parser.add_argument("--skip-price",  action="store_true", help="Skip price model training")
    parser.add_argument("--skip-demand", action="store_true", help="Skip demand model training")
    parser.add_argument("--skip-vision", action="store_true", help="Skip vision model training")
    args = parser.parse_args()

    print(f"\n{BOLD}{'='*60}")
    print(f"  KrishiSetu AI — Full Model Training Pipeline")
    print(f"  Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}{RESET}")

    import torch
    print(f"  Device: {'CUDA (GPU) — ' + torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'}")
    print(f"  Project root: {PROJECT_ROOT}")

    results = {}

    if not args.skip_price:
        results["price_prediction"] = train_price_model()
    else:
        print(f"\n  {YELLOW}⚠ Skipping Price Prediction training.{RESET}")

    if not args.skip_demand:
        results["demand_forecast"] = train_demand_model()
    else:
        print(f"\n  {YELLOW}⚠ Skipping Demand Forecast training.{RESET}")

    if not args.skip_vision:
        results["vision_grading"] = train_vision_model(epochs=args.vision_epochs)
    else:
        print(f"\n  {YELLOW}⚠ Skipping Vision model training.{RESET}")

    # ── Summary ────────────────────────────────────────────────────────────────
    section("TRAINING COMPLETE — SUMMARY")
    for model, ok in results.items():
        status = f"{GREEN}PASSED{RESET}" if ok else f"{RED}FAILED{RESET}"
        print(f"  {model:25s} → {status}")

    print(f"\n  Run 'python scripts/evaluate_all_models.py' to benchmark all models.\n")

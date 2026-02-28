"""
Vision Service — Crop Quality Grading with MobileNetV2
=======================================================
Loads or trains a fine-tuned MobileNetV2 Transfer Learning model to grade
uploaded crop images as Grade A, Grade B, or Grade C.

Saved model weights: mandi-mcp/data/quality_vision_model.pth
Expected dataset path: data/crop_images/{grade_a,grade_b,grade_c}/

Run this file directly to retrain:
  python -m services.vision_service --epochs 10 --retrain
"""

import os
import io
import sys
import json
import time

import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split
from PIL import Image

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR   = os.path.join(BASE_DIR, "data", "crop_images")
MODEL_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "quality_vision_model.pth")
METRICS_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "vision_model_metrics.json")

CLASS_NAMES = ["grade_a", "grade_b", "grade_c"]
GRADE_LABELS = {"grade_a": "A", "grade_b": "B", "grade_c": "C"}

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

quality_model = None
_model_metrics: dict = {}

# ── Standard ImageNet-compatible transforms ─────────────────────────────────
INFERENCE_TRANSFORMS = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

AUGMENTATION_TRANSFORMS = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.05),
    transforms.RandomRotation(20),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


def _build_model(num_classes: int = 3) -> nn.Module:
    """Build MobileNetV2 with a custom classification head."""
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
    # Freeze backbone layers — only train the classifier head
    for param in model.features.parameters():
        param.requires_grad = False
    # Replace last linear layer
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, num_classes),
    )
    return model.to(device)


# ── Train ──────────────────────────────────────────────────────────────────────
def train_quality_model(epochs: int = 10, batch_size: int = 32, force: bool = False) -> dict:
    """
    Train MobileNetV2 on the crop_images dataset.
    Saves model weights + training metrics. Returns metrics dict.
    """
    global quality_model, _model_metrics

    if not os.path.exists(DATA_DIR):
        msg = (f"[Vision] Dataset directory not found: {DATA_DIR}\n"
               f"Expected structure:\n"
               f"  {DATA_DIR}/grade_a/  (healthy, top quality images)\n"
               f"  {DATA_DIR}/grade_b/  (average quality images)\n"
               f"  {DATA_DIR}/grade_c/  (poor quality / diseased images)\n"
               f"Run: python scripts/generate_mock_crop_images.py to create synthetic images.")
        print(msg)
        return {"error": msg}

    # Check minimum image count
    class_counts = {}
    for cls in CLASS_NAMES:
        cls_dir = os.path.join(DATA_DIR, cls)
        count = len([f for f in os.listdir(cls_dir) if f.lower().endswith((".jpg", ".jpeg", ".png"))]) \
            if os.path.exists(cls_dir) else 0
        class_counts[cls] = count

    total_images = sum(class_counts.values())
    print(f"[Vision] Dataset summary: {class_counts} | Total: {total_images}")

    if total_images < 30:
        print("[Vision] WARNING: Very small dataset (<30 images). Results may not generalize well.")

    # Build datasets with augmentation for training
    try:
        full_dataset_aug  = datasets.ImageFolder(DATA_DIR, transform=AUGMENTATION_TRANSFORMS)
        full_dataset_eval = datasets.ImageFolder(DATA_DIR, transform=INFERENCE_TRANSFORMS)

        n       = len(full_dataset_aug)
        n_val   = max(int(0.2 * n), 1)
        n_train = n - n_val

        # Same random split indices for both aug and eval datasets
        train_idx, val_idx = torch.utils.data.random_split(
            range(n), [n_train, n_val], generator=torch.Generator().manual_seed(42)
        )

        train_dataset = torch.utils.data.Subset(full_dataset_aug,  train_idx.indices)
        val_dataset   = torch.utils.data.Subset(full_dataset_eval, val_idx.indices)

        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True,  num_workers=0, pin_memory=False)
        val_loader   = DataLoader(val_dataset,   batch_size=batch_size, shuffle=False, num_workers=0, pin_memory=False)

    except Exception as e:
        return {"error": f"Failed to load dataset: {e}"}

    model     = _build_model(num_classes=3)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = optim.Adam(model.classifier.parameters(), lr=5e-4, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)

    history   = []
    best_val_acc = 0.0
    best_weights = None

    print(f"[Vision] Training MobileNetV2 for {epochs} epochs on {device}...")
    print(f"  Train samples: {n_train}  |  Val samples: {n_val}")
    print("-" * 60)

    for epoch in range(1, epochs + 1):
        # ── Training ──────────────────────────────────────────────────────────
        model.train()
        train_loss, train_correct = 0.0, 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss    = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            _, preds = torch.max(outputs, 1)
            train_loss    += loss.item() * inputs.size(0)
            train_correct += torch.sum(preds == labels.data).item()

        scheduler.step()

        # ── Validation ────────────────────────────────────────────────────────
        model.eval()
        val_loss, val_correct = 0.0, 0
        all_preds, all_labels = [], []

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss    = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                val_loss    += loss.item() * inputs.size(0)
                val_correct += torch.sum(preds == labels.data).item()
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())

        epoch_train_acc = train_correct / n_train
        epoch_val_acc   = val_correct   / n_val
        epoch_train_loss = train_loss / n_train
        epoch_val_loss   = val_loss   / n_val

        history.append({
            "epoch":      epoch,
            "train_loss": round(epoch_train_loss, 4),
            "val_loss":   round(epoch_val_loss, 4),
            "train_acc":  round(epoch_train_acc, 4),
            "val_acc":    round(epoch_val_acc, 4),
        })

        print(f"  Epoch {epoch:02d}/{epochs} | "
              f"Train Loss={epoch_train_loss:.4f} Acc={epoch_train_acc:.3f} | "
              f"Val Loss={epoch_val_loss:.4f} Acc={epoch_val_acc:.3f}")

        # Save best model
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            best_weights = {k: v.clone() for k, v in model.state_dict().items()}
            print(f"    ✓ New best val acc: {best_val_acc:.4f} — saved.")

    # ── Save best weights ────────────────────────────────────────────────────
    print("-" * 60)
    if best_weights:
        model.load_state_dict(best_weights)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    torch.save(model.state_dict(), MODEL_PATH)
    quality_model = model
    quality_model.eval()

    # Final per-class accuracy
    from collections import Counter
    class_correct = Counter()
    class_total   = Counter()
    model.eval()
    with torch.no_grad():
        for inputs, labels in val_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            for p, l in zip(preds.cpu(), labels.cpu()):
                is_correct = (p == l).item()
                class_correct[CLASS_NAMES[l]] += int(is_correct)
                class_total[CLASS_NAMES[l]]   += 1

    per_class = {cls: round(class_correct[cls] / max(class_total[cls], 1), 4)
                 for cls in CLASS_NAMES}

    _model_metrics = {
        "algorithm":           "MobileNetV2 Transfer Learning",
        "backbone":            "MobileNetV2 (ImageNet pre-trained, backbone frozen)",
        "optimizer":           "Adam (lr=5e-4, weight_decay=1e-4)",
        "lr_scheduler":        "CosineAnnealingLR",
        "epochs_trained":      epochs,
        "augmentations":       "RandomCrop, HFlip, VFlip, ColorJitter, Rotation",
        "n_train":             n_train,
        "n_val":               n_val,
        "class_distribution":  class_counts,
        "best_val_accuracy":   round(best_val_acc * 100, 2),
        "per_class_accuracy":  {k: round(v * 100, 2) for k, v in per_class.items()},
        "history":             history,
        "device_used":         str(device),
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(_model_metrics, f, indent=2)
    print(f"[Vision] Model saved → {MODEL_PATH}")
    print(f"[Vision] Metrics saved → {METRICS_PATH}")
    print(f"[Vision] Best val accuracy: {best_val_acc * 100:.2f}%  |  Per-class: {per_class}")
    return _model_metrics


# ── Load Pre-Trained ───────────────────────────────────────────────────────────
def load_vision_model() -> bool:
    """Load saved .pth weights into memory for inference."""
    global quality_model, _model_metrics
    if not os.path.exists(MODEL_PATH):
        print(f"[Vision] No saved model at {MODEL_PATH}. Train first.")
        return False
    try:
        print(f"[Vision] Loading CNN model from {MODEL_PATH} on {device}...")
        model = _build_model(num_classes=3)
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
        model.eval()
        quality_model = model
        # Load cached metrics if available
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH) as f:
                _model_metrics = json.load(f)
        print("[Vision] CNN Vision model ready.")
        return True
    except Exception as e:
        print(f"[Vision] Failed to load model: {e}")
        return False


# ── Inference ──────────────────────────────────────────────────────────────────
def grade_crop(image_bytes: bytes) -> dict:
    """
    Classify uploaded image bytes as Grade A, B, or C.
    Returns grade label, confidence, and per-class scores.
    """
    global quality_model
    if quality_model is None:
        if not load_vision_model():
            return {
                "error":   "Vision model is not trained. Run python -m services.vision_service --retrain",
                "status":  "failed",
            }

    try:
        img   = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        batch = INFERENCE_TRANSFORMS(img).unsqueeze(0).to(device)

        with torch.no_grad():
            logits = quality_model(batch)
            probs  = torch.nn.functional.softmax(logits[0], dim=0).cpu().numpy()

        pred_idx = int(np.argmax(probs))
        pred_cls = CLASS_NAMES[pred_idx]
        grade    = GRADE_LABELS[pred_cls]

        return {
            "grade":               grade,
            "confidence_percentage": round(float(probs[pred_idx]) * 100, 2),
            "detail_scores": {
                "Grade A": round(float(probs[0]) * 100, 2),
                "Grade B": round(float(probs[1]) * 100, 2),
                "Grade C": round(float(probs[2]) * 100, 2),
            },
            "status": "success",
            "model_metrics": {
                "best_val_accuracy": _model_metrics.get("best_val_accuracy", "N/A"),
                "per_class_accuracy": _model_metrics.get("per_class_accuracy", {}),
            },
        }
    except Exception as e:
        return {"error": f"Failed to process image: {e}", "status": "failed"}


# ── Real-World Crop Detection (Gemini Vision + ImageNet fallback) ──────────────

# Keywords to match ImageNet class names → crop name
_CROP_KEYWORDS = {
    # Grains & Cereals
    "ear":         "Corn / Wheat",  "corn":      "Maize / Corn",
    "maize":       "Maize",         "wheat":     "Wheat",
    "rice":        "Rice",          "paddy":     "Rice",
    "sorghum":     "Jowar",         "millet":    "Bajra",
    # Vegetables
    "tomato":      "Tomato",        "potato":    "Potato",
    "onion":       "Onion",         "broccoli":  "Broccoli",
    "cauliflower": "Cauliflower",   "cabbage":   "Cabbage",
    "head cabbage":"Cabbage",       "pepper":    "Pepper",
    "bell pepper": "Capsicum",      "cucumber":  "Cucumber",
    "zucchini":    "Zucchini",      "pumpkin":   "Pumpkin",
    "eggplant":    "Brinjal",       "mushroom":  "Mushroom",
    "garlic":      "Garlic",        "carrot":    "Carrot",
    "radish":      "Radish",        "spinach":   "Spinach",
    "lettuce":     "Lettuce",       "okra":      "Okra",
    # Fruits
    "banana":      "Banana",        "mango":     "Mango",
    "orange":      "Orange",        "lemon":     "Lemon",
    "lime":        "Lime",          "apple":     "Apple",
    "grape":       "Grapes",        "strawberry":"Strawberry",
    "pineapple":   "Pineapple",     "pomegranate":"Pomegranate",
    "fig":         "Fig",           "guava":     "Guava",
    "jackfruit":   "Jackfruit",     "papaya":    "Papaya",
    "watermelon":  "Watermelon",    "peach":     "Peach",
    "pear":        "Pear",          "plum":      "Plum",
    # Legumes / Oilseeds / Cash crops
    "soybean":     "Soybean",       "peanut":    "Groundnut",
    "lentil":      "Lentil",        "chickpea":  "Chickpea",
    "cotton":      "Cotton",        "sunflower": "Sunflower",
    "rapeseed":    "Mustard",       "chili":     "Chilli",
    "ginger":      "Ginger",        "walnut":    "Walnut",
    "acorn":       "Grain / Nut",
}


# ── ImageNet model singleton (loaded once on first call) ─────────────────────
_inet_model      = None
_inet_class_names: list = []
_inet_transforms = None

def _load_imagenet_model():
    """Load pre-trained MobileNetV2 with ImageNet weights — once only."""
    global _inet_model, _inet_class_names, _inet_transforms
    if _inet_model is not None:
        return
    from torchvision.models import MobileNet_V2_Weights
    weights          = MobileNet_V2_Weights.IMAGENET1K_V1
    _inet_class_names = weights.meta["categories"]       # 1000 class strings
    _inet_transforms  = weights.transforms()             # official preprocessing
    _inet_model       = models.mobilenet_v2(weights=weights).to(device)
    _inet_model.eval()
    print("[Vision] ImageNet MobileNetV2 loaded for crop detection fallback.")


def _imagenet_detect(image_bytes: bytes) -> dict:
    """Fallback: pre-trained ImageNet MobileNetV2 maps top-5 predictions to crop names."""
    try:
        _load_imagenet_model()

        img    = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        # Use the OFFICIAL ImageNet preprocessing (not the custom crop transforms)
        tensor = _inet_transforms(img).unsqueeze(0).to(device)

        with torch.no_grad():
            logits               = _inet_model(tensor)
            probs                = torch.nn.functional.softmax(logits[0], dim=0)
            top5_probs, top5_idx = torch.topk(probs, 5)

        top5 = [(_inet_class_names[i.item()], p.item()) for i, p in zip(top5_idx, top5_probs)]
        print(f"[Vision] ImageNet top-5: {[(c, round(p*100,1)) for c,p in top5]}")

        # Find best matching crop keyword in top-5
        best_crop, best_conf = None, 0.0
        for cls_name, prob in top5:
            lower = cls_name.lower()
            for kw, crop in _CROP_KEYWORDS.items():
                if kw in lower and prob > best_conf:
                    best_crop, best_conf = crop, prob
                    break

        conf_pct = round(best_conf * 100, 1)

        if best_crop is None or conf_pct < 20:
            top_label = top5[0][0]
            top_conf  = round(top5[0][1] * 100, 1)
            return {
                "is_crop": False,
                "error": (
                    f"This does not appear to be an agricultural crop image "
                    f"(detected: '{top_label}', {top_conf}%). "
                    "Please upload a clear photo of crops or produce."
                ),
                "status": "not_crop",
            }

        grade = "A" if conf_pct >= 70 else ("B" if conf_pct >= 45 else "C")
        return {
            "is_crop":               True,
            "crop_name":             best_crop,
            "grade":                 grade,
            "confidence_percentage": conf_pct,
            "reason":                f"Identified as {best_crop} ({conf_pct}% confidence) via ImageNet model.",
            "detail_scores": {
                "Grade A": conf_pct if grade == "A" else max(0.0, conf_pct - 25),
                "Grade B": conf_pct if grade == "B" else max(0.0, conf_pct - 15),
                "Grade C": conf_pct if grade == "C" else max(0.0, conf_pct - 35),
            },
            "top_predictions":   [{"class": c, "confidence": round(p * 100, 1)} for c, p in top5[:3]],
            "detection_method":  "ImageNet MobileNetV2",
            "status":            "success",
        }

    except Exception as exc:
        return {"error": f"ImageNet detection failed: {exc}", "status": "failed"}



async def _gemini_detect(image_bytes: bytes, api_key: str) -> dict:
    """Primary: Gemini 1.5 Flash Vision — identifies exact crop type + quality grade."""
    import base64, json, re

    # Detect MIME type from magic bytes
    if image_bytes[:4] == b"\x89PNG":
        mime_type = "image/png"
    elif image_bytes[:4] == b"RIFF" and image_bytes[8:12] == b"WEBP":
        mime_type = "image/webp"
    else:
        mime_type = "image/jpeg"

    image_b64 = base64.b64encode(image_bytes).decode()

    prompt = (
        "You are an expert agricultural scientist. Analyze this image carefully.\n\n"
        "STEP 1 — Is this an actual agricultural crop, plant, vegetable, fruit, grain, or produce?\n"
        "If NOT (e.g. screenshot, person, animal, document, vehicle, random object), output ONLY:\n"
        '{"is_crop": false}\n\n'
        "STEP 2 — If YES, identify:\n"
        "  crop_name: specific common name (e.g. 'Maize/Corn', 'Tomato', 'Wheat', 'Onion', 'Rice')\n"
        "  grade: A = premium/no defects, B = good/minor flaws, C = poor/damaged/diseased\n"
        "  confidence: integer 0–100 (your certainty about the crop type and grade)\n"
        "  reason: ONE concise sentence explaining the grade decision\n\n"
        "Output ONLY valid JSON — no markdown, no code blocks, no extra text:\n"
        '{"is_crop": true, "crop_name": "Maize/Corn", "grade": "A", "confidence": 88, '
        '"reason": "Fresh, well-formed ears with vibrant yellow color and no pest damage"}'
    )

    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/gemini-1.5-flash:generateContent?key={api_key}"
    )
    payload = {
        "contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": mime_type, "data": image_b64}},
        ]}],
        "generationConfig": {"temperature": 0.05, "maxOutputTokens": 200},
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=payload)
        if resp.status_code != 200:
            raise RuntimeError(f"Gemini API error {resp.status_code}: {resp.text[:300]}")
        body = resp.json()

    raw = body["candidates"][0]["content"]["parts"][0]["text"].strip()
    m   = re.search(r"\{.*\}", raw, re.DOTALL)
    if not m:
        raise ValueError(f"No JSON in Gemini response: {raw[:200]}")
    data = json.loads(m.group())

    if not data.get("is_crop", False):
        return {
            "is_crop": False,
            "error": (
                "This image does not appear to contain agricultural crops or produce. "
                "Please upload a clear photo of crops, vegetables, fruits, or grains."
            ),
            "status": "not_crop",
        }

    confidence = float(data.get("confidence", 70))
    grade      = data.get("grade", "B")

    return {
        "is_crop":               True,
        "crop_name":             data.get("crop_name", "Unknown Crop"),
        "grade":                 grade,
        "confidence_percentage": round(confidence, 1),
        "reason":                data.get("reason", ""),
        "detail_scores": {
            "Grade A": confidence if grade == "A" else max(0.0, confidence - 25),
            "Grade B": confidence if grade == "B" else max(0.0, confidence - 15),
            "Grade C": confidence if grade == "C" else max(0.0, confidence - 35),
        },
        "detection_method":  "Gemini 1.5 Flash Vision",
        "status":            "success",
    }


async def detect_crop_with_ai(image_bytes: bytes, gemini_api_key: str = None) -> dict:
    """
    Main entry point for crop detection.
    Tries Gemini Vision first (if key is set), falls back to ImageNet MobileNetV2.
    Returns: { is_crop, crop_name, grade, confidence_percentage, reason, detail_scores, status }
    """
    if gemini_api_key:
        try:
            return await _gemini_detect(image_bytes, gemini_api_key)
        except Exception as exc:
            print(f"[Vision] Gemini failed ({exc}), using ImageNet fallback")
    return _imagenet_detect(image_bytes)


# ── CLI Entry ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Train or evaluate the Vision model.")
    parser.add_argument("--epochs",  type=int, default=10, help="Training epochs")
    parser.add_argument("--batch",   type=int, default=32, help="Batch size")
    parser.add_argument("--retrain", action="store_true",  help="Force re-training even if model exists")
    args = parser.parse_args()

    if args.retrain or not os.path.exists(MODEL_PATH):
        metrics = train_quality_model(epochs=args.epochs, batch_size=args.batch, force=args.retrain)
        print("\n=== Final Training Metrics ===")
        for k, v in metrics.items():
            if k != "history":
                print(f"  {k}: {v}")
    else:
        print(f"Model already exists at {MODEL_PATH}. Use --retrain to force re-training.")
        load_vision_model()
        print("Metrics:", _model_metrics)

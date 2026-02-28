import os
import re
import json

filepath = r"d:\My Version\mandi-mcp\services\vision_service.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update paths
content = content.replace('MODEL_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "quality_vision_model.pth")',
'''QUALITY_MODEL_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "quality_vision_model.pth")
CROP_MODEL_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "crop_vision_model.pth")''')

content = content.replace('METRICS_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "vision_model_metrics.json")',
'''QUALITY_METRICS_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "vision_model_metrics.json")
CROP_METRICS_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "crop_model_metrics.json")''')

# 2. Update globals
content = content.replace('quality_model = None\n_model_metrics: dict = {}',
'''quality_model = None
crop_model = None
quality_metrics: dict = {}
crop_metrics: dict = {}''')

# 3. Replace train_quality_model with generic train_custom_model and wrappers
repl_train = '''def train_custom_model(data_dir: str, model_path: str, metrics_path: str, epochs: int = 10, batch_size: int = 32, force: bool = False) -> dict:
    """
    Generic function to train MobileNetV2 on a custom dataset directory.
    Saves model weights + training metrics. Returns metrics dict.
    """
    if not os.path.exists(data_dir):
        msg = f"[Vision] Dataset directory not found: {data_dir}"
        print(msg)
        return {"error": msg}

    classes = sorted([d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))])
    if not classes:
        return {"error": f"No class directories found in {data_dir}"}

    class_counts = {}
    for cls in classes:
        cls_dir = os.path.join(data_dir, cls)
        count = len([f for f in os.listdir(cls_dir) if f.lower().endswith((".jpg", ".jpeg", ".png"))])
        class_counts[cls] = count

    total_images = sum(class_counts.values())
    print(f"[Vision] Dataset summary: {class_counts} | Total: {total_images}")

    if total_images < 30:
        print("[Vision] WARNING: Very small dataset (<30 images). Results may not generalize well.")

    try:
        full_dataset_aug  = datasets.ImageFolder(data_dir, transform=AUGMENTATION_TRANSFORMS)
        full_dataset_eval = datasets.ImageFolder(data_dir, transform=INFERENCE_TRANSFORMS)

        n       = len(full_dataset_aug)
        n_val   = max(int(0.2 * n), 1)
        n_train = n - n_val

        train_idx, val_idx = random_split(range(n), [n_train, n_val], generator=torch.Generator().manual_seed(42))

        train_dataset = torch.utils.data.Subset(full_dataset_aug,  train_idx.indices)
        val_dataset   = torch.utils.data.Subset(full_dataset_eval, val_idx.indices)

        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True,  num_workers=0, pin_memory=False)
        val_loader   = DataLoader(val_dataset,   batch_size=batch_size, shuffle=False, num_workers=0, pin_memory=False)

    except Exception as e:
        return {"error": f"Failed to load dataset: {e}"}

    model     = _build_model(num_classes=len(classes))
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = optim.Adam(model.classifier.parameters(), lr=5e-4, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)

    history   = []
    best_val_acc = 0.0
    best_weights = None

    print(f"[Vision] Training MobileNetV2 for {epochs} epochs on {device}...")
    for epoch in range(1, epochs + 1):
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

        model.eval()
        val_loss, val_correct = 0.0, 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss    = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                val_loss    += loss.item() * inputs.size(0)
                val_correct += torch.sum(preds == labels.data).item()

        epoch_val_acc = val_correct / n_val
        print(f"  Epoch {epoch:02d} - Val Acc: {epoch_val_acc:.4f}")
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            best_weights = {k: v.clone() for k, v in model.state_dict().items()}
            print(f"    ✓ New best val acc: {best_val_acc:.4f} - saved.")

    if best_weights:
        model.load_state_dict(best_weights)

    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    torch.save(model.state_dict(), model_path)
    
    metrics = {
        "classes": classes,
        "class_distribution": class_counts,
        "best_val_accuracy": round(best_val_acc * 100, 2),
        "epochs_trained": epochs,
    }
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    return metrics

def train_quality_model(epochs: int = 10, batch_size: int = 32, force: bool = False) -> dict:
    return train_custom_model(DATA_DIR, QUALITY_MODEL_PATH, QUALITY_METRICS_PATH, epochs, batch_size, force)

def train_crop_model(data_dir: str, epochs: int = 10, batch_size: int = 32, force: bool = False) -> dict:
    return train_custom_model(data_dir, CROP_MODEL_PATH, CROP_METRICS_PATH, epochs, batch_size, force)
'''

content_lines = content.split('\\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(content_lines):
    if line.startswith("def train_quality_model("):
        start_idx = i
    if line.startswith("def load_vision_model("):
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    content_lines[start_idx:end_idx] = repl_train.split('\\n') + ["\\n"]
    content = '\\n'.join(content_lines)

# 4. Replace load_vision_model
repl_load = '''def load_custom_model(model_path: str, metrics_path: str):
    if not os.path.exists(model_path):
        return None, {}
    try:
        with open(metrics_path) as f:
            metrics = json.load(f)
        classes = metrics.get("classes", [])
        model = _build_model(num_classes=len(classes))
        model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
        model.eval()
        return model, metrics
    except Exception as e:
        print(f"[Vision] Failed to load model {model_path}: {e}")
        return None, {}

def load_vision_model() -> bool:
    global quality_model, quality_metrics, crop_model, crop_metrics
    quality_model, quality_metrics = load_custom_model(QUALITY_MODEL_PATH, QUALITY_METRICS_PATH)
    crop_model, crop_metrics = load_custom_model(CROP_MODEL_PATH, CROP_METRICS_PATH)
    return quality_model is not None'''

content_lines = content.split('\\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(content_lines):
    if line.startswith("def load_vision_model("):
        start_idx = i
    if line.startswith("def grade_crop("):
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    content_lines[start_idx:end_idx] = repl_load.split('\\n') + ["\\n"]
    content = '\\n'.join(content_lines)

# 5. Fix references inside grade_crop
content = content.replace("not load_vision_model():", "quality_model is None and not load_vision_model():")
content = content.replace("MODEL_PATH", "QUALITY_MODEL_PATH")
content = content.replace("METRICS_PATH", "QUALITY_METRICS_PATH")
content = content.replace("CLASS_NAMES", 'quality_metrics.get("classes", ["grade_a", "grade_b", "grade_c"])')
content = content.replace("_model_metrics", "quality_metrics")

# 6. Fallback inside _imagenet_detect (actually we rewrite it to try crop_model first)
repl_imagenet = '''def _mobilenet_crop_detect(image_bytes: bytes) -> dict:
    """Fallback: Custom Crop Model MobileNetV2, or ImageNet if not available."""
    global crop_model, crop_metrics
    if crop_model is None:
        load_vision_model()
    
    if crop_model is not None:
        # Use Custom Crop Model!
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            tensor = INFERENCE_TRANSFORMS(img).unsqueeze(0).to(device)
            with torch.no_grad():
                logits = crop_model(tensor)
                probs = torch.nn.functional.softmax(logits[0], dim=0)
                
            pred_idx = int(torch.argmax(probs).item())
            classes = crop_metrics.get("classes", [])
            class_name = classes[pred_idx] if pred_idx < len(classes) else "Unknown"
            conf_pct = float(probs[pred_idx]) * 100
            
            grade = "A" if conf_pct >= 70 else ("B" if conf_pct >= 45 else "C")
            return {
                "is_crop": True,
                "crop_name": class_name.replace("_", " ").title(),
                "grade": grade,
                "confidence_percentage": round(conf_pct, 1),
                "reason": f"Identified as {class_name} ({round(conf_pct, 1)}% confidence) via Custom MobileNetV2.",
                "detection_method": "Custom MobileNetV2",
                "status": "success",
            }
        except Exception as e:
            return {"error": f"Custom crop detection failed: {e}", "status": "failed"}

    # --- Start ImageNet fallback ---
    try:
        _load_imagenet_model()

        img    = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = _inet_transforms(img).unsqueeze(0).to(device)

        with torch.no_grad():
            logits               = _inet_model(tensor)
            probs                = torch.nn.functional.softmax(logits[0], dim=0)
            top5_probs, top5_idx = torch.topk(probs, 5)

        top5 = [(_inet_class_names[i.item()], p.item()) for i, p in zip(top5_idx, top5_probs)]
        
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
                "error": f"This does not appear to be an agricultural crop image (detected: '{top_label}', {top_conf}%).",
                "status": "not_crop",
            }

        grade = "A" if conf_pct >= 70 else ("B" if conf_pct >= 45 else "C")
        return {
            "is_crop": True,
            "crop_name": best_crop,
            "grade": grade,
            "confidence_percentage": conf_pct,
            "reason": f"Identified as {best_crop} ({conf_pct}% confidence) via ImageNet model.",
            "detection_method": "ImageNet MobileNetV2",
            "status": "success",
        }
    except Exception as exc:
        return {"error": f"ImageNet detection failed: {exc}", "status": "failed"}'''

content = re.sub(r'def _imagenet_detect\(image_bytes: bytes\) -> dict:.*?(?=def _gemini_detect)', repl_imagenet + '\\n\\n', content, flags=re.DOTALL)
content = content.replace('_imagenet_detect(image_bytes)', '_mobilenet_crop_detect(image_bytes)')

# 7. Add CLI functionality for crop model training
content = content.replace('''print("Dataset or Image not provided.")''', '''print("Dataset or Image not provided.")
    import argparse
    parser = argparse.ArgumentParser(description="Mandi Vision Service")
    parser.add_argument("--retrain", action="store_true", help="Retrain the custom quality model.")
    parser.add_argument("--retrain-crop", action="store_true", help="Retrain the custom crop model.")
    parser.add_argument("--crop-data", type=str, help="Path to crop dataset for retraining.", default=None)
    parser.add_argument("--epochs", type=int, default=10, help="Number of epochs to train.")
    args = parser.parse_known_args()[0]
    
    if args.retrain:
        print("Retraining Quality Model...")
        metrics = train_quality_model(epochs=args.epochs, force=True)
        print("Metrics:", metrics)
        sys.exit(0)
    
    if args.retrain_crop:
        if not args.crop_data:
            print("Error: Must specify --crop-data <path_to_crop_dataset_dir> with --retrain-crop")
            sys.exit(1)
        print(f"Retraining Crop Model on {args.crop_data}...")
        metrics = train_crop_model(args.crop_data, epochs=args.epochs, force=True)
        print("Metrics:", metrics)
        sys.exit(0)''')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully.")

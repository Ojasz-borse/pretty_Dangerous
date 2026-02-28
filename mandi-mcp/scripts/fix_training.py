import os
import re
import json

filepath = r"d:\My Version\mandi-mcp\services\vision_service.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

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

    print(f"[Vision] Training custom MobileNetV2 for {epochs} epochs on {device}...")
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

content_lines = content.split('\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(content_lines):
    if line.startswith('        # Same random split indices for both aug and eval datasets'):
        start_idx = i - 9
    if line.startswith("def load_vision_model("):
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    content_lines[start_idx:end_idx] = repl_train.split('\n') + ["\n"]
    content = '\n'.join(content_lines)
    
with open(r"d:\My Version\mandi-mcp\services\vision_service.py", "w", encoding="utf-8") as f:
    f.write(content)

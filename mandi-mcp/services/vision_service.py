import os
import io
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split
from PIL import Image

# Go up two levels from mandi-mcp/services/vision_service.py to get to IntelliReviewAI1.0
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "crop_images")
MODEL_PATH = os.path.join(BASE_DIR, "mandi-mcp", "data", "quality_vision_model.pth")

CLASS_NAMES = ["A", "B", "C"]
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

quality_model = None

def train_quality_model(epochs: int = 5):
    """
    Trains a PyTorch MobileNetV2 model on the local crop_images dataset
    to classify images into Grade A, Grade B, or Grade C.
    """
    if not os.path.exists(DATA_DIR):
        print(f"Dataset directory not found at {DATA_DIR}. Please generate or download the dataset first.")
        return

    print(f"Loading image dataset using {device}...")
    
    # Standard transform for MobileNetV2
    data_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    try:
        full_dataset = datasets.ImageFolder(DATA_DIR, transform=data_transforms)
        
        # 80% train, 20% val split
        train_size = int(0.8 * len(full_dataset))
        val_size = len(full_dataset) - train_size
        train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

        train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, num_workers=0)
        val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False, num_workers=0)

        print("Building MobileNetV2 architecture with Transfer Learning...")
        # Load pre-trained MobileNetV2
        model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
        
        # Freeze pre-trained layers
        for param in model.parameters():
            param.requires_grad = False
            
        # Replace the final classification head
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(num_ftrs, 3) # 3 output classes

        model = model.to(device)

        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)

        print(f"Training for {epochs} epochs...")
        for epoch in range(epochs):
            model.train()
            running_loss = 0.0
            running_corrects = 0
            
            for inputs, labels in train_loader:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                
                loss.backward()
                optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / train_size
            epoch_acc = running_corrects.double() / train_size
            print(f"Epoch {epoch+1}/{epochs} - Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")
            
        # Save model weights
        torch.save(model.state_dict(), MODEL_PATH)
        print(f"Model successfully saved to {MODEL_PATH}")
        
    except Exception as e:
        print(f"Error training CNN model: {e}")

def load_vision_model():
    """Loads the compiled PyTorch model into memory for fast inference."""
    global quality_model
    if os.path.exists(MODEL_PATH) and quality_model is None:
        try:
            print("Loading pre-trained CNN Vision Model (PyTorch) into memory...")
            model = models.mobilenet_v2(weights=None)
            num_ftrs = model.classifier[1].in_features
            model.classifier[1] = nn.Linear(num_ftrs, 3)
            # Use weights_only=True as recommended for security
            model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
            model = model.to(device)
            model.eval()
            quality_model = model
            print("CNN Vision Model ready.")
        except Exception as e:
            print(f"Failed to load vision model: {e}")

def grade_crop(image_bytes: bytes):
    """
    Takes raw image bytes, preprocesses them for MobileNetV2,
    and returns the predicted Grade (A, B, or C) and confidence percentages.
    """
    global quality_model
    if quality_model is None:
        load_vision_model()
        if quality_model is None:
            return {"error": "Vision model is not trained or could not be loaded.", "status": "failed"}
            
    try:
        # Load image via PIL
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Apply standard transforms
        preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        input_tensor = preprocess(img)
        input_batch = input_tensor.unsqueeze(0).to(device) # Create a mini-batch
        
        with torch.no_grad():
            output = quality_model(input_batch)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
            
        scores = probabilities.cpu().numpy()
        
        # Map to class name
        predicted_class_index = int(np.argmax(scores))
        predicted_grade = CLASS_NAMES[predicted_class_index]
        confidence = float(scores[predicted_class_index] * 100)
        
        return {
            "grade": predicted_grade,
            "confidence_percentage": round(confidence, 2),
            "detail_scores": {
                "Grade A": round(float(scores[0] * 100), 2),
                "Grade B": round(float(scores[1] * 100), 2),
                "Grade C": round(float(scores[2] * 100), 2),
            },
            "status": "success"
        }
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}", "status": "failed"}

if __name__ == "__main__":
    train_quality_model(epochs=5)

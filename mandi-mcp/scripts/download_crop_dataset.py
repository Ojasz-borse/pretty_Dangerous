import os
import shutil
import random
import kagglehub

def prepare_datasets():
    print("Downloading PlantVillage Dataset via kagglehub...")
    # This downloads the dataset to a local cache directory
    path = kagglehub.dataset_download("emmarex/plantdisease")
    print(f"Dataset downloaded to: {path}")

    # We need to map PlantVillage classes into 'crop_type' and 'crop_quality' structure
    # PlantVillage classes are typically named like "Tomato___Bacterial_spot", "Tomato___healthy"
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(base_dir), "data")
    
    crop_data_dir = os.path.join(data_dir, "crop_types")
    quality_data_dir = os.path.join(data_dir, "crop_quality")
    
    os.makedirs(crop_data_dir, exist_ok=True)
    os.makedirs(quality_data_dir, exist_ok=True)
    
    # We create grade_a, grade_b, grade_c for quality
    for grade in ["grade_a", "grade_b", "grade_c"]:
        os.makedirs(os.path.join(quality_data_dir, grade), exist_ok=True)

    # Locate the "PlantVillage" folder inside the downloaded path
    pv_dir = os.path.join(path, "PlantVillage")
    if not os.path.exists(pv_dir):
        pv_dir = path # sometimes it extracts directly here depending on kagglehub specifics
        
    print(f"Processing images from {pv_dir}...")
    
    classes = [d for d in os.listdir(pv_dir) if os.path.isdir(os.path.join(pv_dir, d))]
    
    # Limit number of images per class to prevent massive training times locally
    MAX_PER_CROP = 100
    MAX_PER_QUALITY = 500
    
    quality_counts = {"grade_a": 0, "grade_b": 0, "grade_c": 0}
    
    for cls in classes:
        cls_path = os.path.join(pv_dir, cls)
        
        # Parse crop name and health status
        # E.g., Apple___Apple_scab -> Crop: Apple, Status: diseased
        parts = cls.split("___")
        if len(parts) != 2:
            continue
            
        crop_name = parts[0].strip().lower()
        status = parts[1].strip().lower()
        
        # 1. Setup Crop Type dataset (Ignore background / empty classes)
        if "background" in crop_name:
            continue
            
        crop_target_dir = os.path.join(crop_data_dir, crop_name)
        os.makedirs(crop_target_dir, exist_ok=True)
        
        images = [f for f in os.listdir(cls_path) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
        random.shuffle(images)
        
        # Copy some images for crop type identification
        copied_crop = 0
        for img in images:
            if copied_crop >= MAX_PER_CROP:
                break
            src = os.path.join(cls_path, img)
            dst = os.path.join(crop_target_dir, f"{cls}_{img}")
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
                copied_crop += 1
                
        # 2. Setup Quality dataset
        # healthy -> grade_a
        # minor diseases -> grade_b
        # severe diseases -> grade_c
        
        grade = "grade_c" # default to C for severe
        if "healthy" in status:
            grade = "grade_a"
        elif any(minor in status for minor in ["spot", "mild", "early"]):
            grade = "grade_b"
            
        quality_target_dir = os.path.join(quality_data_dir, grade)
        
        copied_qual = 0
        for img in images:
            if quality_counts[grade] >= MAX_PER_QUALITY:
                break
            if copied_qual >= (MAX_PER_QUALITY // len(classes)): # Distribute evenly evenly
                 break
                 
            src = os.path.join(cls_path, img)
            dst = os.path.join(quality_target_dir, f"{cls}_{img}")
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
                copied_qual += 1
                quality_counts[grade] += 1

    print("\nDataset preparation complete!")
    print(f"Crop Type Classes: {len(os.listdir(crop_data_dir))}")
    print(f"Quality Grade Counts: {quality_counts}")
    print("\nNext, run the training commands:")
    print(f"python -m services.vision_service --retrain-crop --crop-data data/crop_types --epochs 5")
    print(f"python -m services.vision_service --retrain --epochs 5")

if __name__ == "__main__":
    prepare_datasets()

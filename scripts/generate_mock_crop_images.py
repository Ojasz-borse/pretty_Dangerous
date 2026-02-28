import os
import random
from PIL import Image, ImageDraw, ImageFilter

# Define paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "crop_images")

# Create directories
for grade in ["grade_a", "grade_b", "grade_c"]:
    os.makedirs(os.path.join(DATA_DIR, grade), exist_ok=True)

def generate_image(grade, index):
    # Base canvas (224x224 for MobileNetV2)
    img = Image.new('RGB', (224, 224), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Randomize position and size slightly
    x_offset = random.randint(-20, 20)
    y_offset = random.randint(-20, 20)
    r = random.randint(70, 90)
    
    center = (112 + x_offset, 112 + y_offset)
    bbox = [center[0] - r, center[1] - r, center[0] + r, center[1] + r]
    
    if grade == "grade_a":
        # Fresh Tomato: Bright red, smooth, green stem
        color = (random.randint(200, 255), random.randint(0, 50), random.randint(0, 50))
        draw.ellipse(bbox, fill=color, outline=(200, 0, 0))
        # Draw stem
        stem_bbox = [center[0] - 10, center[1] - r - 15, center[0] + 10, center[1] - r + 5]
        draw.rectangle(stem_bbox, fill=(0, 200, 0))
        
    elif grade == "grade_b":
        # Average Tomato: Dull red/orange, few spots
        color = (random.randint(150, 200), random.randint(50, 100), random.randint(0, 50))
        draw.ellipse(bbox, fill=color, outline=(150, 50, 0))
        # Draw a few spots
        for _ in range(random.randint(2, 5)):
            sx = random.randint(center[0]-r+20, center[0]+r-20)
            sy = random.randint(center[1]-r+20, center[1]+r-20)
            draw.ellipse([sx-5, sy-5, sx+5, sy+5], fill=(100, 50, 0))
            
    elif grade == "grade_c":
        # Rotten Tomato: Dark brown/black, irregular shape (simulated with large spots), mold
        color = (random.randint(50, 100), random.randint(30, 60), random.randint(0, 30))
        draw.ellipse(bbox, fill=color, outline=(30, 20, 0))
        
        # Lots of dark and moldy spots
        for _ in range(random.randint(10, 25)):
            sx = random.randint(center[0]-r+10, center[0]+r-10)
            sy = random.randint(center[1]-r+10, center[1]+r-10)
            spot_color = random.choice([(30, 30, 30), (200, 200, 200), (0, 0, 0)]) # Black spots or white mold
            draw.ellipse([sx-10, sy-10, sx+10, sy+10], fill=spot_color)
            
    # Add some noise to all images
    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.5, 1.5)))
    
    return img

print("Generating synthetic crop images for CNN training...")
images_per_class = 50

for grade in ["grade_a", "grade_b", "grade_c"]:
    for i in range(images_per_class):
        img = generate_image(grade, i)
        img.save(os.path.join(DATA_DIR, grade, f"synthetic_{grade}_{i}.jpg"))

print(f"Generated {images_per_class} images per class in {DATA_DIR}")

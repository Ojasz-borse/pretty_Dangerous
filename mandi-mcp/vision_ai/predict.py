import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Load the trained model
try:
    if os.path.exists("vegetable_model.keras"):
        model = tf.keras.models.load_model("vegetable_model.keras")
    elif os.path.exists("vegetable_model.h5"):
        model = tf.keras.models.load_model("vegetable_model.h5")
    else:
        model = None
    CLASS_NAMES = ['Cabbage', 'Carrot', 'Potato', 'Radish', 'Tomato'] # Alphanumeric from dataset
except Exception as e:
    model = None
    print("Model file not found. Please run train.py first.")

def predict_crop(image_path_or_file):
    if model is None:
        return "Model not loaded", 0.0
    
    # 1. Load and preprocess image
    img = Image.open(image_path_or_file).convert('RGB')
    img = img.resize((128, 128))
    img_array = tf.expand_dims(tf.keras.preprocessing.image.img_to_array(img), 0)
    
    # 2. Prediction
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    
    crop_name = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]) * 100)
    
    return crop_name, confidence

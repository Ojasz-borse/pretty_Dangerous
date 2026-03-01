import tensorflow as tf
from tensorflow.keras import layers, models
import os

# 1. Setup Parameters
IMG_SIZE = 128
BATCH_SIZE = 32
# Updated to absolute project path
TRAIN_DIR = r"c:\docs\Downloads\Pretty_Dangerous\pretty_Dangerous\data\Vegetable Images\train"
VAL_DIR = r"c:\docs\Downloads\Pretty_Dangerous\pretty_Dangerous\data\Vegetable Images\validation"
EPOCHS = 15

# 2. Load Dataset
train_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    VAL_DIR,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
print(f"Detected classes: {class_names}")

# 3. Data Augmentation
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

# 4. Build Custom CNN Architecture (From Scratch)
model = models.Sequential([
    layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3)),
    data_augmentation,
    layers.Rescaling(1./255), # Normalize
    
    # Conv Block 1
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Conv Block 2
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Conv Block 3
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Dense Block
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5), # Regularization
    layers.Dense(len(class_names), activation='softmax')
])

# 5. Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# 6. Train
print("Starting training...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# 7. Save Model
model.save("vegetable_model.keras")
print("Model saved as vegetable_model.keras")

# 8. Output Accuracy
final_acc = history.history['accuracy'][-1]
final_val_acc = history.history['val_accuracy'][-1]
print(f"Final training accuracy: {final_acc:.4f}")
print(f"Final validation accuracy: {final_val_acc:.4f}")

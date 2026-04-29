'''
    File: API.py
    Description: This file contains the Flask API for image classification.
'''

# Import necessary libraries and modules.
import torch
from flask import Flask, request, jsonify
from PIL import Image
import torchvision.transforms as transforms
import io
import torch.nn as nn
from torchvision import models
import cv2
import numpy as np
import base64

# Define the model architecture and load the pre-trained weights from the checkpoint.
checkpoint = torch.load("Backend/model.pth", map_location="cpu") # Load the model checkpoint
NUM_CLASSES = checkpoint["num_classes"] # Number of classes in the model
CLASS_NAMES = [checkpoint["id2label"][i] for i in range(NUM_CLASSES)] # Class names corresponding to class indices

def build_model(num_classes: int):  # Function to build the ResNet50 model with a custom fully connected layer
    model = models.resnet50(weights=None) 
    in_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(in_features, 512),
        nn.ReLU(),
        nn.Dropout(p=0.3),
        nn.Linear(512, num_classes),
    )
    return model

model = build_model(NUM_CLASSES)
model.load_state_dict(checkpoint["model_state_dict"]) # Load the model weights from the checkpoint
model.eval() # Set the model to evaluation mode
    

# Define the image transformation pipeline to preprocess the input images before feeding them into the model.
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize the image to 224x224 pixels
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], # Normalize the image using the mean and standard deviation of the ImageNet dataset
                         std=[0.229, 0.224, 0.225])
])

# Grad-CAM implementation to generate heatmaps for visualizing the regions of the image that contribute most to the model's predictions.
# Hook storage
gradients = None
activations = None

def save_gradient(module, grad_input, grad_output):
    global gradients
    gradients = grad_output[0]

def save_activation(module, input, output):
    global activations
    activations = output

# Register hooks on the last convolutional layer
target_layer = model.layer4[-1]
target_layer.register_forward_hook(save_activation)
target_layer.register_backward_hook(save_gradient)

def generate_gradcam(image_tensor, class_idx):
    global gradients, activations

    model.zero_grad()
    output = model(image_tensor)

    one_hot = torch.zeros_like(output)
    one_hot[0][class_idx] = 1

    output.backward(gradient=one_hot)

    grads = gradients[0].cpu().numpy()
    acts = activations[0].cpu().detach().numpy()

    weights = np.mean(grads, axis=(1, 2))
    cam = np.zeros(acts.shape[1:], dtype=np.float32)

    for i, w in enumerate(weights):
        cam += w * acts[i]

    cam = np.maximum(cam, 0)
    cam = cv2.resize(cam, (224, 224))
    cam = cam - np.min(cam)
    cam = cam / (np.max(cam) + 1e-8)

    return cam

def overlay_cam_on_image(img_pil, cam):
    img = np.array(img_pil.resize((224, 224)))
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = np.float32(heatmap) / 255

    overlay = heatmap + np.float32(img) / 255
    overlay = overlay / np.max(overlay)

    overlay = np.uint8(255 * overlay)
    return overlay

# Initialize the Flask application.
app = Flask(__name__)

# Define the '/predict' endpoint to handle POST requests for image classification.
''' 
------------------------------------------------------------------
    Example of how to TEST '/predict' endpoint:
        POST /predict
        Content-Type: multipart/form-data
        {
            "image": (binary image file)
        }
-------------------------------------------------------------------
'''
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")

    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    class_index = predicted.item()

    # Generate Grad-CAM
    cam = generate_gradcam(tensor, class_index)
    overlay = overlay_cam_on_image(image, cam)

    # Convert image to bytes
    _, buffer = cv2.imencode('.jpg', overlay)
    img_bytes = io.BytesIO(buffer).getvalue()

    return jsonify({
        "class_index": class_index,
        "class_name": CLASS_NAMES[class_index] if class_index < len(CLASS_NAMES) else str(class_index),
        "confidence": round(confidence.item(), 4),
        "gradcam_image": base64.b64encode(img_bytes).decode("utf-8")
    }), 200

# Run the Flask application.
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True) 
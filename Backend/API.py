'''
    File: API.py
    Description: This file contains the Flask API for image classification.
'''

# Import necessary libraries and modules.
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torchvision.transforms as transforms
import io
import torch.nn as nn
from torchvision import models

# Enable CORS for the Flask application
app = Flask(__name__)
CORS(app)


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
    # Check if an image file is included in the request
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB") # Open the uploaded image and convert it to RGB format
    tensor = transform(image).unsqueeze(0) # Add a batch dimension to the tensor

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)

    class_index = predicted.item()

    return jsonify({ # Return the predicted class index, class name, and confidence score in the response
        "class_index": class_index,
        "class_name": CLASS_NAMES[class_index] if class_index < len(CLASS_NAMES) else str(class_index),
        "confidence": round(confidence.item(), 4)
    }), 200


# Run the Flask application.
if __name__ == "__main__":
    app.run(debug=True) # Start the Flask application in debug mode
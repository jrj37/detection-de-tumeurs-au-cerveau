from fastapi import FastAPI, UploadFile, File
from app.train_service import start_training_in_background
from PIL import Image
from torchvision import transforms
import torch
from transformers import ViTImageProcessor
import mlflow.pytorch
import io

app = FastAPI(title="Vision Transformer Trainer API")

# Labels mapping
labels = {0: "glioma", 1: "meningioma", 2: "no_tumor", 3: "pituitary"}

# Determine device
device = torch.device(
    "cuda" if torch.cuda.is_available() 
    else "mps" if torch.backends.mps.is_available() 
    else "cpu"
)

@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API ViT 🚀"}

@app.post("/train")
def start_training():
    """Lance l'entraînement ViT."""
    result = start_training_in_background()
    return result

@app.post("/predict")
def predict_tumor(file: UploadFile = File(...)):
    """Prédit le type de tumeur à partir d'une image."""
    try:
        # Load model (using latest production version)
        model_uri = "models:/MonSuperModele/Production"
        model = mlflow.pytorch.load_model(model_uri)
        model.to(device)
        model.eval()

        # Load and preprocess image
        image_data = file.file.read()
        img = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Preprocessing
        feature_extractor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=feature_extractor.image_mean, std=feature_extractor.image_std)
        ])
        x = transform(img).unsqueeze(0).to(device)

        # Inference
        with torch.no_grad():
            outputs = model(x).logits if hasattr(model(x), "logits") else model(x)
            preds = torch.argmax(outputs, dim=1)
            prediction = labels[preds.item()]
            probabilities = torch.softmax(outputs, dim=1)
            confidence = probabilities[0][preds.item()].item()

        return {"prediction": prediction, "confidence": round(confidence, 4)}

    except Exception as e:
        return {"error": str(e)}

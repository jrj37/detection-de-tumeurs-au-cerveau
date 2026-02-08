from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.train_service import start_training_in_background
from PIL import Image
from torchvision import transforms
import torch
from transformers import ViTImageProcessor
import mlflow.pytorch
import io
from datetime import datetime
import uuid

app = FastAPI(title="Vision Transformer Trainer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Labels mapping (French for frontend)
labels_mapping = {
    0: {"en": "glioma", "fr": "Gliome"},
    1: {"en": "meningioma", "fr": "Méningiome"},
    2: {"en": "no_tumor", "fr": "Aucune tumeur"},
    3: {"en": "pituitary", "fr": "Adénome hypophysaire"}
}

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
            model_output = model(x)
            outputs = model_output.logits if hasattr(model_output, "logits") else model_output
            probabilities = torch.softmax(outputs, dim=1)
            preds = torch.argmax(outputs, dim=1)
            prediction_idx = preds.item()
            
            # Get all probabilities
            probs_list = probabilities[0].cpu().tolist()
            
            # Build all classes with percentages
            all_classes = [
                {
                    "label": labels_mapping[idx]["fr"],
                    "confidence": round(probs_list[idx], 4),
                    "percentage": round(probs_list[idx] * 100, 2)
                }
                for idx in range(len(labels_mapping))
            ]
            
            # Sort by confidence for top 3
            top3_indices = sorted(range(len(probs_list)), key=lambda i: probs_list[i], reverse=True)[:3]
            
            # Build top3 results
            top3 = [
                {
                    "label": labels_mapping[idx]["fr"],
                    "confidence": round(probs_list[idx], 4),
                    "percentage": round(probs_list[idx] * 100, 2)
                }
                for idx in top3_indices
            ]
            
            main_label = labels_mapping[prediction_idx]["fr"]
            main_confidence = round(probs_list[prediction_idx], 4)
            main_percentage = round(probs_list[prediction_idx] * 100, 2)
            
            # Determine if uncertain (confidence < 60%)
            is_uncertain = main_confidence < 0.60
            
            # Generate summary
            summary = f"Le modèle estime avec une probabilité de {main_percentage}% qu'il s'agit d'un {main_label.lower()}. Ce résultat est indicatif et ne constitue pas un diagnostic médical."
            
            # Generate advice
            advice = [
                "Consultez un neuroradiologue pour une interprétation professionnelle.",
                "Ce résultat ne prend pas en compte votre historique médical.",
                "Une IRM complémentaire peut être nécessaire pour confirmer."
            ]
            
            if is_uncertain:
                advice.insert(0, "⚠️ La confiance du modèle est faible. Une expertise médicale est particulièrement recommandée.")

        # Return result in format expected by frontend
        return {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "mainLabel": main_label,
            "mainConfidence": main_confidence,
            "mainPercentage": main_percentage,
            "top3": top3,
            "allClasses": all_classes,
            "isUncertain": is_uncertain,
            "summary": summary,
            "advice": advice
        }

    except Exception as e:
        return {"error": str(e)}

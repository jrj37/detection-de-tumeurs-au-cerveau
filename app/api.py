from fastapi import FastAPI
from app.train_service import start_training_in_background

app = FastAPI(title="Vision Transformer Trainer API")

@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API ViT 🚀"}

@app.post("/train")
def start_training():
    """Lance l'entraînement ViT."""
    result = start_training_in_background()
    return result

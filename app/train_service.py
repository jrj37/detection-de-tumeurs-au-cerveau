import threading
import subprocess
import os

def run_training():
    """Lance ton script d'entraînement Hydra (main.py)."""
    print("🚀 Lancement de l'entraînement ViT...")
    os.system("python main.py")  # exécute ton script principal
    print("✅ Entraînement terminé !")

def start_training_in_background():
    """Lance l'entraînement dans un thread pour ne pas bloquer FastAPI."""
    thread = threading.Thread(target=run_training)
    thread.start()
    return {"status": "Training started in background."}

def run_training_with_config(params: dict):
    args = " ".join([f"{k}={v}" for k, v in params.items()])
    os.system(f"python main.py {args}")

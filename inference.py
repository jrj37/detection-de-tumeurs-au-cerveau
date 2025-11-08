
from PIL import Image
from torchvision import transforms
import torch
from transformers import ViTImageProcessor
import mlflow.pytorch

img_path = r"dataset\test\glioma\glioma281.png"
model_uri = "models:/MonSuperModele/19"

def inference(img_path:str,model_uri:str) -> str:
    model = mlflow.pytorch.load_model(model_uri)

    # Exemple d’image
    img = Image.open(img_path).convert("RGB")

    # Prétraitement identique à ton entraînement ViT
    feature_extractor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=feature_extractor.image_mean, std=feature_extractor.image_std)
    ])
    x = transform(img).unsqueeze(0).to("cuda")
    labels = {0:"glioma",1:"meningioma",2:"no_tumor",3:"pituitary"}
    model.eval()
    with torch.no_grad():
        outputs = model(x).logits if hasattr(model(x), "logits") else model(x)
        preds = torch.argmax(outputs, dim=1)
        

    print("Sortie brute du modèle :", labels[preds.item()])

    return labels[preds.item()]

inference(img_path,model_uri)
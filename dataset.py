import os
from torchvision import datasets, transforms
from transformers import ViTImageProcessor
from torch.utils.data import DataLoader


output_dir  = "./dataset"  # dossier où seront créés train/val/test
def prepare_dataset(output_dir:str) -> tuple:
    feature_extractor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=feature_extractor.image_mean, std=feature_extractor.image_std)
    ])
    # -------------------------
    # Étape 4 : Chargement avec ImageFolder
    # -------------------------
    train_dataset = datasets.ImageFolder(os.path.join(output_dir, "train"), transform=transform)
    val_dataset   = datasets.ImageFolder(os.path.join(output_dir, "val"), transform=transform)
    test_dataset  = datasets.ImageFolder(os.path.join(output_dir, "test"), transform=transform)

    return train_dataset, val_dataset, test_dataset

def build_dataloader(train_dataset,val_dataset,batch_size):
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader   = DataLoader(val_dataset, batch_size=batch_size)
    # Prendre un batch
    images, _ = next(iter(train_loader))

    print("Taille du batch d'images :", images.shape)

    return train_loader,val_loader
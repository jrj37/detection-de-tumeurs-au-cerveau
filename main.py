import hydra
from omegaconf import DictConfig
from torchvision import models
from torch.utils.data import DataLoader
from processing import find_images,split,save_split
from dataset import prepare_dataset,build_dataloader
from train import training
from transformers import ViTForImageClassification, ViTImageProcessor
from trainer import Trainer

# -------------------------
# Paramètres
# -------------------------
dataset_dir = "./archive"     # dossier de base contenant les classes
output_dir  = "./dataset"     # dossier où seront créés train/val/test
total_fraction = 0.2          # on prend 20% du dataset total

@hydra.main(version_base=None, config_path="configs", config_name="config")
def main(cfg: DictConfig):
    images, labels = find_images(dataset_dir)
    (train, y_train), (val, y_val), (test, y_test) = split(images, labels)
    print("📂 Copie des fichiers en cours...")
    save_split(train, y_train, "train")
    save_split(val, y_val, "val")
    save_split(test, y_test, "test")
    print("✅ Copie terminée !")
    
    train_dataset, val_dataset, test_dataset = prepare_dataset(output_dir)
    train_loader,val_loader = build_dataloader(train_dataset,val_dataset,32)
    num_labels = len(train_dataset.classes) 
    
    model = ViTForImageClassification.from_pretrained(
    "google/vit-base-patch16-224",
    num_labels=num_labels,
    ignore_mismatched_sizes=True  # réinitialise la tête classifier pour 2 classes
    ).to("cuda")
    trainer = Trainer(model, train_loader, val_loader, cfg)
    trainer.train()

if __name__ == "__main__":
    main()

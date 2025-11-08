import os
import glob
import shutil
from sklearn.model_selection import train_test_split
# -------------------------
# Paramètres
# -------------------------
dataset_dir = "./archive"     # dossier de base contenant les classes
output_dir  = "./dataset"     # dossier où seront créés train/val/test
total_fraction = 0.2          # on prend 20% du dataset total

images = []
labels = []

def find_images(dataset_dir: str) -> list:
    for label in os.listdir(dataset_dir):
        label_dir = os.path.join(dataset_dir, label)
        if os.path.isdir(label_dir):
            # On parcourt plusieurs extensions
            for ext in ["*.png", "*.jpg", "*.jpeg", "*.JPEG"]:
                for img_path in glob.glob(os.path.join(label_dir, ext)):
                    images.append(img_path)
                    labels.append(label)
    return images, labels

def split(images: list, labels: list, total_fraction: float = 0.1):
    # On garde seulement 20% des données
    X_subset, _, y_subset, _ = train_test_split(
        images, labels, test_size=1 - total_fraction, random_state=42
    )

    # Split en train/val/test : 80/10/10
    X_train, X_temp, y_train, y_temp = train_test_split(
        X_subset, y_subset, test_size=0.2, random_state=42
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42
    )

    print(f"Total utilisé : {len(X_subset)} / {len(images)} ({total_fraction*100:.0f}%)")
    print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")

    return (X_train, y_train), (X_val, y_val), (X_test, y_test)

def save_split(split_data, split_labels, split_name):
    for img_path, label in zip(split_data, split_labels):
        dest_dir = os.path.join(output_dir, split_name, label)
        os.makedirs(dest_dir, exist_ok=True)
        shutil.copy(img_path, os.path.join(dest_dir, os.path.basename(img_path)))

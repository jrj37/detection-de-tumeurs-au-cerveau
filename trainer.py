import mlflow
from mlflow.tracking import MlflowClient
import torch
import logging
from omegaconf import DictConfig
from torch import nn, optim

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Trainer:
    def __init__(self, model: nn.Module, train_loader, val_loader, cfg: DictConfig):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.cfg = cfg

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() 
            else "mps" if torch.backends.mps.is_available() 
            else "cpu"
        )
        self.model.to(self.device)

        # Optimizer
        if cfg.training.optimizer.lower() == "adamw":
            self.optimizer = optim.AdamW(self.model.parameters(), lr=cfg.training.learning_rate)
        else:
            raise ValueError(f"Optimizer {cfg.training.optimizer} not supported yet.")

        # Loss function
        if cfg.training.loss_function.lower() == "crossentropyloss":
            self.criterion = nn.CrossEntropyLoss()
        else:
            raise ValueError(f"Loss {cfg.training.loss_function} not supported yet.")

    def train(self):
        mlflow.set_experiment(self.cfg.experiment_name)
        mlflow.enable_system_metrics_logging()

        with mlflow.start_run(run_name=self.cfg.run_name) as run:
            run_id = run.info.run_id
            logger.info(f"Run started with ID: {run_id}")

            # Log hyperparameters
            mlflow.log_params({
                "optimizer": self.cfg.training.optimizer,
                "learning_rate": self.cfg.training.learning_rate,
                "num_epochs": self.cfg.training.num_epochs,
                "loss_function": self.cfg.training.loss_function,
                "device": str(self.device),
                "dataset" :self.cfg.dataset.dataset_name
            })
            
            best_val_accuracy = 0.0  # Pour suivre la meilleure accuracy dans ce run
            for epoch in range(self.cfg.training.num_epochs):
                self.model.train()
                total_loss = 0

                for i, (images, labels) in enumerate(self.train_loader):
                    images, labels = images.to(self.device), labels.to(self.device)
                    self.optimizer.zero_grad()
                    outputs = self.model(images)
                    if hasattr(outputs, "logits"):
                        outputs = outputs.logits
                    loss = self.criterion(outputs, labels)
                    loss.backward()
                    self.optimizer.step()
                    total_loss += loss.item()
                    logger.debug(f"Epoch {epoch+1}, Batch {i+1}, Loss {loss.item():.4f}")

                avg_loss = total_loss / len(self.train_loader)
                val_loss, val_accuracy = self.validate()

                mlflow.log_metric("loss_train", avg_loss, step=epoch)
                mlflow.log_metric("loss_val", val_loss, step=epoch)
                mlflow.log_metric("val_accuracy", val_accuracy, step=epoch)

                logger.info(f"Epoch {epoch+1}/{self.cfg.training.num_epochs} - "
                            f"Train Loss: {avg_loss:.4f}, Val Loss: {val_loss:.4f}, Val Acc: {val_accuracy:.4f}")

                if val_accuracy > best_val_accuracy:
                    best_val_accuracy = val_accuracy

            # Log et registry du modèle
            mlflow.pytorch.log_model(self.model, artifact_path="model")
            logger.info("Model saved successfully.")

            # Enregistrement dans le Model Registry
            result = mlflow.register_model(
                model_uri=f"runs:/{run_id}/model",
                name="MonSuperModele"
            )

            # Tags pour la version
            version_tags = {
                "project": "VIT for medical image",
                "model_type": "VIT-google",
                "author": "Jean-Raphaël Julien"
            }

            client = MlflowClient()
            for k, v in version_tags.items():
                client.set_model_version_tag(
                    name="MonSuperModele",
                    version=result.version,
                    key=k,
                    value=v
                )

            # Gestion Champion / Outsider
            # Récupère la version actuelle en Production
            production_versions = client.get_latest_versions(name="MonSuperModele", stages=["Production"])
            if production_versions:
                prod_accuracy = float(production_versions[0].tags.get("val_accuracy", 0.0))
            else:
                prod_accuracy = 0.0

            # Classement
            if best_val_accuracy > prod_accuracy:
                stage = "Production"
                ranking = "Champion"
            else:
                stage = "Staging"
                ranking = "Outsider"

            # Ajout tags de ranking et métrique
            client.set_model_version_tag(
                name="MonSuperModele",
                version=result.version,
                key="ranking",
                value=ranking
            )
            client.set_model_version_tag(
                name="MonSuperModele",
                version=result.version,
                key="val_accuracy",
                value=str(best_val_accuracy)
            )

            # Transition stage
            client.transition_model_version_stage(
                name="MonSuperModele",
                version=result.version,
                stage=stage
            )

            logger.info(f"Model version {result.version} classified as {ranking} and set to stage {stage}")
            #for i in range(2,15):
             #   client.delete_model_version(name="MonSuperModele", version=i)

    
    def validate(self):
        self.model.eval()
        correct, total, val_loss = 0, 0, 0
        with torch.no_grad():
            for images, labels in self.val_loader:
                images, labels = images.to(self.device), labels.to(self.device)
                outputs = self.model(images).logits if hasattr(self.model(images), "logits") else self.model(images)
                loss = self.criterion(outputs, labels)
                val_loss += loss.item()
                preds = torch.argmax(outputs, dim=1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)

        val_loss /= len(self.val_loader)
        accuracy = correct / total
        logger.info(f"Validation - Loss: {val_loss:.4f}, Accuracy: {accuracy:.4f}")
        return val_loss, accuracy


from pathlib import Path
import json
import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

# 1. Localiser les fichiers du modèle
BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "models" / "pipeline_immobilier.joblib"
METADATA_PATH = BASE_DIR / "models" / "pipeline_metadata.json"

# 2. Charger le pipeline une seule fois
pipeline = joblib.load(MODEL_PATH)

with open(METADATA_PATH, "r", encoding="utf-8") as f:
    metadata = json.load(f)

feature_columns = metadata["variables_entree"]

# 3. Créer l'application FastAPI
app = FastAPI(
    title="California Housing Prediction API",
    description="API de prédiction immobilière avec CatBoost",
    version="1.0.0"
)

# Autoriser uniquement les origines de développement utilisées par Vite.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# 4. Définir les données attendues
class HousingInput(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        allow_inf_nan=False
    )

    MedInc: float = Field(ge=0)
    HouseAge: float = Field(ge=0)
    AveRooms: float = Field(gt=0)
    AveBedrms: float = Field(gt=0)
    Population: float = Field(gt=0)
    AveOccup: float = Field(gt=0)
    Latitude: float = Field(ge=-90, le=90)
    Longitude: float = Field(ge=-180, le=180)


# 5. Route de vérification
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": metadata["nom_modele"]
    }


# 6. Route de prédiction
@app.post("/predict")
def predict(data: HousingInput):

    # Transformer le JSON en DataFrame
    valeurs = data.model_dump()

    X = pd.DataFrame(
        [valeurs],
        columns=feature_columns
    )

    # Utiliser le pipeline sauvegardé
    prediction = pipeline.predict(X)[0]

    # Conversion en dollars
    prediction_usd = float(prediction * 100000)

    return {
        "model": metadata["nom_modele"],
        "predicted_median_value_usd": round(
            prediction_usd, 2
        )
    }

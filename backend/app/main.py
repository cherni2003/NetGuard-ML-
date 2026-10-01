from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import List
import numpy as np
import pandas as pd
import io

from app.models import PredictionInput, PredictionOutput, AnomalyOutput, AnomalyInput
from app.ml import detector

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML models on startup
    detector.load()
    yield
    # Clean up on shutdown

app = FastAPI(title="Network Anomaly Detection API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/institutions")
def get_institutions():
    return {"n_institutions": detector.config.get('n_institutions', 0)}

@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    window = np.array(data.data)
    if window.shape != (24, 18):
        raise HTTPException(status_code=400, detail=f"Expected shape (24, 18), got {window.shape}")
    
    # Expand dims for batch size 1
    window = np.expand_dims(window, axis=0)
    preds = detector.predict(window)[0]
    
    return {"predictions": {col: float(preds[i]) for i, col in enumerate(detector.target_cols)}}

@app.post("/anomaly", response_model=AnomalyOutput)
def anomaly(data: AnomalyInput):
    window = np.array(data.data)
    if window.shape != (24, 18):
        raise HTTPException(status_code=400, detail=f"Expected shape (24, 18), got {window.shape}")
    
    y_true = np.array(data.y_true)
    if y_true.shape != (6,):
        raise HTTPException(status_code=400, detail=f"Expected y_true shape (6,), got {y_true.shape}")
        
    window = np.expand_dims(window, axis=0)
    y_true = np.expand_dims(y_true, axis=0)
    
    y_pred = detector.predict(window)
    res = detector.compute_anomaly(y_true, y_pred)
    
    return res

@app.post("/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Must be a CSV file")
        
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV: {e}")
        
    # Validation basique (on attend les colonnes feature et cibles, ou juste un moyen de créer des fenêtres)
    # Pour l'instant on simule le traitement, car cela dépend fortement du format d'entrée exact du CSV
    return {"message": "Batch processing successful (simulated)", "rows_processed": len(df)}


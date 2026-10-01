from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class PredictionInput(BaseModel):
    # Shape should be (24, 18)
    data: List[List[float]] = Field(..., description="Array of shape (24, 18)")
    
class AnomalyInput(BaseModel):
    data: List[List[float]] = Field(..., description="Array of shape (24, 18)")
    y_true: List[float] = Field(..., description="Actual values of the 6 targets for the current step")

class PredictionOutput(BaseModel):
    predictions: Dict[str, float]

class AnomalyOutput(BaseModel):
    composite_score: float
    is_anomaly: bool
    volume_alert: bool
    behavior_alert: bool
    top_metrics: List[Dict[str, Any]]
    predictions: Dict[str, float]

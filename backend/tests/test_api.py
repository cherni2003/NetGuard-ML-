import pytest
from fastapi.testclient import TestClient
from app.main import app
import numpy as np

# We mock the ML detector load so we don't need real models for basic API tests
from app.ml import detector

class MockDetector:
    def __init__(self):
        self.config = {'n_institutions': 283}
        self.target_cols = ['n_bytes_log1p', 'n_flows', 'tcp_udp_ratio_bytes', 'dir_ratio_bytes', 'sum_n_dest_ip', 'sum_n_dest_ports']
        
    def load(self):
        pass
        
    def predict(self, window):
        return np.zeros((1, 6))
        
    def compute_anomaly(self, y_true, y_pred):
        return {
            'composite_score': 1.5,
            'is_anomaly': False,
            'volume_alert': False,
            'behavior_alert': False,
            'top_metrics': [{'metric': 'n_flows', 'z_score': 0.5, 'residual': 0.1}],
            'predictions': {col: 0.0 for col in self.target_cols}
        }

# We replace the real detector with the mock for testing the endpoints
@pytest.fixture(autouse=True)
def mock_detector(monkeypatch):
    monkeypatch.setattr('app.main.detector', MockDetector())

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_predict():
    data = {"data": np.zeros((24, 18)).tolist()}
    response = client.post("/predict", json=data)
    assert response.status_code == 200
    assert "predictions" in response.json()

def test_anomaly():
    data = {
        "data": np.zeros((24, 18)).tolist(),
        "y_true": np.zeros(6).tolist()
    }
    response = client.post("/anomaly", json=data)
    assert response.status_code == 200
    res = response.json()
    assert "composite_score" in res
    assert "is_anomaly" in res

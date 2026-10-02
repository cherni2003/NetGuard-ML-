import os
import pickle
import numpy as np
import tensorflow as tf
from scipy.stats import chi2

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

class AnomalyDetector:
    def __init__(self, models_dir: str = '../models'):
        self.models_dir = models_dir
        self.model = None
        self.scaler = None
        self.config = None
        self.results = None
        self.mcd_models = None
        
        self.feature_cols = []
        self.target_cols = []
        
        self.vol_indices = []
        self.beh_indices = []
        
    def load(self):
        # Load Config
        with open(os.path.join(self.models_dir, 'lstm_config.pkl'), 'rb') as f:
            self.config = pickle.load(f)
            
        self.feature_cols = self.config['feature_cols']
        self.target_cols = self.config['target_cols']
        
        # Identify group indices
        vol_cols = ['n_bytes_log1p', 'n_flows']
        beh_cols = ['tcp_udp_ratio_bytes', 'dir_ratio_bytes', 'sum_n_dest_ip', 'sum_n_dest_ports']
        
        self.vol_indices = [self.target_cols.index(c) for c in vol_cols if c in self.target_cols]
        self.beh_indices = [self.target_cols.index(c) for c in beh_cols if c in self.target_cols]
        
        # Load Scaler
        with open(os.path.join(self.models_dir, 'lstm_scaler.pkl'), 'rb') as f:
            self.scaler = pickle.load(f)
            
        import joblib
        # Load MCD Models using joblib (as it was likely saved with compression/joblib)
        self.mcd_models = joblib.load(os.path.join(self.models_dir, 'mcd_models.pkl'))
            
        # Load Results (for threshold and metric stats)
        with open(os.path.join(self.models_dir, 'lstm_results.pkl'), 'rb') as f:
            self.results = pickle.load(f)
            
        # Load Keras Model
        self.model = tf.keras.models.load_model(os.path.join(self.models_dir, 'lstm_best_model.keras'))
        
    def predict(self, window_data: np.ndarray) -> np.ndarray:
        # window_data shape: (1, 24, 18)
        return self.model.predict(window_data, verbose=0)
        
    def compute_anomaly(self, y_true: np.ndarray, y_pred: np.ndarray):
        # y_true shape: (1, 6), y_pred shape: (1, 6)
        residuals = np.abs(y_true - y_pred)[0]
        
        # Composite score
        # Using MAE from results as approximation of residual mean if not explicitly saved
        z_scores = []
        top_metrics = []
        for i, col in enumerate(self.target_cols):
            metric_stats = self.results['per_metric'].get(col, {})
            mean = metric_stats.get('mae', 0.0) 
            # Approximate std, fallback to 1.0 if not available to avoid div by zero
            rmse = float(metric_stats.get('rmse', 1.0))
            std = np.sqrt(max(1e-6, rmse**2 - mean**2)) 
            
            z = (residuals[i] - mean) / std if std > 0 else 0
            z_scores.append(z)
            top_metrics.append({'metric': col, 'z_score': float(z), 'residual': float(residuals[i])})
            
        composite_score = float(np.mean(z_scores))
        threshold = float(self.results.get('composite_threshold', 2.0))
        is_anomaly = composite_score > threshold
        
        # MCD Mahalanobis
        # The prompt says: "distance de Mahalanobis (MinCovDet) séparément sur le groupe volume et le groupe comportement, seuil chi2 avec ALPHA = 0.01"
        def compute_mcd_alert(group_name, indices):
            if not indices or group_name not in self.mcd_models:
                return False
            mcd = self.mcd_models[group_name]
            group_residuals = residuals[indices].reshape(1, -1)
            dist = mcd.mahalanobis(group_residuals)[0]
            df = len(indices)
            chi2_thresh = chi2.ppf(0.99, df) # ALPHA = 0.01
            return dist > chi2_thresh
            
        vol_alert = compute_mcd_alert('vol', self.vol_indices)
        beh_alert = compute_mcd_alert('beh', self.beh_indices)
        
        # Sort top metrics by z-score descending
        top_metrics.sort(key=lambda x: x['z_score'], reverse=True)
        
        return {
            'composite_score': composite_score,
            'is_anomaly': is_anomaly,
            'volume_alert': bool(vol_alert),
            'behavior_alert': bool(beh_alert),
            'top_metrics': top_metrics,
            'predictions': {col: float(y_pred[0][i]) for i, col in enumerate(self.target_cols)}
        }

detector = AnomalyDetector()

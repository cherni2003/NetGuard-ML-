import pickle
import sys

try:
    with open('../models/mcd_models.pkl', 'rb') as f:
        data = pickle.load(f)
    print('Pickle loaded successfully')
except Exception as e:
    print('Pickle failed:', type(e), e)

try:
    import joblib
    data = joblib.load('../models/mcd_models.pkl')
    print('Joblib loaded successfully')
    print(data.keys() if hasattr(data, 'keys') else type(data))
except Exception as e:
    print('Joblib failed:', type(e), e)

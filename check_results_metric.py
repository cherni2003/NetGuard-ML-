import pickle
with open('models/lstm_results.pkl', 'rb') as f:
    res = pickle.load(f)
print(res['per_metric']['n_bytes_log1p'])

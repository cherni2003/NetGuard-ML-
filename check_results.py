import pickle
with open('models/lstm_results.pkl', 'rb') as f:
    res = pickle.load(f)
print('Keys in lstm_results:', res.keys())
for k, v in res.items():
    if isinstance(v, dict):
        print(f'{k}: {list(v.keys())}')
    else:
        print(f'{k}: {type(v)}')

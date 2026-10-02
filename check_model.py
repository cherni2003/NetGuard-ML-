import pickle
with open('models/lstm_config.pkl', 'rb') as f:
    config = pickle.load(f)
print(config.keys())
for k, v in config.items():
    print(f'{k}: {v}')

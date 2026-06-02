import pandas as pd
import os

bps_dir = 'data/bps'

for root, dirs, files in os.walk(bps_dir):
    for file in files:
        if file.endswith('.csv'):
            path = os.path.join(root, file)
            print(f'\n=== {file} ===')
            try:
                df = pd.read_csv(path, encoding='utf-8')
            except:
                df = pd.read_csv(path, encoding='latin1')
            print(f'Shape: {df.shape}')
            print(f'Kolom: {df.columns.tolist()}')
            print(df.head(3).to_string())
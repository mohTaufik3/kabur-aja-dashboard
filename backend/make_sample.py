import pandas as pd

df = pd.read_csv('data/sentiment_results.csv')
print('Data loaded:', len(df), 'baris')
print(df['sentiment'].value_counts().to_string())

neg = df[df['sentiment']=='negatif'].sample(236, random_state=42)
pos = df[df['sentiment']=='positif'].sample(88, random_state=42)
net = df[df['sentiment']=='netral'].sample(76, random_state=42)

sample = pd.concat([neg, pos, net]).sample(frac=1, random_state=42).reset_index(drop=True)
sample['label_manual'] = ''

sample[['full_text', 'clean_text', 'sentiment', 'label_manual']].to_csv('data/sample_for_labeling.csv', index=False)

print(f'Sample tersimpan: {len(sample)} data')
print('Buka file data/sample_for_labeling.csv')
print('Isi kolom label_manual dengan: positif / netral / negatif')
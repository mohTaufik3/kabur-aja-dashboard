import pandas as pd

df = pd.read_csv('data/sentiment_results.csv')

# Pisahkan berdasarkan confidence
low_conf  = df[df['confidence'] < 70].copy()
high_conf = df[df['confidence'] >= 70].copy()

# Data confidence tinggi — langsung pakai hasil pipeline sebagai label final
high_conf['label_final'] = high_conf['sentiment']

# Data confidence rendah — label_final dikosongkan untuk diisi manual
low_conf['label_final'] = low_conf['sentiment']  # pre-fill dari pipeline
low_conf = low_conf.sort_values('confidence', ascending=True).reset_index(drop=True)

# Simpan file untuk review di Excel
low_conf[['full_text', 'clean_text', 'sentiment', 'confidence', 'label_final']].to_csv(
    'data/review_low_confidence.csv', index=False
)

# Simpan data confidence tinggi
high_conf[['full_text', 'clean_text', 'sentiment', 'confidence', 'label_final', 'platform']].to_csv(
    'data/high_confidence_data.csv', index=False
)

print(f"Total data                    : {len(df)}")
print(f"Confidence >= 70% (langsung)  : {len(high_conf)}")
print(f"Confidence < 70%  (review)    : {len(low_conf)}")
print(f"\nDistribusi data review per sentimen:")
print(low_conf['sentiment'].value_counts().to_string())
print(f"\nFile tersimpan:")
print("- data/review_low_confidence.csv  → buka di Excel, koreksi kolom label_final")
print("- data/high_confidence_data.csv   → langsung dipakai sebagai training data")
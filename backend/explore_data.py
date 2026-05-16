import pandas as pd

# Load kedua dataset
df_x = pd.read_csv('data/KaburAjaDulu_final.csv')
df_tt = pd.read_csv('data/KaburAjaDuluTT_ALL.csv')

print("=" * 50)
print("DATASET X (Twitter)")
print("=" * 50)
print(f"Jumlah data    : {len(df_x)}")
print(f"Kolom          : {df_x.columns.tolist()}")
print(f"Missing values :\n{df_x.isnull().sum()}")
print(f"\nContoh data:")
print(df_x['full_text'].head(3).to_string())

print("\n" + "=" * 50)
print("DATASET TIKTOK")
print("=" * 50)
print(f"Jumlah data    : {len(df_tt)}")
print(f"Kolom          : {df_tt.columns.tolist()}")
print(f"Missing values :\n{df_tt.isnull().sum()}")
print(f"\nContoh data:")
print(df_tt['full_text'].head(3).to_string())

print("\n" + "=" * 50)
print("GABUNGAN")
print("=" * 50)
df_x['platform'] = 'X'
df_tt['platform'] = 'TikTok'
df_all = pd.concat([df_x, df_tt], ignore_index=True)
print(f"Total data     : {len(df_all)}")
print(f"Duplikat       : {df_all['full_text'].duplicated().sum()}")
print(f"Teks kosong    : {df_all['full_text'].isna().sum()}")

# Cek panjang teks
df_all['text_length'] = df_all['full_text'].astype(str).apply(len)
print(f"\nPanjang teks:")
print(f"  Rata-rata    : {df_all['text_length'].mean():.0f} karakter")
print(f"  Terpendek    : {df_all['text_length'].min()} karakter")
print(f"  Terpanjang   : {df_all['text_length'].max()} karakter")
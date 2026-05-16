import pandas as pd
import re

def clean_text(text):
    """Preprocessing teks media sosial"""
    if not isinstance(text, str):
        return None
    
    # Hapus URL
    text = re.sub(r'http\S+|www\S+', '', text)
    # Hapus mention (@username)
    text = re.sub(r'@\w+', '', text)
    # Hapus hashtag symbol tapi simpan kata-katanya
    text = re.sub(r'#(\w+)', r'\1', text)
    # Hapus karakter non-alfanumerik berlebihan
    text = re.sub(r'[^\w\s]', ' ', text)
    # Hapus angka
    text = re.sub(r'\d+', '', text)
    # Hapus whitespace berlebihan
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text if len(text) >= 5 else None

def preprocess():
    print("Loading datasets...")
    df_x  = pd.read_csv('data/KaburAjaDulu_final.csv')
    df_tt = pd.read_csv('data/KaburAjaDuluTT_ALL.csv')

    # Tambah kolom platform
    df_x['platform']  = 'X'
    df_tt['platform'] = 'TikTok'

    # Seragamkan kolom — buang kolom lang dari X
    df_x = df_x[['created_at', 'full_text', 'id_str', 'platform']]
    df_tt = df_tt[['created_at', 'full_text', 'id_str', 'platform']]

    # Gabungkan
    df = pd.concat([df_x, df_tt], ignore_index=True)
    print(f"Total sebelum cleaning : {len(df)}")

    # Hapus teks kosong
    df = df.dropna(subset=['full_text'])

    # Cleaning teks
    df['clean_text'] = df['full_text'].apply(clean_text)

    # Hapus hasil cleaning yang None (teks terlalu pendek)
    df = df.dropna(subset=['clean_text'])

    # Hapus duplikat berdasarkan clean_text
    df = df.drop_duplicates(subset=['clean_text'])

    # Reset index
    df = df.reset_index(drop=True)

    print(f"Total setelah cleaning  : {len(df)}")
    print(f"Data dihapus            : {22095 - len(df)}")
    print(f"\nPer platform:")
    print(df['platform'].value_counts().to_string())

    # Simpan hasil
    df.to_csv('data/cleaned_data.csv', index=False)
    print(f"\n✅ Tersimpan di data/cleaned_data.csv")

    # Preview
    print(f"\nContoh hasil cleaning:")
    sample = df[['full_text', 'clean_text', 'platform']].head(3)
    for _, row in sample.iterrows():
        print(f"\nOriginal : {row['full_text'][:80]}")
        print(f"Cleaned  : {row['clean_text'][:80]}")
        print(f"Platform : {row['platform']}")

if __name__ == '__main__':
    preprocess()
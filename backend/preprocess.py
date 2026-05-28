import pandas as pd
import re

def clean_text(text):
    if not isinstance(text, str):
        return None
    
    # URL
    text = re.sub(r'http\S+|www\S+', '', text)
    # mention
    text = re.sub(r'@\w+', '', text)
    # hashtag symbol
    text = re.sub(r'#(\w+)', r'\1', text)
    # emoji dan karakter unicode non-latin
    text = re.sub(r'[^\x00-\x7F\u00C0-\u024F\u1E00-\u1EFF]', ' ', text)
    # karakter non-alfanumerik
    text = re.sub(r'[^\w\s]', ' ', text)
    # angka
    text = re.sub(r'\d+', '', text)
    # whitespace berlebihan
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text if len(text) >= 5 else None

def preprocess():
    df_x  = pd.read_csv('data/KaburAjaDulu_final.csv')
    df_tt = pd.read_csv('data/KaburAjaDuluTT_ALL.csv')

    df_x['platform']  = 'X'
    df_tt['platform'] = 'TikTok'

    df_x  = df_x[['created_at', 'full_text', 'id_str', 'platform']]
    df_tt = df_tt[['created_at', 'full_text', 'id_str', 'platform']]

    df = pd.concat([df_x, df_tt], ignore_index=True)
    print(f"Total sebelum cleaning : {len(df)}")

    df = df.dropna(subset=['full_text'])
    df['clean_text'] = df['full_text'].apply(clean_text)
    df = df.dropna(subset=['clean_text'])
    df = df.drop_duplicates(subset=['clean_text'])
    df = df.reset_index(drop=True)

    print(f"Total setelah cleaning  : {len(df)}")
    print(f"Data dihapus            : {22095 - len(df)}")
    print(f"\nPer platform:")
    print(df['platform'].value_counts().to_string())

    print(f"\nContoh hasil cleaning:")
    sample = df[['full_text', 'clean_text']].head(5)
    for _, row in sample.iterrows():
        print(f"Original : {row['full_text'][:80]}")
        print(f"Cleaned  : {row['clean_text'][:80]}")
        print()

    df.to_csv('data/cleaned_data.csv', index=False)

if __name__ == '__main__':
    preprocess()
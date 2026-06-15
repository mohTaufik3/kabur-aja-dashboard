from fastapi import APIRouter, HTTPException
import pandas as pd
import os
import math

router = APIRouter(prefix="/api/topics", tags=["BERTopic Results"])

def get_sample_comments():
    path_all_data = "data/merged_topic_sentiment.csv"
    samples_dict = {}
    
    if os.path.exists(path_all_data):
        try:
            df_all = pd.read_csv(path_all_data)
            if 'clean_text' in df_all.columns and 'topic_id_v2' in df_all.columns:
                for t_id, group in df_all.groupby('topic_id_v2'):
                    samples_dict[int(t_id)] = group['clean_text'].dropna().head(3).tolist()
        except Exception as e:
            print(f"Error saat memuat contoh komentar asli dataset: {e}")
            
    return samples_dict

@router.get("/summary")
def get_topics_summary():
    path = "data/topic_sentiment_bps.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File topic_sentiment_bps.csv tidak ditemukan. Jalankan run_bertopic_pipeline.py terlebih dahulu.")
    
    df = pd.read_csv(path)
    df = df.sort_values(by='total', ascending=False)
    
    samples = get_sample_comments()
    df['sample_comments'] = df['topic_id_v2'].apply(lambda x: samples.get(int(x), []))
    
    return df.to_dict(orient="records")

@router.get("/by-category")
def get_topics_by_bps_category():
    path = "data/topic_sentiment_bps.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File topic_sentiment_bps.csv tidak ditemukan.")
    
    df = pd.read_csv(path)
    
    summary = df.groupby('bps_category')['total'].sum().reset_index()
    return summary.to_dict(orient="records")

@router.get("/with-bps")
def get_topics_with_bps():
    path = "data/topic_sentiment_bps.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File tidak ditemukan.")

    def clean_nan(records):
        for record in records:
            for key, value in record.items():
                if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
                    record[key] = None
        return records

    df_topics = pd.read_csv(path)
    df_topics = df_topics.sort_values('total', ascending=False)

    bps_data = {}

    # Gaji
    try:
        df_gaji_24 = pd.read_csv('data/bps/clean_bps/gaji_2024.csv')
        df_gaji_25 = pd.read_csv('data/bps/clean_bps/gaji_2025.csv')
        bps_data['gaji_2024'] = clean_nan(df_gaji_24.to_dict(orient='records'))
        bps_data['gaji_2025'] = clean_nan(df_gaji_25.to_dict(orient='records'))
    except Exception as e:
        bps_data['gaji_2024'] = []
        bps_data['gaji_2025'] = []

    # TPT
    try:
        df_tpt_24 = pd.read_csv('data/bps/clean_bps/tpt_2024.csv')
        df_tpt_25 = pd.read_csv('data/bps/clean_bps/tpt_2025.csv')
        bps_data['tpt_2024'] = clean_nan(df_tpt_24.to_dict(orient='records'))
        bps_data['tpt_2025'] = clean_nan(df_tpt_25.to_dict(orient='records'))
    except:
        bps_data['tpt_2024'] = []
        bps_data['tpt_2025'] = []

    # Angkatan kerja umur
    try:
        df_ak_24 = pd.read_csv('data/bps/clean_bps/angkatan_kerja_umur_2024.csv')
        df_ak_25 = pd.read_csv('data/bps/clean_bps/angkatan_kerja_umur_2025.csv')
        bps_data['angkatan_kerja_2024'] = clean_nan(df_ak_24.to_dict(orient='records'))
        bps_data['angkatan_kerja_2025'] = clean_nan(df_ak_25.to_dict(orient='records'))
    except:
        bps_data['angkatan_kerja_2024'] = []
        bps_data['angkatan_kerja_2025'] = []

    # Mapping kategori BPS → data BPS yang relevan
    CATEGORY_BPS_MAP = {
        'Upah & Kesejahteraan': {
            'label': 'Rata-rata Upah/Gaji Nasional',
            'insight': 'Keluhan gaji di media sosial dibandingkan data upah riil BPS',
            'bps_keys': ['gaji_2024', 'gaji_2025']
        },
        'Ketenagakerjaan': {
            'label': 'Tingkat Pengangguran & Angkatan Kerja',
            'insight': 'Keresahan lapangan kerja dibandingkan data TPT dan angkatan kerja BPS',
            'bps_keys': ['tpt_2024', 'tpt_2025', 'angkatan_kerja_2024', 'angkatan_kerja_2025']
        },
        'Migrasi & Ketenagakerjaan LN': {
            'label': 'Angkatan Kerja Usia Produktif',
            'insight': 'Minat migrasi ke luar negeri dibandingkan komposisi angkatan kerja muda BPS',
            'bps_keys': ['angkatan_kerja_2024', 'angkatan_kerja_2025']
        },
        'Kebijakan Pemerintah': {
            'label': 'Tingkat Pengangguran per Provinsi',
            'insight': 'Ketidakpercayaan terhadap pemerintah dibandingkan kondisi ketenagakerjaan aktual',
            'bps_keys': ['tpt_2024', 'tpt_2025']
        },
        'Pendidikan': {
            'label': 'Angkatan Kerja Muda (15-24 tahun)',
            'insight': 'Keresahan pendidikan dibandingkan data angkatan kerja usia muda BPS',
            'bps_keys': ['angkatan_kerja_2024', 'angkatan_kerja_2025']
        },
        'Lainnya': {
            'label': 'Data Umum Ketenagakerjaan',
            'insight': 'Topik umum terkait kondisi ketenagakerjaan Indonesia',
            'bps_keys': ['tpt_2025']
        }
    }

    # Muat kumpulan contoh komentar asli dari dataset
    samples = get_sample_comments()

    # Bangun response
    result = []
    for _, row in df_topics.iterrows():
        category = row.get('bps_category', 'Lainnya')
        mapping  = CATEGORY_BPS_MAP.get(category, CATEGORY_BPS_MAP['Lainnya'])

        # Ambil data BPS yang relevan
        relevant_bps = {}
        for key in mapping['bps_keys']:
            relevant_bps[key] = bps_data.get(key, [])

        topic_entry = {
            'topic_id':           int(row['topic_id_v2']),
            'topic_label':        str(row['topic_label']),
            'keywords':           str(row['keywords_clean']).split(', '),
            'total':              int(row['total']),
            'negatif':            int(row['negatif']),
            'netral':             int(row['netral']),
            'positif':            int(row['positif']),
            'pct_negatif':        float(row['pct_negatif']),
            'pct_positif':        float(row['pct_positif']),
            'pct_netral':         float(row['pct_netral']),
            'dominant_sentiment': str(row['dominant_sentiment']),
            'bps_category':       category,
            'bps_label':          mapping['label'],
            'bps_insight':        mapping['insight'],
            'bps_data':           relevant_bps,
            'sample_comments':    samples.get(int(row['topic_id_v2']), []) # Menyuntikkan list komentar asli langsung dari dataset
        }
        result.append(topic_entry)

    return result
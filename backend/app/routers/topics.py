from fastapi import APIRouter, HTTPException
import pandas as pd
import os
import math

router = APIRouter(prefix="/api/topics", tags=["BERTopic Results"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESEARCH_DATA = os.path.join(BASE_DIR, "../../../research/data")
OUTPUT = os.path.join(RESEARCH_DATA, "output")
CLEAN_BPS = os.path.join(OUTPUT, "clean_bps")

def clean_nan(records):
    for record in records:
        for key, value in record.items():
            if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
                record[key] = None
    return records

def get_sample_comments():
    path_all_data = os.path.join(OUTPUT, "merged_topic_sentiment.csv")
    samples_dict = {}
    if os.path.exists(path_all_data):
        try:
            df_all = pd.read_csv(path_all_data)
            if 'clean_text' in df_all.columns and 'topic_id_v2' in df_all.columns:
                for t_id, group in df_all.groupby('topic_id_v2'):
                    samples_dict[int(t_id)] = group['clean_text'].dropna().head(3).tolist()
        except Exception as e:
            print(f"Error saat memuat contoh komentar: {e}")
    return samples_dict

@router.get("/summary")
def get_topics_summary():
    path = os.path.join(OUTPUT, "topic_sentiment_bps.csv")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File topic_sentiment_bps.csv tidak ditemukan.")
    df = pd.read_csv(path)
    df = df.sort_values(by='total', ascending=False)
    samples = get_sample_comments()
    df['sample_comments'] = df['topic_id_v2'].apply(lambda x: samples.get(int(x), []))
    return df.to_dict(orient="records")

@router.get("/by-category")
def get_topics_by_bps_category():
    path = os.path.join(OUTPUT, "topic_sentiment_bps.csv")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File topic_sentiment_bps.csv tidak ditemukan.")
    df = pd.read_csv(path)
    summary = df.groupby('bps_category')['total'].sum().reset_index()
    return summary.to_dict(orient="records")

@router.get("/with-bps")
def get_topics_with_bps():
    path = os.path.join(OUTPUT, "topic_sentiment_bps.csv")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File tidak ditemukan.")

    df_topics = pd.read_csv(path)
    df_topics = df_topics.sort_values('total', ascending=False)

    bps_data = {}
    for key, filename in {
        'gaji_2024': 'gaji_2024.csv',
        'gaji_2025': 'gaji_2025.csv',
        'tpt_2024': 'tpt_2024.csv',
        'tpt_2025': 'tpt_2025.csv',
        'angkatan_kerja_2024': 'angkatan_kerja_umur_2024.csv',
        'angkatan_kerja_2025': 'angkatan_kerja_umur_2025.csv',
    }.items():
        try:
            df_temp = pd.read_csv(os.path.join(CLEAN_BPS, filename))
            bps_data[key] = clean_nan(df_temp.to_dict(orient='records'))
        except:
            bps_data[key] = []

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

    samples = get_sample_comments()
    result = []
    for _, row in df_topics.iterrows():
        category = row.get('bps_category', 'Lainnya')
        mapping = CATEGORY_BPS_MAP.get(category, CATEGORY_BPS_MAP['Lainnya'])
        relevant_bps = {key: bps_data.get(key, []) for key in mapping['bps_keys']}
        result.append({
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
            'sample_comments':    samples.get(int(row['topic_id_v2']), [])
        })
    return result

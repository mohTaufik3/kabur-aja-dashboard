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

def load_bps_file(filename):
    path = os.path.join(CLEAN_BPS, filename)
    try:
        df = pd.read_csv(path)
        return clean_nan(df.to_dict(orient='records'))
    except:
        return []

def load_all_bps_data():
    return {
        # Upah & Kesejahteraan
        'gaji_2024':             load_bps_file('gaji_2024.csv'),
        'gaji_2025':             load_bps_file('gaji_2025.csv'),
        # Ketenagakerjaan
        'tpt_2024':              load_bps_file('tpt_2024.csv'),
        'tpt_2025':              load_bps_file('tpt_2025.csv'),
        'angkatan_kerja_2024':   load_bps_file('angkatan_kerja_umur_2024.csv'),
        'angkatan_kerja_2025':   load_bps_file('angkatan_kerja_umur_2025.csv'),
        'lapangan_kerja_2024':   load_bps_file('lapangan_pekerjaan_utama_2024.csv'),
        'lapangan_kerja_2025':   load_bps_file('lapangan_pekerjaan_utama_2025.csv'),
        # Pendidikan & Migrasi
        'bukan_ak_2024':         load_bps_file('bukan_angkatan_kerja_umur_2024.csv'),
        'bukan_ak_2025':         load_bps_file('bukan_angkatan_kerja_umur_2025.csv'),
        'penduduk_15_2024':      load_bps_file('penduduk_15_keatas_2024.csv'),
        'penduduk_15_2025':      load_bps_file('penduduk_15_keatas_2025.csv'),
        # Sentimen Bangsa & Kebijakan
        'pdrb_2024':             load_bps_file('pdrb_wilayah_2024.csv'),
        'pdrb_2025':             load_bps_file('pdrb_wilayah_2025.csv'),
    }

CATEGORY_BPS_MAP = {
    'Upah & Kesejahteraan': {
        'label': 'Rata-rata Upah/Gaji per Sektor Ekonomi',
        'insight': (
            'Keluhan soal gaji rendah dan beban ekonomi di media sosial '
            'divalidasi dengan data rata-rata upah riil BPS per sektor. '
            'Sektor dengan upah rendah (pertanian, jasa) menjadi konteks '
            'utama keresahan warganet.'
        ),
        'bps_keys': ['gaji_2024', 'gaji_2025']
    },
    'Ketenagakerjaan': {
        'label': 'Tingkat Pengangguran & Lapangan Kerja',
        'insight': (
            'Keresahan soal sulitnya mencari kerja dan persaingan lapangan '
            'kerja divalidasi dengan data TPT per provinsi, angkatan kerja '
            'per golongan umur, dan distribusi pekerja per lapangan pekerjaan utama.'
        ),
        'bps_keys': ['tpt_2024', 'tpt_2025', 'angkatan_kerja_2024', 'angkatan_kerja_2025', 'lapangan_kerja_2024', 'lapangan_kerja_2025']
    },
    'Migrasi & Ketenagakerjaan LN': {
        'label': 'Angkatan Kerja Usia Produktif & Populasi 15+',
        'insight': (
            'Minat bekerja dan migrasi ke luar negeri divalidasi dengan '
            'komposisi angkatan kerja muda (15-24 tahun) dan total populasi '
            'usia produktif. Kelompok umur muda mendominasi diskusi '
            'kaburajadulu ke Jepang, Jerman, Australia, dan negara lainnya.'
        ),
        'bps_keys': ['angkatan_kerja_2024', 'angkatan_kerja_2025', 'penduduk_15_2024', 'penduduk_15_2025']
    },
    'Pendidikan': {
        'label': 'Angkatan Kerja Muda & Populasi Bukan Angkatan Kerja',
        'insight': (
            'Keresahan soal pendidikan, belajar bahasa asing, dan beasiswa '
            'divalidasi dengan data angkatan kerja muda (15-24 tahun) dan '
            'populasi yang masih sekolah (bukan angkatan kerja). '
            'Menggambarkan tekanan transisi dari pendidikan ke dunia kerja.'
        ),
        'bps_keys': ['angkatan_kerja_2024', 'angkatan_kerja_2025', 'bukan_ak_2024', 'bukan_ak_2025']
    },
    'Kebijakan Pemerintah': {
        'label': 'Tingkat Pengangguran per Provinsi & PDRB Wilayah',
        'insight': (
            'Ketidakpercayaan terhadap pemerintah, DPR, dan kebijakan publik '
            'divalidasi dengan kondisi ketenagakerjaan aktual per provinsi (TPT) '
            'dan produktivitas ekonomi wilayah (PDRB). '
            'Provinsi dengan TPT tinggi dan PDRB rendah cenderung menjadi '
            'konteks keresahan terhadap kebijakan.'
        ),
        'bps_keys': ['tpt_2024', 'tpt_2025', 'pdrb_2024', 'pdrb_2025']
    },
    'Sentimen Bangsa': {
        'label': 'Kondisi Ekonomi Makro & Ketenagakerjaan Nasional',
        'insight': (
            'Ekspresi kekecewaan terhadap kondisi Indonesia secara umum '
            '(#IndonesiaGelap, negara sakit, krisis) divalidasi dengan '
            'data makro ketenagakerjaan nasional: TPT, angkatan kerja, '
            'dan distribusi lapangan pekerjaan sebagai cerminan kondisi '
            'sosial-ekonomi yang memicu keresahan kolektif.'
        ),
        'bps_keys': ['tpt_2025', 'angkatan_kerja_2025', 'lapangan_kerja_2025']
    },
    'Lainnya': {
        'label': 'Data Umum Ketenagakerjaan',
        'insight': (
            'Topik-topik dengan konteks campuran atau noise tinggi. '
            'Data TPT nasional disertakan sebagai referensi umum '
            'kondisi ketenagakerjaan Indonesia.'
        ),
        'bps_keys': ['tpt_2025']
    }
}

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

    bps_data = load_all_bps_data()
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
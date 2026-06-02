import pandas as pd
import ast

df_topics    = pd.read_csv('data/data_with_topics_v2.csv')
df_sentiment = pd.read_csv('data/sentiment_results.csv')
df_bertopic  = pd.read_csv('data/bertopic_info_v2.csv')

print(f"  data_with_topics_v2 : {len(df_topics)} baris")
print(f"  sentiment_results   : {len(df_sentiment)} baris")
print(f"  bertopic_info_v2    : {len(df_bertopic)} topik")


df_merged = df_topics.merge(
    df_sentiment[['clean_text', 'sentiment', 'confidence']],
    on='clean_text',
    how='left'
)

# Hapus noise
df_clean = df_merged[df_merged['topic_id_v2'] != -1].copy()
noise    = df_merged[df_merged['topic_id_v2'] == -1]

print(f"Total setelah merge: {len(df_merged)}")
print(f"Noise (topic -1): {len(noise)}")
print(f"Data valid: {len(df_clean)}")

# Simpan data lengkap per komentar
df_clean.to_csv('data/merged_topic_sentiment.csv', index=False)


dist = df_clean.groupby(
    ['topic_id_v2', 'sentiment']
).size().unstack(fill_value=0)

for col in ['positif', 'netral', 'negatif']:
    if col not in dist.columns:
        dist[col] = 0

dist = dist.reset_index()
dist['total'] = dist['positif'] + dist['netral'] + dist['negatif']

dist['pct_negatif'] = (dist['negatif'] / dist['total'] * 100).round(1)
dist['pct_positif'] = (dist['positif'] / dist['total'] * 100).round(1)
dist['pct_netral']  = (dist['netral']  / dist['total'] * 100).round(1)
dist['dominant_sentiment'] = dist[['positif', 'netral', 'negatif']].idxmax(axis=1)

# Parse keywords
def parse_keywords(rep_str):
    try:
        kw = ast.literal_eval(rep_str)
        return ', '.join(kw[:6])
    except:
        return str(rep_str)

def clean_topic_name(name_str):
    parts = str(name_str).split('_')
    if parts[0].lstrip('-').isdigit():
        parts = parts[1:]
    return ' '.join(parts).title()

df_bertopic['keywords_clean'] = df_bertopic['Representation'].apply(parse_keywords)
df_bertopic['topic_label']    = df_bertopic['Name'].apply(clean_topic_name)

result = dist.merge(
    df_bertopic[['Topic', 'topic_label', 'keywords_clean']],
    left_on='topic_id_v2',
    right_on='Topic',
    how='left'
).drop(columns=['Topic'])

result = result.sort_values('total', ascending=False).reset_index(drop=True)
result['rank'] = result.index + 1


BPS_MAPPING = {
    # Ketenagakerjaan
    'kerja':        'Ketenagakerjaan',
    'kerjaan':      'Ketenagakerjaan',
    'pengangguran': 'Ketenagakerjaan',
    'loker':        'Ketenagakerjaan',
    'lowongan':     'Ketenagakerjaan',
    'nganggur':     'Ketenagakerjaan',
    'lulus':        'Ketenagakerjaan',
    'fresh':        'Ketenagakerjaan',
    'interview':    'Ketenagakerjaan',
    'rekrut':       'Ketenagakerjaan',
    'umur':         'Ketenagakerjaan',
    'usia':         'Ketenagakerjaan',
    # Upah & Gaji
    'gaji':         'Upah & Kesejahteraan',
    'gajinya':      'Upah & Kesejahteraan',
    'gaji jt':      'Upah & Kesejahteraan',
    'umr':          'Upah & Kesejahteraan',
    'upah':         'Upah & Kesejahteraan',
    'salary':       'Upah & Kesejahteraan',
    'sejahtera':    'Upah & Kesejahteraan',
    'duit':         'Upah & Kesejahteraan',
    'uang':         'Upah & Kesejahteraan',
    # Pendidikan
    'kuliah':       'Pendidikan',
    'kampus':       'Pendidikan',
    'mahasiswa':    'Pendidikan',
    'beasiswa':     'Pendidikan',
    'sekolah':      'Pendidikan',
    'ijasah':       'Pendidikan',
    'wisuda':       'Pendidikan',
    # Migrasi Luar Negeri
    'jepang':       'Migrasi & Ketenagakerjaan LN',
    'jerman':       'Migrasi & Ketenagakerjaan LN',
    'eropa':        'Migrasi & Ketenagakerjaan LN',
    'ausbildung':   'Migrasi & Ketenagakerjaan LN',
    'lpk':          'Migrasi & Ketenagakerjaan LN',
    'singapore':    'Migrasi & Ketenagakerjaan LN',
    'singapura':    'Migrasi & Ketenagakerjaan LN',
    'malaysia':     'Migrasi & Ketenagakerjaan LN',
    'korea':        'Migrasi & Ketenagakerjaan LN',
    'negeri':       'Migrasi & Ketenagakerjaan LN',
    'pindah':       'Migrasi & Ketenagakerjaan LN',
    # Kebijakan Pemerintah
    'pemerintah':   'Kebijakan Pemerintah',
    'pajak':        'Kebijakan Pemerintah',
    'korupsi':      'Kebijakan Pemerintah',
    'politik':      'Kebijakan Pemerintah',
    'demo':         'Kebijakan Pemerintah',
    'percaya':      'Kebijakan Pemerintah',
    'nasionalis':   'Kebijakan Pemerintah',
    'nasionalisme': 'Kebijakan Pemerintah',
    'prabowo':      'Kebijakan Pemerintah',
}

def map_bps(keywords_str):
    if not isinstance(keywords_str, str):
        return 'Lainnya'
    kw_lower = keywords_str.lower()
    for kw, cat in BPS_MAPPING.items():
        if kw in kw_lower:
            return cat
    return 'Lainnya'

result['bps_category'] = result['keywords_clean'].apply(map_bps)

# Simpan
result.to_csv('data/topic_sentiment_bps.csv', index=False)

print(f"\nTop 15 Topik (by volume):")
print(result[[
    'rank', 'topic_id_v2', 'topic_label', 'total',
    'dominant_sentiment', 'pct_negatif', 'bps_category'
]].head(15).to_string())

print(f"\nDistribusi kategori BPS:")
print(result['bps_category'].value_counts().to_string())

print(f"\nDominasi sentimen:")
print(result['dominant_sentiment'].value_counts().to_string())

print("  - data/merged_topic_sentiment.csv → data lengkap per komentar")
print("  - data/topic_sentiment_bps.csv    → ringkasan per topik + BPS")
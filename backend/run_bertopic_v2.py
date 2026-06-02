import pandas as pd
from bertopic import BERTopic
from umap import UMAP
from hdbscan import HDBSCAN
from sklearn.feature_extraction.text import CountVectorizer
from sentence_transformers import SentenceTransformer

df = pd.read_csv('data/cleaned_data.csv')
docs = df['clean_text'].astype(str).tolist()
print(f"  Total dokumen: {len(docs)}")

with open('data/combined_stop_words.txt', 'r', encoding='utf-8') as f:
    stopwords_id = [line.strip() for line in f if line.strip()]

extra_stopwords = [
    'kaburajadulu', 'kabur', 'dulu', 'aja', 'yg', 'ya', 'ga',
    'gak', 'nggak', 'si', 'lo', 'gw', 'lu', 'bang', 'kak',
    'deh', 'sih', 'nih', 'lah', 'dong', 'kan', 'kalo', 'udah',
    'udh', 'kayak', 'kayaknya', 'mah', 'wkwk', 'wkwkwk', 'haha',
    'hehe', 'btw', 'fyi', 'dll', 'dsb', 'yuk', 'nih', 'tuh'
]

all_stopwords = list(set(stopwords_id + extra_stopwords))
print(f"  Total stopwords: {len(all_stopwords)}")


embedding_model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

umap_model = UMAP(
    n_neighbors=15,
    n_components=5,
    min_dist=0.0,
    metric='cosine',
    random_state=42
)

hdbscan_model = HDBSCAN(
    min_cluster_size=30,
    min_samples=10,
    metric='euclidean',
    cluster_selection_method='eom',
    prediction_data=True
)

vectorizer_model = CountVectorizer(
    stop_words=all_stopwords,
    min_df=5,
    ngram_range=(1, 2)
)

topic_model = BERTopic(
    embedding_model=embedding_model,
    umap_model=umap_model,
    hdbscan_model=hdbscan_model,
    vectorizer_model=vectorizer_model,
    top_n_words=10,
    verbose=True
)

topics, probs = topic_model.fit_transform(docs)
df['topic_id_v2'] = topics

topic_info = topic_model.get_topic_info()
topic_info.to_csv('data/bertopic_info_v2.csv', index=False)
df.to_csv('data/data_with_topics_v2.csv', index=False)

total_topics = len(topic_info[topic_info['Topic'] != -1])
noise_count  = len(df[df['topic_id_v2'] == -1])
valid_count  = len(df[df['topic_id_v2'] != -1])

print(f"\nJumlah topik    : {total_topics}")
print(f"Data noise (-1) : {noise_count} ({noise_count/len(df)*100:.1f}%)")
print(f"Data valid      : {valid_count} ({valid_count/len(df)*100:.1f}%)")

print(f"\nTop 20 Topik:")
print(topic_info[['Topic', 'Count', 'Name']].head(21).to_string())

print("\n" + "=" * 60)
print("PERBANDINGAN V1 vs V2")
print("=" * 60)
try:
    df_v1    = pd.read_csv('data/bertopic_info_results.csv')
    df_v1_dt = pd.read_csv('data/data_with_topics.csv')

    total_v1 = len(df_v1[df_v1['Topic'] != -1])
    noise_v1 = len(df_v1_dt[df_v1_dt['topic_id'] == -1])
    valid_v1 = len(df_v1_dt[df_v1_dt['topic_id'] != -1])

    print(f"\n{'Metric':<25} {'V1 (kamu)':<15} {'V2 (validasi)':<15}")
    print("-" * 55)
    print(f"{'Jumlah topik':<25} {total_v1:<15} {total_topics:<15}")
    print(f"{'Data noise':<25} {noise_v1:<15} {noise_count:<15}")
    print(f"{'Data valid':<25} {valid_v1:<15} {valid_count:<15}")
    print(f"{'Stopwords':<25} {'tidak ada':<15} {len(all_stopwords):<15}")
    print(f"{'min_cluster_size':<25} {'20':<15} {'30':<15}")
    print(f"{'ngram_range':<25} {'(1,1)':<15} {'(1,2)':<15}")
except Exception as e:
    print(f"Tidak bisa bandingkan V1: {e}")

print(f"\n✅ File tersimpan:")
print("  - data/bertopic_info_v2.csv     → info topik V2")
print("  - data/data_with_topics_v2.csv  → data dengan topic_id_v2")
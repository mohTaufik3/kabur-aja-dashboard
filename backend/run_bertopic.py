import pandas as pd
from bertopic import BERTopic
from umap import UMAP
from hdbscan import HDBSCAN
from sklearn.feature_extraction.text import CountVectorizer

print("1. Memuat data cleaned_data.csv...")
# Muat data hasil preprocessing Anda
df = pd.read_csv('data/cleaned_data.csv')

# Pastikan kolom teks Anda diubah menjadi string dan tangani nilai kosong (NaN)
docs = df['full_text'].astype(str).tolist()

print("2. Mengonfigurasi komponen BERTopic (Mode Ringan untuk CPU)...")
# Menggunakan UMAP dengan random_state agar hasilnya konsisten dan cepat di CPU
umap_model = UMAP(n_neighbors=15, n_components=5, min_dist=0.0, metric='cosine', random_state=42)

# Menggunakan HDBSCAN untuk clustering otomatis tanpa menentukan jumlah cluster secara manual
hdbscan_model = HDBSCAN(min_cluster_size=20, metric='euclidean', cluster_selection_method='eom', prediction_data=True)

# Menghilangkan kata-kata umum (stopwards) bahasa Indonesia agar topik lebih bermakna
vectorizer_model = CountVectorizer(stop_words=None) # Anda bisa memasukkan list stopword jika diperlukan

# Inisialisasi BERTopic dengan model embedding bahasa universal/multilingual (ringan)
topic_model = BERTopic(
    embedding_model="paraphrase-multilingual-MiniLM-L12-v2", # Sangat bagus untuk bahasa Indonesia informal
    umap_model=umap_model,
    hdbscan_model=hdbscan_model,
    vectorizer_model=vectorizer_model,
    verbose=True
)

print("3. Melakukan proses Fitting BERTopic pada 18.964 data...")
# Proses mengekstrak topik dan mendapatkan ID topik untuk setiap dokumen
topics, probs = topic_model.fit_transform(docs)

# Masukkan hasil topik ke dalam dataframe asli Anda
df['topic_id'] = topics

print("4. Menyimpan hasil pemodelan topik...")
# Ambil informasi detail mengenai kata kunci (keywords) dari setiap kluster topik
topic_info = topic_model.get_topic_info()
topic_info.to_csv('data/bertopic_info_results.csv', index=False)

# Simpan data komentar yang kini sudah memiliki label kluster topik
df.to_csv('data/data_with_topics.csv', index=False)

print("🚀 Selesai! File 'bertopic_info_results.csv' dan 'data_with_topics.csv' berhasil dibuat di folder data.")
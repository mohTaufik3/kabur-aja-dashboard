# KaburAjaDulu Sentiment Dashboard

Dashboard analisis sentimen dan identifikasi faktor sosial-ekonomi di balik fenomena #KaburAjaDulu menggunakan pendekatan Natural Language Processing.

## Tentang Project

Project ini merupakan Tugas Akhir Program Studi Teknik Informatika Universitas Widyatama.

- **Nama**: Mohammad Taufik Hidayatuloh
- **NPM**: 40622100047
- **Konsentrasi**: Database

## Latar Belakang

Fenomena **#KaburAjaDulu** mencerminkan kecenderungan masyarakat, khususnya generasi muda, untuk meninggalkan Indonesia dengan berbagai alasan sosial dan ekonomi. Project ini bertujuan untuk menganalisis sentimen publik serta mengidentifikasi topik utama yang mendasari fenomena tersebut berdasarkan data dari media sosial.

## Metodologi

Project ini menggunakan framework **CRISP-DM** dengan dua pendekatan utama:
Model => Fungsi
IndoBERT => Klasifikasi sentimen (positif, netral, negatif)
BERTopic => Pemodelan topik isu sosial-ekonomi
Data dikumpulkan dari platform **X (Twitter)** dan **TikTok** dengan total 22.095 komentar. Analisis divalidasi menggunakan data sekunder dari Badan Pusat Statistik (BPS).

## Tech Stack

### Frontend:

- React 19 + Vite
- Tailwind CSS v4
- Recharts (visualisasi data)
- React Router DOM
- Lucide React

### Backend (dalam pengembangan):

- FastAPI (Python)
- HuggingFace Transformers (IndoBERT)
- BERTopic

## Cara Menjalankan Project

### Clone repository

git clone https://github.com/mohTaufik3/kabur-aja-dashboard.git

### Masuk ke folder project

cd kabur-aja-dashboard

### Install dependencies

npm install

### Jalankan development server

npm run dev

### Akses aplikasi melalui:

http://localhost:5173

## Fitur

- Dashboard overview (statistik utama, distribusi sentimen, topik dominan)
- Analisis sentimen dengan visualisasi interaktif (dalam pengembangan)
- Topic explorer berbasis BERTopic (dalam pengembangan)
- Perbandingan dengan data BPS (dalam pengembangan)
- Integrasi backend FastAPI (dalam pengembangan)
- Integrasi model IndoBERT dan BERTopic (dalam pengembangan)

## Status Project

Project ini masih dalam tahap pengembangan aktif, khususnya pada bagian backend dan integrasi model machine learning.

## Lisensi

Project ini dibuat untuk keperluan akademik di Universitas Widyatama tahun 2026.

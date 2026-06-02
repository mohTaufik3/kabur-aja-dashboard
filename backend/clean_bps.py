import pandas as pd
import os

OUTPUT_DIR = 'data/bps/clean_bps'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_csv(path):
    try:
        return pd.read_csv(path, encoding='utf-8')
    except:
        return pd.read_csv(path, encoding='latin1')

# 1. RATA-RATA UPAH/GAJI (2024 & 2025)
print("\n[1/5] Memproses Data Rata-Rata Upah/Gaji...")
for year in [2024, 2025]:
    df = load_csv(f'data/bps/Rata-Rata Gaji/Rata-Rata Upah_Gaji, {year}.csv')
    df_clean = df.iloc[3:].copy()
    df_clean.columns = ['Sektor_Ekonomi', 'Februari', 'Agustus', 'Tahunan']
    df_clean = df_clean.dropna(subset=['Sektor_Ekonomi'])
    for col in ['Februari', 'Agustus', 'Tahunan']:
        df_clean[col] = pd.to_numeric(df_clean[col].astype(str).str.replace(',', '').str.strip(), errors='coerce')
    df_clean.to_csv(f'{OUTPUT_DIR}/gaji_{year}.csv', index=False)

# 2. TPT PROVINSI (2024 & 2025)
for year in [2024, 2025]:
    df = load_csv(f'data/bps/TPT - Provinsi/Tingkat Pengangguran Terbuka Menurut Provinsi, {year}.csv')
    df_clean = df.iloc[3:].copy()
    df_clean.columns = ['Provinsi', 'Februari', 'Agustus', 'Tahunan']
    df_clean = df_clean.dropna(subset=['Provinsi'])
    for col in ['Februari', 'Agustus', 'Tahunan']:
        df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
    df_clean.to_csv(f'{OUTPUT_DIR}/tpt_{year}.csv', index=False)

# 3. ANGKATAN KERJA & BAK BERDASARKAN UMUR (2024 & 2025)
for year in [2024, 2025]:
    df_ak = load_csv(f'data/bps/Angkatan Kerja - Golongan Umur/Angkatan Kerja (AK) Menurut Golongan Umur, {year}.csv')
    df_ak_clean = df_ak.iloc[3:].copy()
    df_ak_clean.columns = ['Golongan_Umur', 'Bekerja', 'Unnamed_1', 'Unnamed_2', 'Pengangguran', 'Unnamed_4', 'Unnamed_5', 'Total_AK', 'Unnamed_7', 'Unnamed_8', 'Persen_Bekerja', 'Unnamed_10', 'Unnamed_11']
    df_ak_clean = df_ak_clean[['Golongan_Umur', 'Bekerja', 'Pengangguran', 'Total_AK', 'Persen_Bekerja']].dropna(subset=['Golongan_Umur'])
    df_ak_clean.to_csv(f'{OUTPUT_DIR}/angkatan_kerja_umur_{year}.csv', index=False)

    # Bukan Angkatan Kerja menurut Umur (BAK)
    df_bak = load_csv(f'data/bps/BAK-UMUR/Bukan Angkatan Kerja (BAK) Menurut Golongan Umur, {year}.csv')
    df_bak_clean = df_bak.iloc[3:].copy()
    df_bak_clean.columns = ['Golongan_Umur', 'Sekolah', 'Unnamed_1', 'Unnamed_2', 'Urus_Rumah_Tangga', 'Unnamed_4', 'Unnamed_5', 'Lainnya', 'Unnamed_7', 'Unnamed_8', 'Total_BAK', 'Unnamed_10', 'Unnamed_11']
    df_bak_clean = df_bak_clean[['Golongan_Umur', 'Sekolah', 'Urus_Rumah_Tangga', 'Lainnya', 'Total_BAK']].dropna(subset=['Golongan_Umur'])
    df_bak_clean.to_csv(f'{OUTPUT_DIR}/bukan_angkatan_kerja_umur_{year}.csv', index=False)

# 4. POPULASI 15 TAHUN KE ATAS & PEKERJAAN UTAMA
for year in [2024, 2025]:
    df_p15 = load_csv(f'data/bps/Jumlah Penduduk/Jumlah Penduduk Usia 15 tahun ke Atas Menurut Golongan Umur, {year}.csv')
    df_p15_clean = df_p15.iloc[3:].copy()
    df_p15_clean.columns = ['Golongan_Umur', 'Februari', 'Agustus', 'Tahunan']
    df_p15_clean = df_p15_clean.dropna(subset=['Golongan_Umur'])
    df_p15_clean.to_csv(f'{OUTPUT_DIR}/penduduk_15_keatas_{year}.csv', index=False)

    df_lpu = load_csv(f'data/bps/Jumlah Penduduk/Penduduk 15 Tahun Ke Atas yang Bekerja menurut Lapangan Pekerjaan Utama, {year}.csv')
    df_lpu_clean = df_lpu.iloc[3:].copy()
    df_lpu_clean.columns = ['Lapangan_Pekerjaan', 'Februari', 'Agustus']
    df_lpu_clean = df_lpu_clean.dropna(subset=['Lapangan_Pekerjaan'])
    df_lpu_clean.to_csv(f'{OUTPUT_DIR}/lapangan_pekerjaan_utama_{year}.csv', index=False)

# 5. CLEANING PDRB DAERAH KABUPATEN / KOTA
print("\n[5/5] Memproses Data PDRB Triwulanan Kabupaten/Kota...")
for year in [2024, 2025]:
    df_pdrb = load_csv(f'data/bps/PDRB/PDRB Triwulanan Atas Dasar Harga Konstan (2010=100) Menurut Lapangan Usaha di Kabupaten_Kota Seluruh Indonesia, {year}.csv')
    df_pdrb_clean = df_pdrb.iloc[3:].copy()
    df_pdrb_clean.columns = ['Kabupaten_Kota'] + [f'Sektor_{i}' for i in range(1, df_pdrb.shape[1])]
    df_pdrb_clean = df_pdrb_clean.dropna(subset=['Kabupaten_Kota'])
    df_pdrb_clean.to_csv(f'{OUTPUT_DIR}/pdrb_wilayah_{year}.csv', index=False)

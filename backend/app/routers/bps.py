from fastapi import APIRouter, HTTPException
import pandas as pd
import math
import os

router = APIRouter(prefix="/api/bps", tags=["BPS Data"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESEARCH_DATA = os.path.join(BASE_DIR, "../../../research/data")
CLEAN_BPS = os.path.join(RESEARCH_DATA, "output/clean_bps")

KBLI_MAPPING = {
    'A': 'Pertanian, Kehutanan, Perikanan',
    'B': 'Pertambangan & Penggalian',
    'C': 'Industri Pengolahan (Manufaktur)',
    'D': 'Pengadaan Listrik & Gas',
    'E': 'Pengadaan Air & Kelola Sampah',
    'F': 'Konstruksi',
    'G': 'Perdagangan Besar/Eceran & Reparasi',
    'H': 'Pengangkutan & Pergudangan',
    'I': 'Penyediaan Akomodasi & Kuliner',
    'J': 'Informasi & Komunikasi (IT/Digital)',
    'K': 'Aktivitas Keuangan & Asuransi',
    'L': 'Real Estat',
    'M, N': 'Aktivitas Profesional & Penyewaan',
    'O': 'Administrasi Pemerintahan & Hankam',
    'P': 'Jasa Pendidikan',
    'Q': 'Aktivitas Kesehatan & Sosial',
    'R, S, T, U': 'Jasa Lainnya (Kesenian/Hiburan/RT)'
}

def clean_records_for_json(records):
    for record in records:
        for key, value in record.items():
            if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
                record[key] = None
    return records

@router.get("/gaji")
def get_bps_gaji(year: int = 2025):
    path = os.path.join(CLEAN_BPS, f"gaji_{year}.csv")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Data upah tahun {year} tidak ditemukan.")
    df = pd.read_csv(path)
    df['Sektor_Lengkap'] = df['Sektor_Ekonomi'].apply(lambda x: KBLI_MAPPING.get(str(x).strip(), x))
    return clean_records_for_json(df.to_dict(orient="records"))

@router.get("/tpt")
def get_bps_tpt(year: int = 2025):
    path = os.path.join(CLEAN_BPS, f"tpt_{year}.csv")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Data TPT tahun {year} tidak ditemukan.")
    df = pd.read_csv(path)
    if df['Februari'].dtype == 'object':
        df['Februari'] = df['Februari'].str.replace('%', '', regex=False).str.strip()
    if df['Agustus'].dtype == 'object':
        df['Agustus'] = df['Agustus'].str.replace('%', '', regex=False).str.strip()
    df['Februari'] = pd.to_numeric(df['Februari'], errors='coerce').fillna(0)
    df['Agustus'] = pd.to_numeric(df['Agustus'], errors='coerce').fillna(0)
    df_top10 = df.sort_values(by='Agustus', ascending=False).head(10)
    return clean_records_for_json(df_top10.to_dict(orient="records"))

@router.get("/angkatan-kerja-umur")
def get_angkatan_kerja_umur(year: int = 2025):
    path = os.path.join(CLEAN_BPS, f"angkatan_kerja_umur_{year}.csv")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Data angkatan kerja umur tahun {year} tidak ditemukan.")
    df = pd.read_csv(path)
    return clean_records_for_json(df.to_dict(orient="records"))

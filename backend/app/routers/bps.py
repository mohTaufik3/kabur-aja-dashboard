from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter(prefix="/api/bps", tags=["BPS Data"])

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

@router.get("/gaji")
def get_bps_gaji(year: int = 2025):
    path = f"data/bps/clean_bps/gaji_{year}.csv"
    if not os.path.exists(path):
        raise HTTPException(
            status_code=404, 
            detail=f"Data upah tahun {year} tidak ditemukan. Pastikan sudah menjalankan clean_bps.py"
        )
    
    df = pd.read_csv(path)
    
    df['Sektor_Lengkap'] = df['Sektor_Ekonomi'].apply(lambda x: KBLI_MAPPING.get(str(x).strip(), x))
    
    df = df.where(pd.notnull(df), None)
    
    return df.to_dict(orient="records")

@router.get("/tpt")
def get_bps_tpt(year: int = 2025):
    path = f"data/bps/clean_bps/tpt_{year}.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Data TPT tahun {year} tidak ditemukan.")
    
    df = pd.read_csv(path)
    
    df_top10 = df.sort_values(by='Tahunan', ascending=False).head(10)
    df_top10 = df_top10.where(pd.notnull(df_top10), None)
    
    return df_top10.to_dict(orient="records")

@router.get("/angkatan-kerja-umur")
def get_angkatan_kerja_umur(year: int = 2025):
    path = f"data/bps/clean_bps/angkatan_kerja_umur_{year}.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Data angkatan kerja umur tahun {year} tidak ditemukan.")
    
    df = pd.read_csv(path)
    df = df.where(pd.notnull(df), None)
    
    return df.to_dict(orient="records")
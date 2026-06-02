import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import BpsGajiChart from '../components/organisms/BpsGajiChart';
import BpsUmurChart from '../components/organisms/BpsUmurChart';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function BpsPage() {
  const [dataGaji, setDataGaji] = useState([]);
  const [dataTpt, setDataTpt] = useState([]);
  const [dataUmur, setDataUmur] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/bps/gaji?year=2025').then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data gaji');
        return res.json();
      }),
      fetch('http://127.0.0.1:8000/api/bps/tpt?year=2025').then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data TPT');
        return res.json();
      }),
      fetch('http://127.0.0.1:8000/api/bps/angkatan-kerja-umur?year=2025').then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data umur');
        return res.json();
      }),
    ])
      .then(([gajiRes, tptRes, umurRes]) => {
        setDataGaji(gajiRes);
        setDataTpt(tptRes);
        setDataUmur(umurRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal memuat data dari server backend FastAPI.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-sm text-gray-500 font-medium">Memuat data BPS...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">{error}</div>;
  }

  return (
    <div>
      <SectionTitle title="Validasi Data BPS" subtitle="Korelasi antara narasi digital #KaburAjaDulu dengan kondisi sosial-ekonomi aktual" />

      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <ExternalLink size={14} className="text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-700">Sumber Data Sekunder</p>
          <p className="text-xs text-blue-500 mt-0.5">Data diperoleh dari berkas resmi Badan Pusat Statistik (BPS) periode 2025 yang telah diintegrasikan dengan sistem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs text-gray-400 mb-1">Rata-Rata Upah Nasional (Agustus 2025)</p>
          <p className="text-2xl font-bold text-blue-600">Rp3.331.012</p>
          <p className="text-xs text-gray-400 mt-1">Sektor J (IT) Tertinggi, Sektor R-U Terendah</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 mb-1">TPT Tertinggi Tingkat Provinsi (2025)</p>
          <p className="text-2xl font-bold text-red-600">{dataTpt.length > 0 ? `${dataTpt[0].Agustus}%` : '-'}</p>
          <p className="text-xs text-gray-400 mt-1">Provinsi {dataTpt.length > 0 ? dataTpt[0].Provinsi : '-'}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-400 mb-1">Pengangguran Usia Muda (15-19 Tahun)</p>
          <p className="text-2xl font-bold text-amber-600">{dataUmur.length > 0 ? `${(dataUmur[0].Pengangguran / 1000).toFixed(0)}K jiwa` : '-'}</p>
          <p className="text-xs text-gray-400 mt-1">Kelompok rentan angkatan kerja baru</p>
        </Card>
      </div>

      <BpsGajiChart data={dataGaji} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Top 10 Provinsi dengan Pengangguran Tertinggi</h2>
          <p className="text-xs text-gray-400 mb-4">Tingkat Pengangguran Terbuka (%) Berdasarkan Rata-Rata Tahunan 2025</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataTpt} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 10]} tickFormatter={(v) => `${v}%`} />

              <YAxis type="category" dataKey="Provinsi" tick={{ fontSize: 9 }} width={110} reversed={true} />

              <Tooltip formatter={(v) => `${v}%`} />

              <Bar dataKey="Agustus" name="Tingkat Pengangguran (%)" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <BpsUmurChart data={dataUmur} />
      </div>
    </div>
  );
}

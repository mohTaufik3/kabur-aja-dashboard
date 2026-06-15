import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import SectionTitle from '../components/atoms/SectionTitle';
import BpsSumberInfo from '../components/molecules/BpsSumberInfo';
import BpsStatCard from '../components/molecules/BpsStatCard';
import BpsGajiChart from '../components/organisms/BpsGajiChart';
import BpsTptChart from '../components/organisms/BpsTptChart';
import BpsUmurChart from '../components/organisms/BpsUmurChart';
import TopicBpsAccordion from '../components/organisms/TopicBpsAccordion';

export default function BpsPage() {
  const [dataGaji, setDataGaji] = useState([]);
  const [dataTpt, setDataTpt] = useState([]);
  const [dataUmur, setDataUmur] = useState([]);
  const [topicsWithBps, setTopicsWithBps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const base = 'http://127.0.0.1:8000';
    Promise.all([
      fetch(`${base}/api/bps/gaji?year=2025`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
      fetch(`${base}/api/bps/tpt?year=2025`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
      fetch(`${base}/api/bps/angkatan-kerja-umur?year=2025`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
      fetch(`${base}/api/topics/with-bps`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      }),
    ])
      .then(([gajiRes, tptRes, umurRes, topicsRes]) => {
        setDataGaji(gajiRes);
        setDataTpt(tptRes);
        setDataUmur(umurRes);
        setTopicsWithBps(topicsRes);
        setLoading(false);
      })
      .catch(() => {
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

      <BpsSumberInfo />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <BpsStatCard label="Rata-Rata Upah Nasional (Agustus 2025)" value="Rp3.331.012" note="Sektor J (IT) Tertinggi, Sektor R-U Terendah" />
        <BpsStatCard label="TPT Tertinggi Tingkat Provinsi (2025)" value={dataTpt.length > 0 ? `${dataTpt[0].Agustus}%` : '-'} note={`Provinsi ${dataTpt.length > 0 ? dataTpt[0].Provinsi : '-'}`} valueClass="text-red-600" />
        <BpsStatCard label="Pengangguran Usia Muda (15-19 Tahun)" value={dataUmur.length > 0 ? `${(dataUmur[0].Pengangguran / 1000).toFixed(0)}K jiwa` : '-'} note="Kelompok rentan angkatan kerja baru" valueClass="text-amber-600" />
      </div>

      <BpsGajiChart data={dataGaji} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BpsTptChart data={dataTpt} />
        <BpsUmurChart data={dataUmur} />
      </div>

      <TopicBpsAccordion topics={topicsWithBps} />
    </div>
  );
}

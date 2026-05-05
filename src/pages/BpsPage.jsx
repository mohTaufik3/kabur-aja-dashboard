import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import { bpsKetenagakerjaan, bpsGajiProvinsi, bpsKorelasiSentimen } from '../data/mockData';
import { ExternalLink } from 'lucide-react';

const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export default function BpsPage() {
  return (
    <div>
      <SectionTitle title="Validasi Data BPS" subtitle="Korelasi antara narasi digital #KaburAjaDulu dengan kondisi sosial-ekonomi aktual" />

      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <ExternalLink size={14} className="text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-700">Sumber Data Sekunder</p>
          <p className="text-xs text-blue-500 mt-0.5">Data diperoleh dari laporan resmi Badan Pusat Statistik (BPS) periode 2024–2025, mencakup data ketenagakerjaan, angkatan kerja, dan rata-rata gaji per provinsi.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Tingkat Pengangguran (Feb 25)', value: '6,53%', sub: 'Turun dari 7,20% (Feb 24)', color: 'text-emerald-600' },
          { label: 'Tingkat Partisipasi Angkatan Kerja', value: '70,12%', sub: 'Naik dari 69,20% (Feb 24)', color: 'text-blue-600' },
          { label: 'Setengah Penganggur (Feb 25)', value: '9,87%', sub: 'Turun dari 10,43% (Feb 24)', color: 'text-amber-600' },
        ].map((item, i) => (
          <Card key={i}>
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-1">Tren Ketenagakerjaan</h2>
        <p className="text-xs text-gray-400 mb-4">Tingkat pengangguran & partisipasi angkatan kerja 2024–2025 (%)</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={bpsKetenagakerjaan}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="periode" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[60, 75]} tickFormatter={(v) => `${v}%`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[5, 12]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="partisipasi" name="Partisipasi (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
            <Line yAxisId="right" type="monotone" dataKey="pengangguran" name="Pengangguran (%)" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} />
            <Line yAxisId="right" type="monotone" dataKey="setengahPenganggur" name="Setengah Penganggur (%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Rata-rata Gaji per Provinsi</h2>
          <p className="text-xs text-gray-400 mb-4">Data BPS 2024 (dalam Rupiah)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bpsGajiProvinsi} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
              <YAxis type="category" dataKey="provinsi" tick={{ fontSize: 10 }} width={100} />
              <Tooltip formatter={(v) => formatRupiah(v)} />
              <Bar dataKey="rataGaji" name="Rata-rata Gaji" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Korelasi Sentimen & Pengangguran</h2>
          <p className="text-xs text-gray-400 mb-4">Perbandingan tren sentimen negatif vs tingkat pengangguran</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bpsKorelasiSentimen}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="periode" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sentimenNegatif" name="Sentimen Negatif (%)" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="pengangguran" name="Pengangguran (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-medium text-amber-700">💡 Insight</p>
            <p className="text-xs text-amber-600 mt-1">
              Meski tingkat pengangguran menurun, sentimen negatif justru meningkat — mengindikasikan bahwa keresahan publik tidak semata-mata dipengaruhi angka pengangguran, melainkan faktor lain seperti kualitas pekerjaan dan kesenjangan
              gaji.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

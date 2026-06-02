import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../atoms/Card';

export default function BpsUmurChart({ data }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-700 mb-1">Struktur Angkatan Kerja Berdasarkan Kelompok Usia</h2>
      <p className="text-xs text-gray-400 mb-4">Distribusi status bekerja dan pengangguran per kategori usia angkatan kerja</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data.filter((item) => item.Golongan_Umur !== 'Total')}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="Golongan_Umur" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip formatter={(v) => `${Number(v).toLocaleString('id-ID')} Jiwa`} />
          <Legend />
          <Line type="monotone" dataKey="Bekerja" name="Jumlah Bekerja" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="Pengangguran" name="Jumlah Pengangguran" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-xs font-medium text-amber-700">Insight Analisis</p>
        <p className="text-xs text-amber-600 mt-1">Data struktur umur dari BPS digunakan untuk memvalidasi relevansi distribusi kluster topik mengenai batas usia maksimal rekrutmen tenaga kerja yang marak di media sosial.</p>
      </div>
    </Card>
  );
}

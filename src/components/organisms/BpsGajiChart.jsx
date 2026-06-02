import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../atoms/Card';

const formatRupiah = (value) => {
  if (!value) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function BpsGajiChart({ data }) {
  return (
    <Card className="mb-6">
      <h2 className="text-base font-semibold text-gray-700 mb-1">Rata-rata Gaji per Sektor Lapangan Usaha</h2>
      <p className="text-xs text-gray-400 mb-4">Perbandingan upah riil BPS periode Februari vs Agustus 2025</p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="Sektor_Ekonomi" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
          <Tooltip formatter={(v) => formatRupiah(v)} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Februari" name="Upah Februari 2025" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Agustus" name="Upah Agustus 2025" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../atoms/Card';

export default function BpsTptChart({ data }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-700 mb-1">Top 10 Provinsi dengan Pengangguran Tertinggi</h2>
      <p className="text-xs text-gray-400 mb-4">Tingkat Pengangguran Terbuka (%) Berdasarkan Rata-Rata Tahunan 2025</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 10]} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="Provinsi" tick={{ fontSize: 9 }} width={110} reversed={true} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="Agustus" name="Tingkat Pengangguran (%)" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

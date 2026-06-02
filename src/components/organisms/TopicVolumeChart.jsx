import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../atoms/Card';

export default function TopicVolumeChart({ data }) {
  const chartData = data.slice(0, 6).map((t) => {
    // Membaca kolom 'topic_label' dari backend v2 Anda
    let topicLabel = t.topic_label || `Topik ${t.topic_id_v2 ?? ''}`;

    if (typeof topicLabel === 'string') {
      const words = topicLabel.split(' ');
      if (words.length > 2) {
        topicLabel = words.slice(0, 2).join(' ');
      }
    }

    return {
      name: topicLabel,
      jumlah: t.total || 0,
    };
  });

  return (
    <Card className="mb-6">
      <h2 className="text-base font-semibold text-gray-700 mb-1">Volume Topik</h2>
      <p className="text-xs text-gray-400 mb-4">Jumlah komentar per cluster topik (top 6)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} reversed={true} />
          <Tooltip formatter={(v) => [v.toLocaleString('id-ID'), 'Komentar']} />
          <Bar dataKey="jumlah" name="Jumlah" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

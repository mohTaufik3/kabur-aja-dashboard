import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import { topicData } from '../data/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TopicPage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('Semua');

  const filterOptions = ['Semua', 'Negatif', 'Campuran', 'Positif'];

  const filtered = filter === 'Semua' ? topicData : topicData.filter((t) => t.sentiment === filter.toLowerCase());

  const chartData = topicData.slice(0, 6).map((t) => ({ name: t.topic.split(' ')[0], jumlah: t.count }));

  return (
    <div>
      <SectionTitle title="Pemodelan Topik" subtitle="Identifikasi isu sosial-ekonomi dominan menggunakan BERTopic" />

      {/* Bar Chart */}
      <Card className="mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-1">Volume Topik</h2>
        <p className="text-xs text-gray-400 mb-4">Jumlah komentar per cluster topik (top 6)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
            <Tooltip formatter={(v) => [v.toLocaleString('id-ID'), 'Komentar']} />
            <Bar dataKey="jumlah" name="Jumlah" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Topic Cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-700">Detail Cluster Topik</h2>
        <div className="flex gap-2">
          {filterOptions.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((topic) => (
          <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow">
            {/* Header row */}
            <div className="flex items-center justify-between" onClick={() => setExpanded(expanded === topic.id ? null : topic.id)}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-500">#{topic.id}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{topic.topic}</p>
                  <p className="text-xs text-gray-400">{topic.count.toLocaleString('id-ID')} komentar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge label={topic.sentiment} variant={topic.sentiment} />
                {expanded === topic.id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
              </div>
            </div>

            {/* Expanded detail */}
            {expanded === topic.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                <p className="text-xs text-gray-400 font-medium mb-2">Keyword Dominan:</p>
                <div className="flex flex-wrap gap-2">
                  {topic.keywords.map((kw, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

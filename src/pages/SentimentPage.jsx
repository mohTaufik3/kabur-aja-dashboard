import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import { Loader2 } from 'lucide-react';

const filterOptions = ['Semua', 'Positif', 'Netral', 'Negatif'];

const SENTIMENT_COLORS = {
  negatif: '#ef4444',
  netral: '#94a3b8',
  positif: '#10b981',
};

export default function SentimentPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = 'http://127.0.0.1:8000';
    Promise.all([fetch(`${base}/api/sentiment/summary`).then((r) => r.json()), fetch(`${base}/api/sentiment/timeline`).then((r) => r.json()), fetch(`${base}/api/sentiment/samples`).then((r) => r.json())])
      .then(([s, t, c]) => {
        setSummary(s);
        setTimeline(t);
        setSamples(c);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-sm text-gray-500 font-medium">Memuat data sentimen...</p>
      </div>
    );
  }

  const total = summary?.total || 0;

  const chartData = [
    { name: 'Negatif', value: summary?.negatif || 0, color: SENTIMENT_COLORS.negatif },
    { name: 'Netral', value: summary?.netral || 0, color: SENTIMENT_COLORS.netral },
    { name: 'Positif', value: summary?.positif || 0, color: SENTIMENT_COLORS.positif },
  ];

  const filteredComments = activeFilter === 'Semua' ? samples : samples.filter((c) => c.sentiment === activeFilter.toLowerCase());

  return (
    <div>
      <SectionTitle title="Analisis Sentimen" subtitle="Hasil klasifikasi sentimen menggunakan model IndoBERT pada data #KaburAjaDulu" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Distribusi Sentimen</h2>
          <p className="text-xs text-gray-400 mb-4">Total {total.toLocaleString('id-ID')} komentar</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value.toLocaleString('id-ID'), 'Komentar']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Sentimen per Platform</h2>
          <p className="text-xs text-gray-400 mb-4">Perbandingan distribusi Platform X vs TikTok</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary?.platform || []} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
              <Legend />
              <Bar dataKey="negatif" name="Negatif" fill={SENTIMENT_COLORS.negatif} radius={[4, 4, 0, 0]} />
              <Bar dataKey="netral" name="Netral" fill={SENTIMENT_COLORS.netral} radius={[4, 4, 0, 0]} />
              <Bar dataKey="positif" name="Positif" fill={SENTIMENT_COLORS.positif} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-1">Tren Sentimen per Bulan</h2>
        <p className="text-xs text-gray-400 mb-4">Perkembangan sentimen Agustus 2024 – Desember 2025 (data Platform X)</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
            <Legend />
            <Line type="monotone" dataKey="negatif" name="Negatif" stroke={SENTIMENT_COLORS.negatif} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="netral" name="Netral" stroke={SENTIMENT_COLORS.netral} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="positif" name="Positif" stroke={SENTIMENT_COLORS.positif} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-700">Contoh Komentar</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sample data dari hasil klasifikasi IndoBERT</p>
          </div>
          <div className="flex gap-2">
            {filterOptions.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${activeFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredComments.length > 0 ? (
            filteredComments.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700 flex-1 leading-relaxed">{item.text}</p>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge label={item.sentiment} variant={item.sentiment} />
                  <span className="text-xs text-gray-400">{item.platform}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Tidak ada komentar untuk filter ini.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import { Loader2, RefreshCw } from 'lucide-react';

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
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const base = 'http://127.0.0.1:8000';
    Promise.all([
      fetch(`${base}/api/sentiment/summary`).then((r) => r.json()),
      fetch(`${base}/api/sentiment/timeline`).then((r) => r.json()),
      fetch(`${base}/api/sentiment/samples`).then((r) => r.json()),
      fetch(`${base}/api/sentiment/evaluation`).then((r) => r.json()),
    ])
      .then(([s, t, c, e]) => {
        setSummary(s);
        setTimeline(t);
        setSamples(c);
        setEvaluation(e);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRefreshSamples = () => {
    setRefreshing(true);
    fetch('http://127.0.0.1:8000/api/sentiment/samples/refresh')
      .then((r) => r.json())
      .then((data) => {
        setSamples(data);
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  };

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

  const cm = evaluation?.confusion_matrix || [];
  const classes = evaluation?.classes || [];
  const report = evaluation?.classification_report || {};

  const cmColors = [
    ['bg-red-100', 'bg-red-50', 'bg-red-50'],
    ['bg-slate-50', 'bg-slate-100', 'bg-slate-50'],
    ['bg-emerald-50', 'bg-emerald-50', 'bg-emerald-100'],
  ];

  return (
    <div>
      <SectionTitle title="Analisis Sentimen" subtitle="Hasil klasifikasi sentimen menggunakan model IndoBERT fine-tuned pada data #KaburAjaDulu" />

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

      {evaluation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h2 className="text-base font-semibold text-gray-700 mb-1">Confusion Matrix</h2>
            <p className="text-xs text-gray-400 mb-4">Evaluasi model IndoBERT fine-tuned pada {evaluation.test_size} data test</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr>
                    <th className="p-2 text-xs text-gray-400 font-medium text-left">Aktual \ Prediksi</th>
                    {classes.map((c) => (
                      <th key={c} className="p-2 text-xs font-semibold text-gray-600">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cm.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 text-xs font-semibold text-gray-600 text-left">{classes[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className={`p-3 font-bold text-sm rounded ${i === j ? 'text-blue-700' : 'text-gray-400'} ${cmColors[i]?.[j] || 'bg-gray-50'}`}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Diagonal biru = prediksi benar. Off-diagonal = kesalahan klasifikasi.</p>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-700 mb-1">Metrik Evaluasi Model</h2>
            <p className="text-xs text-gray-400 mb-4">
              Accuracy keseluruhan: <span className="font-bold text-blue-600">{((report.accuracy || 0) * 100).toFixed(2)}%</span>
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs text-gray-400 font-medium">Kelas</th>
                  <th className="text-center py-2 text-xs text-gray-400 font-medium">Precision</th>
                  <th className="text-center py-2 text-xs text-gray-400 font-medium">Recall</th>
                  <th className="text-center py-2 text-xs text-gray-400 font-medium">F1-Score</th>
                  <th className="text-center py-2 text-xs text-gray-400 font-medium">Support</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls} className="border-b border-gray-50">
                    <td className="py-2.5 font-semibold text-gray-700">{cls}</td>
                    <td className="py-2.5 text-center text-gray-600">{((report[cls]?.precision || 0) * 100).toFixed(1)}%</td>
                    <td className="py-2.5 text-center text-gray-600">{((report[cls]?.recall || 0) * 100).toFixed(1)}%</td>
                    <td className="py-2.5 text-center font-semibold text-blue-600">{((report[cls]?.['f1-score'] || 0) * 100).toFixed(1)}%</td>
                    <td className="py-2.5 text-center text-gray-400">{report[cls]?.support || 0}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50">
                  <td className="py-2.5 font-semibold text-blue-700">Weighted Avg</td>
                  <td className="py-2.5 text-center font-semibold text-blue-700">{((report['weighted avg']?.precision || 0) * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-center font-semibold text-blue-700">{((report['weighted avg']?.recall || 0) * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-center font-semibold text-blue-700">{((report['weighted avg']?.['f1-score'] || 0) * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-center font-semibold text-blue-700">{report['weighted avg']?.support || 0}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-700">Contoh Komentar</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sample data dari hasil klasifikasi IndoBERT</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefreshSamples} disabled={refreshing} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 disabled:opacity-50">
              <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
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

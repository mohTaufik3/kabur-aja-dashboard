import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingDown, Minus, TrendingUp, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import SectionTitle from '../components/atoms/SectionTitle';
import StatCard from '../components/molecules/StatCard';
import Badge from '../components/atoms/Badge';
import Card from '../components/atoms/Card';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = 'http://127.0.0.1:8000';
    Promise.all([fetch(`${base}/api/sentiment/summary`).then((r) => r.json()), fetch(`${base}/api/topics/summary`).then((r) => r.json())])
      .then(([summaryRes, topicsRes]) => {
        setSummary(summaryRes);
        setTopics(topicsRes.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-sm text-gray-500 font-medium">Memuat data...</p>
      </div>
    );
  }

  const total = summary?.total || 0;
  const negatif = summary?.negatif || 0;
  const netral = summary?.netral || 0;
  const positif = summary?.positif || 0;

  const sentimentDistribution = [
    { label: 'Negatif', value: negatif, color: 'bg-red-400' },
    { label: 'Netral', value: netral, color: 'bg-slate-300' },
    { label: 'Positif', value: positif, color: 'bg-emerald-400' },
  ];

  const platformSources = [
    {
      label: 'Platform X',
      value: summary?.platform_counts?.X || 0,
      colorText: 'text-blue-600',
      colorBg: 'bg-blue-50',
      colorSub: 'text-blue-400',
    },
    {
      label: 'TikTok',
      value: summary?.platform_counts?.TikTok || 0,
      colorText: 'text-pink-500',
      colorBg: 'bg-pink-50',
      colorSub: 'text-pink-400',
    },
  ];

  return (
    <div>
      <SectionTitle title="Dashboard Overview" subtitle="Analisis sentimen #KaburAjaDulu dari platform X dan TikTok" />

      <div className="mb-8 p-5 bg-blue-600 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-base">Coba Analisis Komentar</p>
          <p className="text-blue-200 text-sm mt-0.5">Input komentar dan lihat hasil sentimen secara langsung</p>
        </div>
        <button onClick={() => navigate('/analyze')} className="flex items-center gap-2 bg-white text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
          <Sparkles size={15} />
          Coba Sekarang
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Data" value={total} icon={Users} bgIcon="bg-blue-50" colorIcon="text-blue-400" />
        <StatCard label="Negatif" value={negatif} color="text-red-500" icon={TrendingDown} bgIcon="bg-red-50" colorIcon="text-red-400" />
        <StatCard label="Netral" value={netral} color="text-slate-400" icon={Minus} bgIcon="bg-slate-50" colorIcon="text-slate-300" />
        <StatCard label="Positif" value={positif} color="text-emerald-500" icon={TrendingUp} bgIcon="bg-emerald-50" colorIcon="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-700">Topik Dominan</h2>
            <span onClick={() => navigate('/topic')} className="text-xs text-blue-500 flex items-center gap-1 cursor-pointer hover:underline">
              Lihat semua <ArrowRight size={12} />
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {topics.map((item, i) => {
              const sentimentLabel = item.dominant_sentiment || 'netral';
              const topicName = item.topic_label || `Topik #${item.topic_id_v2}`;
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-blue-300 w-5">{i + 1}</span>
                    <span className="text-sm text-gray-700 font-medium capitalize">{topicName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{(item.total || 0).toLocaleString('id-ID')}</span>
                    <Badge label={sentimentLabel} variant={sentimentLabel} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-5">Distribusi Sentimen</h2>
          <div className="flex flex-col gap-4">
            {sentimentDistribution.map((item) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-3">Sumber Data</p>
            <div className="flex gap-3">
              {platformSources.map((p) => (
                <div key={p.label} className={`flex-1 ${p.colorBg} rounded-xl p-3 text-center`}>
                  <p className={`text-lg font-bold ${p.colorText}`}>{p.value.toLocaleString('id-ID')}</p>
                  <p className={`text-xs ${p.colorSub} mt-0.5`}>{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

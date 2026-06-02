import { useState, useEffect } from 'react';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import TopicVolumeChart from '../components/organisms/TopicVolumeChart';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export default function TopicPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('Semua');

  const filterOptions = ['Semua', 'Negatif', 'Campuran', 'Positif'];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/topics/summary')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data ringkasan topik.');
        return res.json();
      })
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal memuat data dari server backend FastAPI.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-3">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-sm text-gray-500 font-medium">Memuat data BERTopic...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">{error}</div>;
  }

  // Perbaikan logika filter menggunakan dominant_sentiment dari backend v2
  const filtered = filter === 'Semua' ? topics : topics.filter((t) => t.dominant_sentiment && t.dominant_sentiment.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      <SectionTitle title="Pemodelan Topik" subtitle="Identifikasi isu sosial-ekonomi dominan menggunakan BERTopic" />

      <TopicVolumeChart data={topics} />

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
        {filtered.map((topic, index) => {
          const currentId = topic.topic_id_v2 !== undefined ? topic.topic_id_v2 : index;

          let topicName = topic.topic_label || `Cluster Topik #${currentId}`;
          if (typeof topicName === 'string' && topicName.includes('_')) {
            topicName = topicName.split('_').slice(1).join(', ');
          }

          let keywordsArray = [];
          if (typeof topic.keywords_clean === 'string') {
            keywordsArray = topic.keywords_clean.split(',').map((kw) => kw.trim());
          } else if (Array.isArray(topic.keywords_clean)) {
            keywordsArray = topic.keywords_clean;
          } else {
            keywordsArray = typeof topicName === 'string' ? topicName.split(' ') : [];
          }

          const sentimentLabel = topic.dominant_sentiment || 'Campuran';

          return (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between" onClick={() => setExpanded(expanded === currentId ? null : currentId)}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-500">#{currentId}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 capitalize">{topicName}</p>
                    <p className="text-xs text-gray-400">{(topic.total || 0).toLocaleString('id-ID')} komentar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge label={sentimentLabel} variant={sentimentLabel.toLowerCase()} />
                  {expanded === currentId ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                </div>
              </div>

              {expanded === currentId && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">
                    Topik ini mendominasi kluster obrolan publik dan diklasifikasikan ke dalam sektor BPS: <span className="font-semibold text-blue-600">{topic.bps_category || 'Umum'}</span>.
                  </p>
                  <p className="text-xs text-gray-400 font-medium mb-2">Keyword Dominan:</p>
                  <div className="flex flex-wrap gap-2">
                    {keywordsArray.map((kw, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { Send, RotateCcw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';

const topicMap = {
  kerja: 'Lapangan Kerja & Pengangguran',
  gaji: 'Gaji & Kesejahteraan',
  mahal: 'Biaya Hidup',
  biaya: 'Biaya Hidup',
  kabur: 'Peluang Luar Negeri',
  'luar negeri': 'Peluang Luar Negeri',
  pemerintah: 'Kebijakan Pemerintah',
  stress: 'Mental Health & Burnout',
  pendidikan: 'Pendidikan & Skill',
  nasionalis: 'Kebijakan Pemerintah',
  berusaha: 'Lapangan Kerja & Pengangguran',
};

const detectTopics = (text) => {
  const lower = text.toLowerCase();
  const found = Object.entries(topicMap)
    .filter(([k]) => lower.includes(k))
    .map(([, v]) => v);
  return [...new Set(found)];
};

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 10) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', {
        text: text.trim(),
      });

      const { sentiment, confidence } = response.data;
      const topics = detectTopics(text);

      setResult({
        sentiment,
        confidence,
        topics: topics.length > 0 ? topics : ['Umum'],
        source: 'IndoBERT',
      });
    } catch (err) {
      // Backend tidak aktif — fallback ke mock
      if (err.code === 'ERR_NETWORK') {
        setError('backend_offline');
      } else {
        setError('error_lain');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const sentimentColor = {
    negatif: 'text-red-500',
    positif: 'text-emerald-500',
    netral: 'text-slate-500',
  };

  const sentimentBar = {
    negatif: 'bg-red-400',
    positif: 'bg-emerald-400',
    netral: 'bg-slate-400',
  };

  const charCount = text.length;
  const isReady = text.trim().length >= 10;

  return (
    <div className="max-w-2xl mx-auto">
      <SectionTitle title="Analisis Komentar" subtitle="Masukkan komentar untuk dianalisis sentimen menggunakan IndoBERT" />

      {/* Status backend */}
      <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
        <Wifi size={15} className="text-green-500 shrink-0" />
        <p className="text-xs text-green-600 font-medium">Terhubung ke IndoBERT via FastAPI — hasil analisis menggunakan model sesungguhnya</p>
      </div>

      {/* Input Card */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Teks Komentar</label>
          <span className={`text-xs ${charCount > 500 ? 'text-red-400' : 'text-gray-400'}`}>{charCount}/500</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Contoh: Susah banget cari kerja di Indonesia, gaji kecil tapi biaya hidup makin mahal..."
          rows={5}
          className="w-full text-sm text-gray-700 placeholder-gray-300 border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
        />
        {!isReady && text.length > 0 && <p className="text-xs text-gray-400 mt-2">Minimal 10 karakter</p>}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={!isReady || loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isReady && !loading ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={14} />
            {loading ? 'Menganalisis...' : 'Analisis'}
          </button>
          {(text || result) && (
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <Card>
          <div className="flex items-center gap-3 py-4">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">IndoBERT sedang menganalisis...</p>
          </div>
        </Card>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card>
          <div className="flex items-center gap-3 py-2">
            <WifiOff size={16} className="text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-500">{error === 'backend_offline' ? 'Backend tidak aktif' : 'Terjadi kesalahan saat analisis'}</p>
              <p className="text-xs text-gray-400 mt-0.5">{error === 'backend_offline' ? 'Pastikan FastAPI server sudah berjalan di port 8000' : 'Coba lagi dalam beberapa saat'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && !loading && (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-700">Hasil Analisis</h2>
            <span className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-medium">via IndoBERT</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Klasifikasi Sentimen</p>
              <p className={`text-2xl font-bold capitalize ${sentimentColor[result.sentiment]}`}>{result.sentiment}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Confidence Score</p>
              <p className="text-2xl font-bold text-gray-700">{result.confidence}%</p>
            </div>
          </div>

          <div className="mb-5">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-700 ${sentimentBar[result.sentiment]}`} style={{ width: `${result.confidence}%` }} />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Topik Terdeteksi</p>
            <div className="flex flex-wrap gap-2">
              {result.topics.map((topic, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

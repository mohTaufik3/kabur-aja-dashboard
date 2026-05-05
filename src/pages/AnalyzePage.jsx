import { useState } from 'react';
import { Send, RotateCcw, AlertCircle } from 'lucide-react';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';

const mockAnalyze = (text) => {
  const negKeywords = ['susah', 'mahal', 'pengangguran', 'korupsi', 'gagal', 'buruk', 'kecewa', 'lelah', 'stress', 'kabur'];
  const posKeywords = ['bagus', 'baik', 'senang', 'sukses', 'peluang', 'harapan', 'berhasil', 'worth', 'luar negeri'];

  const lower = text.toLowerCase();
  const negScore = negKeywords.filter((k) => lower.includes(k)).length;
  const posScore = posKeywords.filter((k) => lower.includes(k)).length;

  let sentiment, confidence, color;
  if (negScore > posScore) {
    sentiment = 'negatif';
    confidence = Math.min(60 + negScore * 8, 95);
    color = 'text-red-500';
  } else if (posScore > negScore) {
    sentiment = 'positif';
    confidence = Math.min(60 + posScore * 8, 95);
    color = 'text-emerald-500';
  } else {
    sentiment = 'netral';
    confidence = 72;
    color = 'text-slate-500';
  }

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
  };

  const detectedTopics = Object.entries(topicMap)
    .filter(([k]) => lower.includes(k))
    .map(([, v]) => v);

  const uniqueTopics = [...new Set(detectedTopics)];

  return { sentiment, confidence, color, topics: uniqueTopics.length > 0 ? uniqueTopics : ['Umum'] };
};

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim() || text.trim().length < 10) return;
    setLoading(true);
    setResult(null);
    // Simulasi delay API call
    setTimeout(() => {
      setResult(mockAnalyze(text));
      setLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };

  const charCount = text.length;
  const isReady = text.trim().length >= 10;

  return (
    <div className="max-w-2xl mx-auto">
      <SectionTitle title="Analisis Komentar" subtitle="Masukkan komentar untuk dianalisis sentimen dan topiknya menggunakan IndoBERT" />

      <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-600">
          Saat ini menggunakan <strong>mock response</strong> untuk simulasi. Hasil aktual akan menggunakan model IndoBERT via FastAPI backend.
        </p>
      </div>

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
        {!isReady && text.length > 0 && <p className="text-xs text-gray-400 mt-2">Minimal 10 karakter untuk dianalisis</p>}

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

      {loading && (
        <Card>
          <div className="flex items-center gap-3 py-4">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Model sedang menganalisis komentar...</p>
          </div>
        </Card>
      )}

      {result && !loading && (
        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-5">Hasil Analisis</h2>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Klasifikasi Sentimen</p>
              <p className={`text-2xl font-bold capitalize ${result.color}`}>{result.sentiment}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Confidence Score</p>
              <p className="text-2xl font-bold text-gray-700">{result.confidence}%</p>
            </div>
          </div>

          <div className="mb-5">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${result.sentiment === 'negatif' ? 'bg-red-400' : result.sentiment === 'positif' ? 'bg-emerald-400' : 'bg-slate-400'}`}
                style={{ width: `${result.confidence}%` }}
              />
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

          <p className="text-xs text-gray-300 mt-5 pt-4 border-t border-gray-100">* Hasil ini merupakan simulasi. Model IndoBERT aktual akan memberikan akurasi lebih tinggi.</p>
        </Card>
      )}
    </div>
  );
}

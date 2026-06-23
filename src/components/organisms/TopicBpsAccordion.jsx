import { useState, useMemo } from 'react';
import TopicBpsRow from '../molecules/TopicBpsRow';

export default function TopicBpsAccordion({ topics }) {
  const [expanded, setExpanded] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Kategori dinamis dari data, tidak hardcode
  const categories = useMemo(() => {
    const cats = [...new Set(topics.map((t) => t.bps_category))].sort();
    return ['Semua', ...cats];
  }, [topics]);

  const filtered = topics.filter((t) => activeCategory === 'Semua' || t.bps_category === activeCategory).slice(0, 20);

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-base font-semibold text-gray-700">Korelasi Topik BERTopic dengan Data BPS</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-4">Setiap topik percakapan publik dikaitkan dengan data BPS yang relevan sebagai validasi sosial-ekonomi</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((topic) => (
          <TopicBpsRow key={topic.topic_id} topic={topic} isOpen={expanded === topic.topic_id} onToggle={() => setExpanded(expanded === topic.topic_id ? null : topic.topic_id)} />
        ))}
      </div>
    </div>
  );
}

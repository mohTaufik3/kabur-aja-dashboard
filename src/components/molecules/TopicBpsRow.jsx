import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';

const CATEGORY_COLOR = {
  'Upah & Kesejahteraan': 'bg-blue-50 text-blue-700 border-blue-200',
  Ketenagakerjaan: 'bg-purple-50 text-purple-700 border-purple-200',
  'Migrasi & Ketenagakerjaan LN': 'bg-amber-50 text-amber-700 border-amber-200',
  'Kebijakan Pemerintah': 'bg-red-50 text-red-700 border-red-200',
  Pendidikan: 'bg-green-50 text-green-700 border-green-200',
  Lainnya: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function TopicBpsRow({ topic, isOpen, onToggle }) {
  const colorClass = CATEGORY_COLOR[topic.bps_category] || CATEGORY_COLOR['Lainnya'];

  const bpsKeys = Object.keys(topic.bps_data || {});
  const firstKey = bpsKeys[0];
  const previewData = firstKey ? (topic.bps_data[firstKey] || []).slice(0, 5) : [];

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      {/* Header baris */}
      <div className="flex items-start justify-between gap-3" onClick={onToggle}>
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-blue-500">#{topic.topic_id}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">{topic.topic_label}</p>
            <p className="text-xs text-gray-400">
              {topic.total.toLocaleString('id-ID')} komentar · <span className="text-red-500">{topic.pct_negatif}% negatif</span>
            </p>
            <p className="text-xs text-gray-500 mt-1 italic">{topic.bps_insight}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colorClass}`}>{topic.bps_category}</span>
          <Badge label={topic.dominant_sentiment} variant={topic.dominant_sentiment} />
          {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </div>

      {/* Detail (expandable) */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {/* Keywords */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Keyword Dominan</p>
            <div className="flex flex-wrap gap-1.5">
              {topic.keywords.map((kw, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Distribusi sentimen */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Distribusi Sentimen</p>
            <div className="flex gap-3">
              {[
                { label: 'Negatif', value: topic.pct_negatif, cls: 'bg-red-50 text-red-600' },
                { label: 'Netral', value: topic.pct_netral, cls: 'bg-gray-50 text-gray-600' },
                { label: 'Positif', value: topic.pct_positif, cls: 'bg-green-50 text-green-600' },
              ].map(({ label, value, cls }) => (
                <div key={label} className={`flex-1 ${cls} rounded-lg p-2 text-center`}>
                  <p className="text-sm font-bold">{value}%</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabel BPS */}
          {previewData.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
                Data BPS Terkait: <span className="text-blue-600">{topic.bps_label}</span>
                <span className="text-gray-400 ml-1">({firstKey?.replace('_', ' ')})</span>
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0] || {}).map((col) => (
                        <th key={col} className="px-3 py-2 text-left text-gray-500 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 text-gray-700">
                            {typeof val === 'number' && val > 10000 ? val.toLocaleString('id-ID') : (val ?? '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

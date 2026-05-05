import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import SectionTitle from '../components/atoms/SectionTitle';
import Card from '../components/atoms/Card';
import Badge from '../components/atoms/Badge';
import { sentimentSummary, sentimentChartData, sentimentByPlatform, sentimentTimeline, sampleComments } from '../data/mockData';

const filterOptions = ['Semua', 'Positif', 'Netral', 'Negatif'];

export default function SentimentPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredComments = activeFilter === 'Semua' ? sampleComments : sampleComments.filter((c) => c.sentiment === activeFilter.toLowerCase());

  return (
    <div>
      <SectionTitle title="Analisis Sentimen" subtitle="Hasil klasifikasi sentimen menggunakan model IndoBERT pada data #KaburAjaDulu" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-base font-semibold text-gray-700 mb-1">Distribusi Sentimen</h2>
          <p className="text-xs text-gray-400 mb-4">Total {sentimentSummary.total.toLocaleString('id-ID')} komentar</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sentimentChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                {sentimentChartData.map((entry, i) => (
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
          <p className="text-xs text-gray-400 mb-4">Perbandingan distribusi X vs TikTok</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sentimentByPlatform} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
              <Legend />
              <Bar dataKey="negatif" name="Negatif" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netral" name="Netral" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="positif" name="Positif" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-1">Tren Sentimen per Bulan</h2>
        <p className="text-xs text-gray-400 mb-4">Perkembangan sentimen Oktober 2024 – April 2025</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={sentimentTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
            <Legend />
            <Line type="monotone" dataKey="negatif" name="Negatif" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="netral" name="Netral" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="positif" name="Positif" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-700">Contoh Komentar</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sample data dari hasil klasifikasi</p>
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
          {filteredComments.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700 flex-1 leading-relaxed">{item.text}</p>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge label={item.sentiment} variant={item.sentiment} />
                <span className="text-xs text-gray-400">{item.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

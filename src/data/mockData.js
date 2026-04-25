export const sentimentSummary = {
  total: 22095,
  positive: 3120,
  neutral: 5430,
  negative: 13545,
};

export const sentimentChartData = [
  { name: 'Positif', value: 3120, color: '#22c55e' },
  { name: 'Netral', value: 5430, color: '#94a3b8' },
  { name: 'Negatif', value: 13545, color: '#ef4444' },
];

export const topTopics = [
  { topic: 'Lapangan Kerja', count: 4521, sentiment: 'negatif' },
  { topic: 'Gaji & UMR', count: 3812, sentiment: 'negatif' },
  { topic: 'Biaya Hidup', count: 2934, sentiment: 'negatif' },
  { topic: 'Pendidikan', count: 1823, sentiment: 'campuran' },
  { topic: 'Harapan Luar Negeri', count: 1654, sentiment: 'positif' },
];

// Yang tadi inline di DashboardPage, sekarang pindah ke sini
export const sentimentDistribution = [
  { label: 'Negatif', value: 13545, color: 'bg-red-400' },
  { label: 'Netral', value: 5430, color: 'bg-slate-300' },
  { label: 'Positif', value: 3120, color: 'bg-emerald-400' },
];

export const platformSources = [
  { label: 'Platform X', value: 10096, colorText: 'text-blue-600', colorBg: 'bg-blue-50', colorSub: 'text-blue-400' },
  { label: 'TikTok', value: 11999, colorText: 'text-pink-500', colorBg: 'bg-pink-50', colorSub: 'text-pink-400' },
];

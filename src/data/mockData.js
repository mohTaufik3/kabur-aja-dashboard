export const bpsKetenagakerjaan = [
  { periode: 'Feb 24', pengangguran: 7.2, partisipasi: 69.2, setengahPenganggur: 10.43 },
  { periode: 'Ags 24', pengangguran: 6.87, partisipasi: 69.78, setengahPenganggur: 10.12 },
  { periode: 'Feb 25', pengangguran: 6.53, partisipasi: 70.12, setengahPenganggur: 9.87 },
];

export const bpsGajiProvinsi = [
  { provinsi: 'DKI Jakarta', rataGaji: 5200000 },
  { provinsi: 'Jawa Barat', rataGaji: 3100000 },
  { provinsi: 'Jawa Timur', rataGaji: 2900000 },
  { provinsi: 'Jawa Tengah', rataGaji: 2600000 },
  { provinsi: 'Banten', rataGaji: 3400000 },
  { provinsi: 'Sumatera Utara', rataGaji: 2800000 },
];

export const bpsKorelasiSentimen = [
  { periode: 'Feb 24', pengangguran: 7.2, sentimenNegatif: 48 },
  { periode: 'Ags 24', pengangguran: 6.87, sentimenNegatif: 55 },
  { periode: 'Feb 25', pengangguran: 6.53, sentimenNegatif: 61 },
];

export const topicData = [
  {
    id: 1,
    topic: 'Lapangan Kerja & Pengangguran',
    count: 4521,
    sentiment: 'negatif',
    keywords: ['kerja', 'pengangguran', 'lowongan', 'fresh graduate', 'susah'],
    description: 'Kesulitan mencari pekerjaan, terutama bagi lulusan baru',
  },
  {
    id: 2,
    topic: 'Gaji & Kesejahteraan',
    count: 3812,
    sentiment: 'negatif',
    keywords: ['gaji', 'UMR', 'upah', 'sejahtera', 'kecil'],
    description: 'Ketidakpuasan terhadap standar gaji dan UMR yang tidak sesuai biaya hidup',
  },
  {
    id: 3,
    topic: 'Biaya Hidup',
    count: 2934,
    sentiment: 'negatif',
    keywords: ['mahal', 'biaya', 'harga', 'sembako', 'kos'],
    description: 'Kenaikan harga kebutuhan pokok dan biaya hidup sehari-hari',
  },
  {
    id: 4,
    topic: 'Pendidikan & Skill',
    count: 1823,
    sentiment: 'campuran',
    keywords: ['pendidikan', 'kuliah', 'skill', 'beasiswa', 'luar negeri'],
    description: 'Harapan mendapatkan pendidikan dan pengembangan skill di luar negeri',
  },
  {
    id: 5,
    topic: 'Peluang Luar Negeri',
    count: 1654,
    sentiment: 'positif',
    keywords: ['abroad', 'Singapore', 'Japan', 'peluang', 'migrate'],
    description: 'Antusiasme terhadap peluang kerja dan kehidupan di luar negeri',
  },
  {
    id: 6,
    topic: 'Kebijakan Pemerintah',
    count: 1432,
    sentiment: 'negatif',
    keywords: ['pemerintah', 'kebijakan', 'pajak', 'korupsi', 'politik'],
    description: 'Kritik terhadap kebijakan pemerintah yang dianggap tidak berpihak pada rakyat',
  },
  {
    id: 7,
    topic: 'Mental Health & Burnout',
    count: 987,
    sentiment: 'negatif',
    keywords: ['stress', 'burnout', 'mental', 'lelah', 'toxic'],
    description: 'Keluhan tentang lingkungan kerja toxic dan kesehatan mental',
  },
  {
    id: 8,
    topic: 'Infrastruktur & Fasilitas',
    count: 932,
    sentiment: 'campuran',
    keywords: ['fasilitas', 'infrastruktur', 'transportasi', 'internet', 'pelayanan'],
    description: 'Perbandingan fasilitas publik Indonesia dengan negara lain',
  },
];

export const sentimentByPlatform = [
  {
    platform: 'Platform X',
    positif: 1823,
    netral: 2541,
    negatif: 5732,
  },
  {
    platform: 'Tiktok',
    positif: 1297,
    netral: 2889,
    negatif: 7813,
  },
];

export const sentimentTimeline = [
  { bulan: 'Okt 24', positif: 210, netral: 380, negatif: 890 },
  { bulan: 'Nov 24', positif: 245, netral: 420, negatif: 1020 },
  { bulan: 'Des 24', positif: 189, netral: 390, negatif: 980 },
  { bulan: 'Jan 25', positif: 520, netral: 780, negatif: 2340 },
  { bulan: 'Feb 25', positif: 634, netral: 921, negatif: 3120 },
  { bulan: 'Mar 25', positif: 412, netral: 610, negatif: 2180 },
  { bulan: 'Apr 25', positif: 310, netral: 489, negatif: 1543 },
];

export const sampleComments = [
  { text: 'Udah ga ada harapan kerja di sini, mending kabur aja ke luar negeri', sentiment: 'negatif', platform: 'X' },
  { text: 'Gajinya kecil tapi tuntutannya banyak banget, kapan bisa sejahtera', sentiment: 'negatif', platform: 'TikTok' },
  { text: 'Semoga pemerintah bisa benerin kondisi ekonomi biar ga pada kabur', sentiment: 'netral', platform: 'X' },
  { text: 'Akhirnya dapet kerja di Singapore, prosesnya panjang tapi worth it', sentiment: 'positif', platform: 'TikTok' },
  { text: 'Biaya hidup makin mahal tapi UMR segitu-gitu aja, gimana mau nabung', sentiment: 'negatif', platform: 'X' },
  { text: 'Banyak yang kabur bukan berarti ga cinta Indonesia, tapi keadaan memaksa', sentiment: 'netral', platform: 'TikTok' },
];

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

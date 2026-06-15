import { ExternalLink } from 'lucide-react';

export default function BpsSumberInfo() {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <ExternalLink size={14} className="text-blue-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-blue-700">Sumber Data Sekunder</p>
        <p className="text-xs text-blue-500 mt-0.5">Data diperoleh dari berkas resmi Badan Pusat Statistik (BPS) periode 2025 yang telah diintegrasikan dengan sistem.</p>
      </div>
    </div>
  );
}

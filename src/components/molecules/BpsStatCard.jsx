import Card from '../atoms/Card';

export default function BpsStatCard({ label, value, note, valueClass = 'text-blue-600' }) {
  return (
    <Card>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
    </Card>
  );
}

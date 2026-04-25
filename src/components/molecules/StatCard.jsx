import Card from '../atoms/Card';

const StatCard = ({ label, value, color = 'text-gray-800', icon: Icon, bgIcon = 'bg-blue-50', colorIcon = 'text-blue-400' }) => {
  return (
    <Card className="hover:shadow-md hover:shadow-blue-100 transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 ${bgIcon} rounded-xl flex items-center justify-center`}>
            <Icon size={17} className={colorIcon} />
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold tracking-tight ${color}`}>{value.toLocaleString('id-ID')}</p>
    </Card>
  );
};

export default StatCard;

const variantStyles = {
  negatif: 'bg-red-100 text-red-700',
  positif: 'bg-green-100 text-green-700',
  campuran: 'bg-yellow-100 text-yello-700',
  netral: 'bg-gray-100 text-gray-700',
};

const Badge = ({ label, variant = 'netral' }) => {
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${variantStyles[variant]}`}>{label}</span>;
};

export default Badge;

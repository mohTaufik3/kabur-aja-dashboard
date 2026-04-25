const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
      {subtitle && <p className="text-gray-400 text-sm mt-1.5">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;

const Card = ({ children, className = '' }) => {
  return <div className={`bg-white rounded-2xl border border-blue-100 shadow-sm shadow-blue-50 p-6 ${className}`}>{children}</div>;
};

export default Card;

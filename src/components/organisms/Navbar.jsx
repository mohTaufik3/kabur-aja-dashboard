import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Layers, Database } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sentiment', label: 'Sentimen', icon: BarChart2 },
  { path: '/topic', label: 'Topik', icon: Layers },
  { path: '/bps', label: 'Data BPS', icon: Database },
];

const Navbar = () => {
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">#</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 leading-tight">#KaburAjaDulu</p>
            <p className="text-xs text-gray-400 leading-tight">Sentiment Dashboard</p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`
                }
              >
                <Icon size={15} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-blue-600 font-medium">22.095 data</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { LayoutDashboard, Users, Target, CheckSquare, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Customers', path: '/customers' },
    { icon: <Target size={20} />, label: 'Leads', path: '/leads' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6 text-white font-bold text-2xl flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">🚀</div>
        <span>CRM</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.path 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
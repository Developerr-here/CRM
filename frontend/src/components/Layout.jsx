

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';

const Layout = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-slate-500 font-medium">Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span></h2>
          <div className="flex items-center gap-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role}
            </span>
            <div className="h-10 w-10 bg-slate-200 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
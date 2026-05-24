import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import AICopilot from './AICopilot';
import useAuthStore from '../store/useAuthStore';
import { Search, Bell, Building2, ChevronDown } from 'lucide-react';
 
/**
 * Layout — shell wrapping all authenticated pages
 * - Sticky topbar: global search, tenant badge, user chip
 * - Left sidebar
 * - Floating AI copilot FAB
 */
const Layout = () => {
  const { user } = useAuthStore();
  const [searchValue, setSearchValue] = useState('');
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';
 
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar />
 
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* ── Topbar ── */}
        <header className="topbar">
          {/* Left: search */}
          <div className="search-bar" style={{ maxWidth: 280 }}>
            <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              placeholder="Search anything..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            {/* Kbd shortcut hint */}
            <span style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              background: 'var(--border)', borderRadius: 4,
              padding: '1px 5px', flexShrink: 0, fontFamily: 'DM Mono, monospace'
            }}>⌘K</span>
          </div>
 
          {/* Right: tenant pill + notifications + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Tenant / Org badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-muted)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '6px 11px',
              cursor: 'pointer', transition: 'all .18s',
              fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Building2 size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.organization || 'Workspace'}
              </span>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
            </div>
 
            {/* Role badge */}
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: 'var(--accent-light)', color: 'var(--accent)',
              border: '1px solid rgba(79,110,247,.18)',
              borderRadius: 99, padding: '3px 9px',
              letterSpacing: '.04em', textTransform: 'uppercase'
            }}>
              {user?.role}
            </span>
 
            {/* Notification bell */}
            <button style={{
              width: 34, height: 34, borderRadius: 9,
              border: '1.5px solid var(--border)',
              background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)',
              transition: 'all .18s', position: 'relative'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Bell size={15} />
              {/* Unread dot */}
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7, borderRadius: 50,
                background: 'var(--red)', border: '1.5px solid #fff'
              }} />
            </button>
 
            {/* Avatar */}
            <div className="avatar" style={{ cursor: 'pointer' }}>{initials}</div>
          </div>
        </header>
 
        {/* ── Main content ── */}
        <main className="page-content" style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
 
      {/* ── Floating AI Copilot ── */}
      <AICopilot />
    </div>
  );
};
 
export default Layout;


// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import useAuthStore from '../store/useAuthStore';

// const Layout = () => {
//   const { user } = useAuthStore();

//   return (
//     <div className="flex bg-slate-50 min-h-screen">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         {/* Topbar */}
//         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
//           <h2 className="text-slate-500 font-medium">Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span></h2>
//           <div className="flex items-center gap-4">
//             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
//               {user?.role}
//             </span>
//             <div className="h-10 w-10 bg-slate-200 rounded-full border-2 border-white shadow-sm"></div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
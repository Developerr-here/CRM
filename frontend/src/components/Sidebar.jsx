
import { LayoutDashboard, Users, Target, CheckSquare, LogOut, Zap, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
 
/**
 * Sidebar — fixed left navigation
 * - Dark slate background with indigo accent
 * - Active indicator: left-border bar + subtle bg tint
 * - Bottom user info strip with avatar + logout
 */
const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuthStore();
 
  const menuItems = [
    { icon: <LayoutDashboard size={17} />, label: 'Dashboard',  path: '/' },
    { icon: <Users size={17} />,           label: 'Customers',  path: '/customers' },
    { icon: <Target size={17} />,          label: 'Pipeline',   path: '/leads' },
    { icon: <CheckSquare size={17} />,     label: 'Tasks',      path: '/tasks' },
  ];
 
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';
 
  return (
    <aside className="sidebar">
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <Zap size={17} fill="white" color="white" />
        </div>
        <div>
          <div className="sidebar-logo-text">NexusCRM</div>
          <div className="sidebar-logo-sub">Pro</div>
        </div>
      </div>
 
      {/* ── Nav ── */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Workspace</div>
 
        {menuItems.map((item) => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
 
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {/* Icon with slight accent tint on active */}
              <span style={{ color: isActive ? 'var(--accent-mid)' : 'inherit' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
 
              {/* Active arrow indicator */}
              {isActive && (
                <ChevronRight
                  size={14}
                  style={{ marginLeft: 'auto', color: 'var(--accent-mid)', opacity: .7 }}
                />
              )}
            </Link>
          );
        })}
 
        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '16px 8px' }} />
      </nav>
 
      {/* ── User footer ── */}
      <div className="sidebar-footer">
        {/* User strip */}
        <div className="sidebar-user">
          {/* Avatar */}
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--sidebar-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.organization}
            </div>
          </div>
          {/* Logout icon */}
          <button
            onClick={logout}
            title="Logout"
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'rgba(148,163,184,.6)', padding: '4px', borderRadius: 6,
              display: 'flex', alignItems: 'center',
              transition: 'color .18s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,.6)'}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
 
export default Sidebar;

// import { LayoutDashboard, Users, Target, CheckSquare, LogOut } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';
// import useAuthStore from '../store/useAuthStore';

// const Sidebar = () => {
//   const location = useLocation();
//   const { logout } = useAuthStore();

//   const menuItems = [
//     { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
//     { icon: <Users size={20} />, label: 'Customers', path: '/customers' },
//     { icon: <Target size={20} />, label: 'Leads', path: '/leads' },
//     { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
//   ];

//   return (
//     <div className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
//       <div className="p-6 text-white font-bold text-2xl flex items-center gap-2">
//         <div className="bg-blue-600 p-1.5 rounded-lg">🚀</div>
//         <span>CRM</span>
//       </div>

//       <nav className="flex-1 px-4 space-y-2 mt-4">
//         {menuItems.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//               location.pathname === item.path 
//               ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
//               : 'hover:bg-slate-800 hover:text-white'
//             }`}
//           >
//             {item.icon}
//             <span className="font-medium">{item.label}</span>
//           </Link>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-slate-800">
//         <button 
//           onClick={logout}
//           className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
//         >
//           <LogOut size={20} />
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
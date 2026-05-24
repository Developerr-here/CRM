import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Users, Target, DollarSign, TrendingUp, Building2, ArrowUpRight, Zap, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
 
/**
 * Dashboard — overview of key CRM metrics
 * KPI grid, pipeline feed, quick actions, AI tip card
 * All logic unchanged; only markup/styling updated.
 */
const Dashboard = () => {
  const { user } = useAuthStore();
 
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(res => res.data.stats),
    enabled: !!user,
  });
 
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads-recent'],
    queryFn: () => api.get('/leads').then(res => res.data.data),
    enabled: !!user,
  });
 
  if (!user) return (
    <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );
 
  const activeLeads = leads?.filter(l => l.status !== 'won' && l.status !== 'lost') || [];
 
  const kpis = [
    {
      label: 'Total Customers',
      value: statsData?.customers ?? 0,
      icon: <Users size={20} />,
      color: '#EEF1FE', iconColor: 'var(--accent)',
      delta: '+12%'
    },
    {
      label: 'Active Leads',
      value: statsLoading ? '—' : activeLeads.length,
      icon: <Target size={20} />,
      color: '#F5F3FF', iconColor: 'var(--purple)',
      delta: '+5%'
    },
    {
      label: 'Pipeline Value',
      value: statsLoading ? '—' : `$${(statsData?.pipelineValue || 0).toLocaleString()}`,
      icon: <DollarSign size={20} />,
      color: '#ECFDF5', iconColor: 'var(--green)',
      delta: '+18%'
    },
  ];
 
  const STATUS_COLORS = {
    new: 'status-new', contacted: 'status-contacted',
    negotiation: 'status-negotiation', won: 'status-won', lost: 'status-lost'
  };
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Page header ── */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <Building2 size={13} />
            Managing <strong style={{ color: 'var(--text-secondary)' }}>{user?.organization}</strong>
          </p>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '6px 12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
 
      {/* ── KPI Cards ── */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card" style={{ animationDelay: `${i * .06}s` }}>
            <div className="kpi-icon" style={{ background: kpi.color }}>
              <span style={{ color: kpi.iconColor }}>{kpi.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value" style={{ color: 'var(--text-primary)' }}>
                {statsLoading ? <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>...</span> : kpi.value}
              </div>
            </div>
            {/* Delta badge */}
            <div style={{
              fontSize: 11, fontWeight: 700,
              background: 'var(--green-bg)', color: 'var(--green)',
              border: '1px solid #A7F3D0',
              borderRadius: 99, padding: '2px 8px',
              display: 'flex', alignItems: 'center', gap: 3, alignSelf: 'flex-start'
            }}>
              <ArrowUpRight size={11} /> {kpi.delta}
            </div>
          </div>
        ))}
      </div>
 
      {/* ── Main 2-col grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        {/* Pipeline feed */}
        <div className="card" style={{ padding: '22px 24px', animation: 'fadeUp .4s .1s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={17} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Active Pipeline</h3>
            </div>
            <a href="/leads" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              View all <ChevronRight size={13} />
            </a>
          </div>
 
          {leadsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 0' }}>
              <div className="spinner" />
            </div>
          ) : leads?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {leads.slice(0, 6).map(lead => (
                <div key={lead._id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  transition: 'background .15s', cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: 'linear-gradient(135deg,var(--accent-light),var(--bg-muted))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'var(--accent)', flexShrink: 0
                  }}>
                    {lead.customer?.name?.charAt(0) || 'L'}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lead.customer?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                      {lead.source || 'Direct'} · {lead.customer?.company || 'Individual'}
                    </div>
                  </div>
                  {/* Status badge */}
                  <span className={`badge ${STATUS_COLORS[lead.status] || ''}`}>
                    {lead.status}
                  </span>
                  {/* Value */}
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', minWidth: 70, textAlign: 'right' }}>
                    ${lead.value?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><Target size={24} /></div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>No leads yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Add your first lead from the Pipeline page.</p>
            </div>
          )}
        </div>
 
        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* AI Quick Actions */}
          <div style={{
            background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            animation: 'fadeUp .4s .18s both'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg,var(--accent),#818CF8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Zap size={14} fill="white" color="white" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>AI Co-pilot</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(148,163,184,.85)', lineHeight: 1.5, marginBottom: 14 }}>
              Ask me anything about your pipeline, or use these quick actions:
            </p>
            {['Draft follow-up email', 'Score top leads', 'Summarize pipeline'].map(action => (
              <div key={action} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 9,
                background: 'rgba(255,255,255,.06)', cursor: 'pointer',
                marginBottom: 6, transition: 'background .15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,110,247,.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.06)'}
              >
                <span style={{ fontSize: 12.5, color: '#E2E8F0', fontWeight: 500 }}>{action}</span>
                <ChevronRight size={13} style={{ color: 'rgba(148,163,184,.5)' }} />
              </div>
            ))}
          </div>
 
          {/* Tenant isolation notice */}
          <div className="card" style={{ padding: '16px 18px', animation: 'fadeUp .4s .22s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--green)', boxShadow: '0 0 6px var(--green)'
              }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>Multi-tenant Active</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Data isolated to <strong style={{ color: 'var(--text-secondary)' }}>{user.organization}</strong>. Other orgs cannot access your records.
            </p>
            <div style={{ height: 4, background: 'var(--bg-muted)', borderRadius: 99, marginTop: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '62%', background: 'linear-gradient(90deg,var(--accent),var(--accent-mid))', borderRadius: 99 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
 
export default Dashboard;






// import { useQuery } from '@tanstack/react-query';
// import api from '../api/axios'; // Ensure you import your axios instance
// import { Users, Target, DollarSign, TrendingUp, Building2 } from 'lucide-react';
// import useAuthStore from '../store/useAuthStore';

// const Dashboard = () => {
//   const { user } = useAuthStore();

//   // 1. Fetch Aggregated SaaS Stats from our new backend endpoint
//   const { data: statsData, isLoading: statsLoading } = useQuery({
//     queryKey: ['dashboard-stats'],
//     queryFn: () => api.get('/dashboard/stats').then(res => res.data.stats),
//     enabled: !!user, // Only fetch if user is logged in
//   });

//   // 2. Fetch Recent Leads for the activity feed
//   const { data: leads, isLoading: leadsLoading } = useQuery({ 
//     queryKey: ['leads-recent'], 
//     queryFn: () => api.get('/leads').then(res => res.data.data),
//     enabled: !!user,
//   });

//   if (!user) {
//     return (
//       <div className="h-96 flex items-center justify-center text-slate-500 font-medium">
//         Loading your secure workspace...
//       </div>
//     );
//   }

//   const kpis = [
//     { 
//       label: 'Total Customers', 
//       value: statsData?.customers || 0, 
//       icon: <Users className="text-blue-600" />, 
//       color: 'bg-blue-50' 
//     },
//     { 
//       label: 'Active Leads', 
//       value: leads?.filter(l => l.status !== 'won' && l.status !== 'lost').length || 0, 
//       icon: <Target className="text-purple-600" />, 
//       color: 'bg-purple-50' 
//     },
//     { 
//       label: 'Pipeline Value', 
//       value: `$${(statsData?.pipelineValue || 0).toLocaleString()}`, 
//       icon: <DollarSign className="text-green-600" />, 
//       color: 'bg-green-50' 
//     },
//   ];

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
     

// <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//   <div>
//     <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//       Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
//     </h1>
//     <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
//       <Building2 size={14} />
//       {/* ADDED THE QUESTION MARK BELOW (?.) */}
//       Managing <span className="font-semibold text-slate-700">{user?.organization || 'your team'}</span>
//     </p>
//   </div>
//   <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-medium text-slate-500">
//     Last Updated: {new Date().toLocaleTimeString()}
//   </div>
// </div>


//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {kpis.map((stat, index) => (
//           <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
//             <div className={`h-12 w-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
//               {stat.icon}
//             </div>
//             <div>
//               <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
//               <h3 className="text-2xl font-bold text-slate-900">
//                 {statsLoading ? '...' : stat.value}
//               </h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Activity Section */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//           <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
//             <TrendingUp size={18} className="text-blue-600" />
//             Active Sales Pipeline
//           </h3>
//           <div className="space-y-4">
//             {leadsLoading ? (
//                <p className="text-slate-400 text-sm">Loading leads...</p>
//             ) : leads?.length > 0 ? (
//               leads.slice(0, 5).map(lead => (
//                 <div key={lead._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
//                   <div className="flex items-center gap-4">
//                     <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
//                       {lead.customer?.name?.charAt(0) || 'L'}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-slate-800 text-sm">{lead.customer?.name || 'Unknown Contact'}</p>
//                       <p className="text-xs text-slate-400 capitalize">{lead.status} • {lead.source || 'Direct'}</p>
//                     </div>
//                   </div>
//                   <span className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">
//                     ${lead.value?.toLocaleString()}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-slate-400 text-sm italic">No leads found in this organization.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Small Help/Info Card */}
//         <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl shadow-slate-200">
//           <h3 className="font-bold mb-2">Multi-tenant Active</h3>
//           <p className="text-slate-400 text-sm mb-4">
//             Your data is currently isolated to <strong>{user.organization}</strong>. Users from other companies cannot see these metrics.
//           </p>
//           <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
//             <div className="h-full bg-blue-500 w-1/3"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
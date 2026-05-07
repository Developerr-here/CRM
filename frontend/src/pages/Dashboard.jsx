import { useQuery } from '@tanstack/react-query';
import api from '../api/axios'; // Ensure you import your axios instance
import { Users, Target, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  // 1. Fetch Aggregated SaaS Stats from our new backend endpoint
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(res => res.data.stats),
    enabled: !!user, // Only fetch if user is logged in
  });

  // 2. Fetch Recent Leads for the activity feed
  const { data: leads, isLoading: leadsLoading } = useQuery({ 
    queryKey: ['leads-recent'], 
    queryFn: () => api.get('/leads').then(res => res.data.data),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-500 font-medium">
        Loading your secure workspace...
      </div>
    );
  }

  const kpis = [
    { 
      label: 'Total Customers', 
      value: statsData?.customers || 0, 
      icon: <Users className="text-blue-600" />, 
      color: 'bg-blue-50' 
    },
    { 
      label: 'Active Leads', 
      value: leads?.filter(l => l.status !== 'won' && l.status !== 'lost').length || 0, 
      icon: <Target className="text-purple-600" />, 
      color: 'bg-purple-50' 
    },
    { 
      label: 'Pipeline Value', 
      value: `$${(statsData?.pipelineValue || 0).toLocaleString()}`, 
      icon: <DollarSign className="text-green-600" />, 
      color: 'bg-green-50' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
            <Building2 size={14} />
            Managing <span className="font-semibold text-slate-700">{user.organization}</span>
          </p>
        </div>
        <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-medium text-slate-500">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`h-12 w-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {statsLoading ? '...' : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            Active Sales Pipeline
          </h3>
          <div className="space-y-4">
            {leadsLoading ? (
               <p className="text-slate-400 text-sm">Loading leads...</p>
            ) : leads?.length > 0 ? (
              leads.slice(0, 5).map(lead => (
                <div key={lead._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {lead.customer?.name?.charAt(0) || 'L'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{lead.customer?.name || 'Unknown Contact'}</p>
                      <p className="text-xs text-slate-400 capitalize">{lead.status} • {lead.source || 'Direct'}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">
                    ${lead.value?.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm italic">No leads found in this organization.</p>
              </div>
            )}
          </div>
        </div>

        {/* Small Help/Info Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl shadow-slate-200">
          <h3 className="font-bold mb-2">Multi-tenant Active</h3>
          <p className="text-slate-400 text-sm mb-4">
            Your data is currently isolated to <strong>{user.organization}</strong>. Users from other companies cannot see these metrics.
          </p>
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
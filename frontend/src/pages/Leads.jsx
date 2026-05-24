import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '../api/leadApi';
import AddLeadModal from '../components/AddLeadModal';
import { Target, DollarSign, Calendar, Plus, BrainCircuit, Filter, ChevronDown } from 'lucide-react';
 
/**
 * AIScoreBadge — colour-coded match % pill
 * score >= 80 → green  |  >= 50 → amber  |  else → slate
 */
const AIScoreBadge = ({ score }) => {
  const cls = score >= 80 ? 'score-high' : score >= 50 ? 'score-mid' : 'score-low';
  const pulse = score >= 80;
 
  return (
    <div className={`badge ${cls}`} style={{ gap: 5 }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--border-strong)',
        animation: pulse ? 'pulse-dot 2s infinite' : 'none',
        flexShrink: 0
      }} />
      {score > 0 ? `${score}%` : '—'}
    </div>
  );
};
 
const STATUS_MAP = {
  new:         { label: 'New',         cls: 'status-new' },
  contacted:   { label: 'Contacted',   cls: 'status-contacted' },
  negotiation: { label: 'Negotiation', cls: 'status-negotiation' },
  won:         { label: 'Won',         cls: 'status-won' },
  lost:        { label: 'Lost',        cls: 'status-lost' },
};
 
const Leads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter]           = useState('all');
  const { data: leads, isLoading }    = useQuery({ queryKey: ['leads'], queryFn: fetchLeads });
 
  const statusFilters = ['all', 'new', 'contacted', 'negotiation', 'won', 'lost'];
 
  const displayedLeads = filter === 'all'
    ? leads
    : leads?.filter(l => l.status === filter);
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Pipeline</h1>
          <p className="page-subtitle">AI lead scoring active · {leads?.length ?? 0} total leads</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Lead
        </button>
      </div>
 
      {/* ── Status filter tabs ── */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '10px 12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Filter size={15} style={{ color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }} />
        {statusFilters.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              fontSize: 12, fontWeight: 600, padding: '5px 12px',
              borderRadius: 99,
              border: filter === s ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
              background: filter === s ? 'var(--accent-light)' : 'transparent',
              color: filter === s ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all .15s',
              textTransform: 'capitalize'
            }}
          >
            {s === 'all' ? 'All' : s}
            {s !== 'all' && (
              <span style={{ marginLeft: 5, fontWeight: 700 }}>
                {leads?.filter(l => l.status === s).length ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>
 
      {/* ── Lead Cards Grid ── */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="spinner" />
        </div>
      ) : displayedLeads?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Target size={24} /></div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>No leads found</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {filter !== 'all' ? 'Try selecting a different status filter.' : 'Create your first lead to get started.'}
          </p>
        </div>
      ) : (
        <div className="stagger" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: 16
        }}>
          {displayedLeads?.map((lead, i) => (
            <div key={lead._id} className="lead-card" style={{ animationDelay: `${i * .04}s` }}>
              {/* Top row: status + AI score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge ${STATUS_MAP[lead.status]?.cls || ''}`}>
                  {STATUS_MAP[lead.status]?.label || lead.status}
                </span>
                <AIScoreBadge score={lead.aiScore ?? 0} />
              </div>
 
              {/* Name + value */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <h3 style={{
                    fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
                  }}>
                    {lead.customer?.name}
                  </h3>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', flexShrink: 0 }}>
                    ${lead.value?.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
                  {lead.customer?.company || 'Personal Lead'}
                </p>
              </div>
 
              {/* AI Insight box */}
              <div style={{
                background: 'var(--accent-light)',
                border: '1px solid rgba(79,110,247,.12)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <BrainCircuit size={12} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                    AI Insight
                  </span>
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.55, fontStyle: 'italic' }}>
                  "{lead.aiSummary || 'Analysis in progress...'}"
                </p>
              </div>
 
              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 10, borderTop: '1px solid var(--border)',
                fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Target size={13} style={{ color: 'var(--border-strong)' }} />
                  {lead.source || 'Direct'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={13} style={{ color: 'var(--border-strong)' }} />
                  {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
 
      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
 
export default Leads;


// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchLeads } from '../api/leadApi';
// import AddLeadModal from '../components/AddLeadModal';
// import { Target, DollarSign, Calendar, Filter, Plus, BrainCircuit } from 'lucide-react';

// const AIScoreBadge = ({ score }) => {
//   const getScoreColor = (s) => {
//     if (s >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-100'; 
//     if (s >= 50) return 'bg-amber-50 text-amber-700 border-amber-100';     
//     return 'bg-slate-50 text-slate-500 border-slate-100';                  
//   };

//   return (
//     <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide ${getScoreColor(score)} flex items-center gap-1.5 w-fit`}>
//       <span className={`h-1.5 w-1.5 rounded-full ${score >= 80 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
//       {score > 0 ? `${score}% Match` : 'Analyzing...'}
//     </div>
//   );
// };

// const Leads = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { data: leads, isLoading } = useQuery({ queryKey: ['leads'], queryFn: fetchLeads });

//   const getStatusStyle = (status) => {
//     const styles = {
//       new: "bg-blue-100 text-blue-700 border-blue-200",
//       contacted: "bg-purple-100 text-purple-700 border-purple-200",
//       negotiation: "bg-orange-100 text-orange-700 border-orange-200",
//       won: "bg-green-100 text-green-700 border-green-200",
//       lost: "bg-red-100 text-red-700 border-red-200",
//     };
//     return styles[status] || "bg-slate-100 text-slate-700";
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
//           <p className="text-slate-500 text-sm">Automated AI lead scoring active</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
//         >
//           <Plus size={18} /> New Lead
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {leads?.map((lead) => (
//           <div key={lead._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
//             <div>
//               <div className="flex justify-between items-start mb-4">
//                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getStatusStyle(lead.status)} uppercase tracking-tight`}>
//                   {lead.status}
//                 </span>
//                 {/* --- AI SCORE INTEGRATION --- */}
//                 <AIScoreBadge score={lead.aiScore} />
//               </div>
              
//               <div className="flex justify-between items-baseline mb-1">
//                 <h3 className="font-bold text-slate-800 text-lg truncate">{lead.customer?.name}</h3>
//                 <span className="text-md font-black text-slate-900">${lead.value?.toLocaleString()}</span>
//               </div>
              
//               <p className="text-slate-400 text-xs mb-3 font-medium">{lead.customer?.company || 'Personal Lead'}</p>
              
//               {/* --- AI SUMMARY INTEGRATION --- */}
//               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
//                 <div className="flex items-center gap-1.5 mb-1 text-blue-600">
//                   <BrainCircuit size={12} />
//                   <span className="text-[10px] font-bold uppercase tracking-widest">AI Insight</span>
//                 </div>
//                 <p className="text-[11px] text-slate-600 leading-relaxed italic">
//                   "{lead.aiSummary || 'Analysis in progress...'}"
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
//               <div className="flex items-center gap-1"><Target size={14} className="text-slate-300"/> {lead.source || 'Direct'}</div>
//               <div className="flex items-center gap-1"><Calendar size={14} className="text-slate-300"/> {new Date(lead.createdAt).toLocaleDateString()}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   );
// };

// export default Leads;
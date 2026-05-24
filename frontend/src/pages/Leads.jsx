


import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLeads } from '../api/leadApi';
import AddLeadModal from '../components/AddLeadModal';
import { Target, DollarSign, Calendar, Filter, Plus, BrainCircuit } from 'lucide-react';

const AIScoreBadge = ({ score }) => {
  const getScoreColor = (s) => {
    if (s >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-100'; 
    if (s >= 50) return 'bg-amber-50 text-amber-700 border-amber-100';     
    return 'bg-slate-50 text-slate-500 border-slate-100';                  
  };

  return (
    <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide ${getScoreColor(score)} flex items-center gap-1.5 w-fit`}>
      <span className={`h-1.5 w-1.5 rounded-full ${score >= 80 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
      {score > 0 ? `${score}% Match` : 'Analyzing...'}
    </div>
  );
};

const Leads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: leads, isLoading } = useQuery({ queryKey: ['leads'], queryFn: fetchLeads });

  const getStatusStyle = (status) => {
    const styles = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      contacted: "bg-purple-100 text-purple-700 border-purple-200",
      negotiation: "bg-orange-100 text-orange-700 border-orange-200",
      won: "bg-green-100 text-green-700 border-green-200",
      lost: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
          <p className="text-slate-500 text-sm">Automated AI lead scoring active</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {leads?.map((lead) => (
          <div key={lead._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getStatusStyle(lead.status)} uppercase tracking-tight`}>
                  {lead.status}
                </span>
                {/* --- AI SCORE INTEGRATION --- */}
                <AIScoreBadge score={lead.aiScore} />
              </div>
              
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-800 text-lg truncate">{lead.customer?.name}</h3>
                <span className="text-md font-black text-slate-900">${lead.value?.toLocaleString()}</span>
              </div>
              
              <p className="text-slate-400 text-xs mb-3 font-medium">{lead.customer?.company || 'Personal Lead'}</p>
              
              {/* --- AI SUMMARY INTEGRATION --- */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                  <BrainCircuit size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI Insight</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">
                  "{lead.aiSummary || 'Analysis in progress...'}"
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <div className="flex items-center gap-1"><Target size={14} className="text-slate-300"/> {lead.source || 'Direct'}</div>
              <div className="flex items-center gap-1"><Calendar size={14} className="text-slate-300"/> {new Date(lead.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>

      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Leads;
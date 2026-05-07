import React, { useState } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query';
import axios from 'axios';
import { X, Loader2, Info } from 'lucide-react';

// Create a client for the provider
const queryClientInstance = new QueryClient();

/**
 * Internal Modal Content Component
 * This contains the actual logic and UI for the Add Lead form.
 */
const AddLeadModalContent = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  
  // Base API configuration
  const API_URL = 'http://localhost:5000/api';
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
  });

  const [formData, setFormData] = useState({
    customer: '',
    value: '',
    status: 'new',
    source: 'LinkedIn',
    notes: '',
    industry: 'Technology'
  });

  // Fetch customers to link to the lead
  const { data: customersResponse } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers'),
    enabled: isOpen
  });

  const customers = customersResponse?.data?.data || [];

  const mutation = useMutation({
    mutationFn: (newLead) => api.post('/leads', newLead),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      onClose();
      setFormData({ 
        customer: '', 
        value: '', 
        status: 'new', 
        source: 'LinkedIn', 
        notes: '', 
        industry: 'Technology' 
      });
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Lead</h2>
            <p className="text-xs text-slate-400 mt-1">Fill in details for AI Strategic Analysis</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Customer</label>
              <select 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              >
                <option value="">Select a customer</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Deal Value ($)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 5000"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 text-blue-600 flex items-center gap-1">
                Industry <Info size={12} />
              </label>
              <select 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/30"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Source</label>
              <select 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
              <select 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="negotiation">Negotiation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 text-blue-600 flex items-center gap-1">
              Salesperson Notes <Info size={12} />
            </label>
            <textarea 
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/30 placeholder:text-slate-300"
              placeholder="Detail customer pain points, specific requests, or urgency for the AI to analyze..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <p className="mt-1 text-[10px] text-slate-400 italic">
              Pro Tip: The more detail you provide, the better the AI Strategic Summary.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 mt-2 shadow-lg shadow-slate-200"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>Create Lead & Run AI Analysis</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Main Exported Component
 * Wrapped with QueryClientProvider to ensure TanStack Query hooks function correctly.
 */
const AddLeadModal = (props) => {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AddLeadModalContent {...props} />
    </QueryClientProvider>
  );
};

export default AddLeadModal;

// import { useState } from 'react';
// import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
// import { createLead } from '../api/leadApi';
// import { fetchCustomers } from '../api/customerApi';
// import { X } from 'lucide-react';

// const AddLeadModal = ({ isOpen, onClose }) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     customer: '', status: 'new', value: '', source: '', notes: ''
//   });

//   // Get customers for the dropdown
//   const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: fetchCustomers });

//   const mutation = useMutation({
//     mutationFn: createLead,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['leads']);
//       onClose();
//       setFormData({ customer: '', status: 'new', value: '', source: '', notes: '' });
//     },
//   });

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-slate-900">Create New Lead</h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
//         </div>

//         <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer *</label>
//             <select 
//               required
//               className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//               value={formData.customer}
//               onChange={(e) => setFormData({...formData, customer: e.target.value})}
//             >
//               <option value="">-- Choose a Customer --</option>
//               {customers?.map(c => <option key={c._id} value={c._id}>{c.name} ({c.company})</option>)}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Deal Value ($)</label>
//               <input 
//                 type="number" placeholder="5000"
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.value}
//                 onChange={(e) => setFormData({...formData, value: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
//               <input 
//                 type="text" placeholder="LinkedIn, Referral..."
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.source}
//                 onChange={(e) => setFormData({...formData, source: e.target.value})}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
//             <select 
//               className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//               value={formData.status}
//               onChange={(e) => setFormData({...formData, status: e.target.value})}
//             >
//               <option value="new">New</option>
//               <option value="contacted">Contacted</option>
//               <option value="negotiation">Negotiation</option>
//               <option value="won">Won</option>
//               <option value="lost">Lost</option>
//             </select>
//           </div>

//           <button 
//             type="submit" disabled={mutation.isPending}
//             className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
//           >
//             {mutation.isPending ? 'Processing...' : 'Save Lead'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddLeadModal;
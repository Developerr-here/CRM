

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createLead } from '../api/leadApi';
import { fetchCustomers } from '../api/customerApi';
import { X } from 'lucide-react';

const AddLeadModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customer: '', status: 'new', value: '', source: '', notes: ''
  });

  // Get customers for the dropdown
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: fetchCustomers });

  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      onClose();
      setFormData({ customer: '', status: 'new', value: '', source: '', notes: '' });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Create New Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer *</label>
            <select 
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
            >
              <option value="">-- Choose a Customer --</option>
              {customers?.map(c => <option key={c._id} value={c._id}>{c.name} ({c.company})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deal Value ($)</label>
              <input 
                type="number" placeholder="5000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
              <input 
                type="text" placeholder="LinkedIn, Referral..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <button 
            type="submit" disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {mutation.isPending ? 'Processing...' : 'Save Lead'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;


import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createTask } from '../api/taskApi';
import { fetchLeads } from '../api/leadApi';
import { X, Calendar as CalIcon } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    relatedLead: ''
  });

  // Fetch leads to populate the dropdown
  const { data: leads } = useQuery({ queryKey: ['leads'], queryFn: fetchLeads });

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      onClose();
      setFormData({ title: '', description: '', dueDate: '', priority: 'medium', relatedLead: '' });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
            <input 
              required type="text" placeholder="e.g., Send follow-up email"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link to Lead (Optional)</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.relatedLead}
              onChange={(e) => setFormData({...formData, relatedLead: e.target.value})}
            >
              <option value="">No Lead Linked</option>
              {leads?.map(lead => (
                <option key={lead._id} value={lead._id}>
                  {lead.customer?.name} - {lead.status} (${lead.value})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input 
                required type="date"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" disabled={mutation.isPending}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 mt-4 shadow-lg"
          >
            {mutation.isPending ? 'Scheduling...' : 'Add to Calendar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
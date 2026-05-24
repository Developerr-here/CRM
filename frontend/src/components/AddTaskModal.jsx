import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createTask } from '../api/taskApi';
import { fetchLeads } from '../api/leadApi';
import { X, Calendar, Target, Flag, AlignLeft } from 'lucide-react';
 
/**
 * AddTaskModal — create task with optional lead link
 * Logic UNCHANGED. Styling updated.
 */
const AddTaskModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '',
    priority: 'medium', relatedLead: ''
  });
 
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
  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));
 
  const PRIORITY_COLORS = {
    high:   { bg: 'var(--red-bg)',    border: '#FECACA', color: 'var(--red)',    label: 'High' },
    medium: { bg: 'var(--amber-bg)',  border: '#FDE68A', color: '#B45309',       label: 'Medium' },
    low:    { bg: 'var(--sky-bg)',    border: '#BAE6FD', color: 'var(--sky)',    label: 'Low' },
  };
 
  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ maxWidth: 440 }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>New Task</h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Schedule a task and optionally link it to a lead.</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, border: '1.5px solid var(--border)',
              background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)', transition: 'all .15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X size={15} />
          </button>
        </div>
 
        <div className="modal-body" style={{ paddingBottom: 0 }}>
          <form
            id="add-task-form"
            onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Title */}
            <div>
              <label className="form-label">Task Title <span style={{ color: 'var(--red)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <AlignLeft size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  required type="text" className="field" style={{ paddingLeft: 32 }}
                  placeholder="e.g. Send follow-up email"
                  value={formData.title} onChange={set('title')}
                />
              </div>
            </div>
 
            {/* Link to lead */}
            <div>
              <label className="form-label">Link to Lead <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <Target size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select
                  className="field" style={{ paddingLeft: 32, cursor: 'pointer' }}
                  value={formData.relatedLead} onChange={set('relatedLead')}
                >
                  <option value="">No lead linked</option>
                  {leads?.map(lead => (
                    <option key={lead._id} value={lead._id}>
                      {lead.customer?.name} — {lead.status} (${lead.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>
 
            {/* Due date + Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Due Date <span style={{ color: 'var(--red)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    required type="date" className="field" style={{ paddingLeft: 32 }}
                    value={formData.dueDate} onChange={set('dueDate')}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Priority</label>
                {/* Custom priority toggle */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {Object.entries(PRIORITY_COLORS).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: key }))}
                      style={{
                        flex: 1, padding: '7px 0', borderRadius: 8, cursor: 'pointer',
                        fontSize: 11.5, fontWeight: 700,
                        border: `1.5px solid ${formData.priority === key ? val.border : 'var(--border)'}`,
                        background: formData.priority === key ? val.bg : 'transparent',
                        color: formData.priority === key ? val.color : 'var(--text-muted)',
                        transition: 'all .15s'
                      }}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
 
        {/* Footer */}
        <div className="modal-footer" style={{ paddingTop: 16 }}>
          <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button
            type="submit" form="add-task-form"
            disabled={mutation.isPending}
            className="btn btn-dark" style={{ flex: 2 }}
          >
            {mutation.isPending ? 'Scheduling...' : '📅 Add to Calendar'}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default AddTaskModal;








// import { useState } from 'react';
// import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
// import { createTask } from '../api/taskApi';
// import { fetchLeads } from '../api/leadApi';
// import { X, Calendar as CalIcon } from 'lucide-react';

// const AddTaskModal = ({ isOpen, onClose }) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     dueDate: '',
//     priority: 'medium',
//     relatedLead: ''
//   });

//   // Fetch leads to populate the dropdown
//   const { data: leads } = useQuery({ queryKey: ['leads'], queryFn: fetchLeads });

//   const mutation = useMutation({
//     mutationFn: createTask,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks']);
//       onClose();
//       setFormData({ title: '', description: '', dueDate: '', priority: 'medium', relatedLead: '' });
//     },
//   });

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
//             <input 
//               required type="text" placeholder="e.g., Send follow-up email"
//               className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               value={formData.title}
//               onChange={(e) => setFormData({...formData, title: e.target.value})}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Link to Lead (Optional)</label>
//             <select 
//               className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               value={formData.relatedLead}
//               onChange={(e) => setFormData({...formData, relatedLead: e.target.value})}
//             >
//               <option value="">No Lead Linked</option>
//               {leads?.map(lead => (
//                 <option key={lead._id} value={lead._id}>
//                   {lead.customer?.name} - {lead.status} (${lead.value})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
//               <input 
//                 required type="date"
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={formData.dueDate}
//                 onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
//               <select 
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={formData.priority}
//                 onChange={(e) => setFormData({...formData, priority: e.target.value})}
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//           </div>

//           <button 
//             type="submit" disabled={mutation.isPending}
//             className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 mt-4 shadow-lg"
//           >
//             {mutation.isPending ? 'Scheduling...' : 'Add to Calendar'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTaskModal;
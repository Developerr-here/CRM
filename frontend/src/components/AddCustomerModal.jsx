import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomer } from '../api/customerApi';
import { X, User, Mail, Phone, Building2, FileText } from 'lucide-react';
 
/**
 * AddCustomerModal — polished modal form
 * Logic UNCHANGED. Styling uses CSS variables.
 */
const AddCustomerModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', notes: ''
  });
 
  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      onClose();
      setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
    },
  });
 
  if (!isOpen) return null;
 
  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));
 
  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ maxWidth: 460 }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Add Customer</h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Create a new client profile in your workspace.</p>
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
 
        {/* Body */}
        <div className="modal-body" style={{ paddingBottom: 0 }}>
          <form
            id="add-customer-form"
            onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Full name */}
            <div>
              <label className="form-label">Full Name <span style={{ color: 'var(--red)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text" required className="field" style={{ paddingLeft: 32 }}
                  placeholder="Jane Smith"
                  value={formData.name} onChange={set('name')}
                />
              </div>
            </div>
 
            {/* Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email" required className="field" style={{ paddingLeft: 32 }}
                    placeholder="jane@company.com"
                    value={formData.email} onChange={set('email')}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text" className="field" style={{ paddingLeft: 32 }}
                    placeholder="+1 555 0100"
                    value={formData.phone} onChange={set('phone')}
                  />
                </div>
              </div>
            </div>
 
            {/* Company */}
            <div>
              <label className="form-label">Company</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text" className="field" style={{ paddingLeft: 32 }}
                  placeholder="Acme Inc."
                  value={formData.company} onChange={set('company')}
                />
              </div>
            </div>
 
            {/* Notes */}
            <div>
              <label className="form-label">Notes</label>
              <div style={{ position: 'relative' }}>
                <FileText size={14} style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-muted)' }} />
                <textarea
                  className="field" style={{ paddingLeft: 32, resize: 'vertical', minHeight: 72 }}
                  placeholder="Any additional notes..."
                  value={formData.notes} onChange={set('notes')}
                />
              </div>
            </div>
          </form>
        </div>
 
        {/* Footer */}
        <div className="modal-footer" style={{ paddingTop: 16 }}>
          <button
            type="button" onClick={onClose}
            className="btn btn-ghost" style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="submit" form="add-customer-form"
            disabled={mutation.isPending}
            className="btn btn-primary" style={{ flex: 1 }}
          >
            {mutation.isPending ? 'Saving...' : 'Create Customer'}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default AddCustomerModal;









// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createCustomer } from '../api/customerApi';
// import { X } from 'lucide-react';

// const AddCustomerModal = ({ isOpen, onClose }) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     name: '', email: '', phone: '', company: '', notes: ''
//   });

//   const mutation = useMutation({
//     mutationFn: createCustomer,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['customers']); // Refresh the table automatically
//       onClose(); // Close modal
//       setFormData({ name: '', email: '', phone: '', company: '', notes: '' }); // Reset form
//     },
//   });

//   if (!isOpen) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
//         <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
//           <X size={20} />
//         </button>
        
//         <h2 className="text-xl font-bold text-slate-900 mb-1">Add New Customer</h2>
//         <p className="text-sm text-slate-500 mb-6">Enter details to create a new client profile.</p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
//             <input 
//               type="text" required
//               className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
//               <input 
//                 type="email" required
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
//               <input 
//                 type="text"
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
//             <input 
//               type="text"
//               className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               value={formData.company}
//               onChange={(e) => setFormData({...formData, company: e.target.value})}
//             />
//           </div>
          
//           <div className="pt-4 flex gap-3">
//             <button 
//               type="button" onClick={onClose}
//               className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               disabled={mutation.isPending}
//               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md shadow-blue-200 disabled:opacity-50"
//             >
//               {mutation.isPending ? 'Saving...' : 'Create Customer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCustomerModal;
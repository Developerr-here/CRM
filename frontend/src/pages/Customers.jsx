import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCustomers, deleteCustomer } from '../api/customerApi';
import AddCustomerModal from '../components/AddCustomerModal';
import {
  Plus, Search, Mail, Phone, Building2, Trash2,
  Eye, X, User as UserIcon, MoreHorizontal
} from 'lucide-react';
 
/**
 * Customers — filterable table + slide-out detail drawer
 * Logic is UNCHANGED; only markup/styling updated.
 */
const Customers = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedCustomer, setSelected]   = useState(null); // Drawer
 
  const { data: customers, isLoading, isError, error } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });
 
  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      if (selectedCustomer) setSelected(null);
      alert('Customer deleted successfully');
    },
    onError: (err) => alert(err.response?.data?.message || 'Only Admins/Managers can delete'),
  });
 
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) deleteMutation.mutate(id);
  };
 
  const filteredCustomers = customers?.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  if (isError) return (
    <div style={{ padding: 24, background: 'var(--red-bg)', border: '1px solid #FECACA', borderRadius: 'var(--radius-lg)', color: 'var(--red)', fontSize: 14 }}>
      Error loading customers: {error.message}
    </div>
  );
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Manage your client directory and contact details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Customer
        </button>
      </div>
 
      {/* ── Toolbar ── */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap'
      }}>
        <div className="search-bar" style={{ maxWidth: 300 }}>
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <X size={13} />
            </button>
          )}
        </div>
 
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
            background: 'var(--bg-muted)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '4px 10px'
          }}>
            {filteredCustomers?.length ?? 0} {filteredCustomers?.length === 1 ? 'customer' : 'customers'}
          </span>
        </div>
      </div>
 
      {/* ── Table ── */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <div className="spinner" />
          </div>
        ) : filteredCustomers?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><UserIcon size={24} /></div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
              {searchTerm ? 'No results found' : 'No customers yet'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {searchTerm ? 'Try a different search term.' : 'Add your first customer to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers?.map((customer, i) => (
                  <tr key={customer._id} style={{ animationDelay: `${i * .03}s` }} className="animate-fade-in">
                    {/* Customer name + avatar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: `hsl(${customer.name.charCodeAt(0) * 7 % 360} 65% 55%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0
                        }}>
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {customer.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                            #{customer._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
 
                    {/* Company */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 500, color: 'var(--text-secondary)' }}>
                        <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
                        {customer.company || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Individual</span>}
                      </div>
                    </td>
 
                    {/* Contact */}
                    <td>
                      <div style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 3, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Mail size={13} style={{ color: 'var(--text-muted)' }} /> {customer.email}
                        </span>
                        {customer.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Phone size={13} style={{ color: 'var(--text-muted)' }} /> {customer.phone}
                          </span>
                        )}
                      </div>
                    </td>
 
                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                        {/* View detail drawer */}
                        <button
                          onClick={() => setSelected(customer)}
                          style={{
                            width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--border)',
                            background: 'var(--bg-surface)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-muted)', transition: 'all .15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(customer._id, customer.name)}
                          style={{
                            width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--border)',
                            background: 'var(--bg-surface)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-muted)', transition: 'all .15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-bg)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                          title="Delete customer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
 
      {/* ── Customer Detail Drawer ── */}
      {selectedCustomer && (
        <>
          <div className="drawer-overlay" onClick={() => setSelected(null)} />
          <div className="drawer">
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 22px', borderBottom: '1px solid var(--border)'
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Customer Details</h3>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={18} />
              </button>
            </div>
 
            {/* Body */}
            <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `hsl(${selectedCustomer.name.charCodeAt(0) * 7 % 360} 65% 55%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0
                }}>
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCustomer.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>
                    ID #{selectedCustomer._id.slice(-10)}
                  </div>
                </div>
              </div>
 
              {/* Info fields */}
              {[
                { label: 'Email',   icon: <Mail size={14} />,     value: selectedCustomer.email },
                { label: 'Phone',   icon: <Phone size={14} />,    value: selectedCustomer.phone || '—' },
                { label: 'Company', icon: <Building2 size={14} />, value: selectedCustomer.company || 'Individual' },
              ].map(field => (
                <div key={field.label}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
                    {field.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13.5 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{field.icon}</span>
                    {field.value}
                  </div>
                </div>
              ))}
 
              {selectedCustomer.notes && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
                    Notes
                  </div>
                  <div style={{
                    background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)',
                    padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6
                  }}>
                    {selectedCustomer.notes}
                  </div>
                </div>
              )}
 
              {/* Delete action */}
              <button
                onClick={() => handleDelete(selectedCustomer._id, selectedCustomer.name)}
                className="btn"
                style={{
                  background: 'var(--red-bg)', color: 'var(--red)',
                  border: '1.5px solid #FECACA', marginTop: 8
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--red-bg)'; e.currentTarget.style.color = 'var(--red)'; }}
              >
                <Trash2 size={15} /> Delete Customer
              </button>
            </div>
          </div>
        </>
      )}
 
      <AddCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
 
export default Customers;





// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Added useMutation & useQueryClient
// import { fetchCustomers, deleteCustomer } from '../api/customerApi'; // Added deleteCustomer
// import AddCustomerModal from '../components/AddCustomerModal';
// import { 
//   Plus, 
//   Search, 
//   MoreVertical, 
//   Mail, 
//   Phone, 
//   Building2, 
//   User as UserIcon,
//   Filter,
//   Trash2 // Added Trash2 icon
// } from 'lucide-react';

// const Customers = () => {
//   const queryClient = useQueryClient();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // --- 1. Fetch Logic ---
//   const { data: customers, isLoading, isError, error } = useQuery({
//     queryKey: ['customers'],
//     queryFn: fetchCustomers,
//   });

//   // --- 2. Delete Logic ---
//   const deleteMutation = useMutation({
//     mutationFn: deleteCustomer,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['customers']);
//       alert("Customer deleted successfully");
//     },
//     onError: (error) => {
//       alert(error.response?.data?.message || "Only Admins/Managers can delete");
//     }
//   });

//   const handleDelete = (id, name) => {
//     if (window.confirm(`Are you sure you want to delete ${name}?`)) {
//       deleteMutation.mutate(id);
//     }
//   };

//   // --- 3. Filter Logic ---
//   const filteredCustomers = customers?.filter(customer =>
//     customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (isError) return (
//     <div className="p-8 text-red-500 bg-red-50 rounded-lg border border-red-200">
//       Error loading customers: {error.message}
//     </div>
//   );

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
//           <p className="text-slate-500 text-sm">Manage your client directory and contact details.</p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-200 active:scale-95"
//         >
//           <Plus size={18} />
//           Add Customer
//         </button>
//       </div>

//       {/* Search & Filter Bar */}
//       <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
//         <div className="relative w-full md:w-1/3">
//           <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search..." 
//             className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
//             Total: <span className="text-slate-900">{filteredCustomers?.length || 0}</span>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//         {isLoading ? (
//           <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-200">
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredCustomers?.map((customer) => (
//                   <tr key={customer._id} className="hover:bg-blue-50/30 transition-colors group">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
//                           {customer.name.charAt(0)}
//                         </div>
//                         <div>
//                           <div className="font-bold text-slate-900">{customer.name}</div>
//                           <div className="text-[10px] text-slate-400">ID: {customer._id.slice(-6)}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2 text-slate-700 font-medium">
//                         <Building2 size={16} className="text-slate-400" />
//                         {customer.company || 'Individual'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-slate-600">
//                         <div className="flex items-center gap-1"><Mail size={14}/> {customer.email}</div>
//                         {customer.phone && <div className="flex items-center gap-1"><Phone size={14}/> {customer.phone}</div>}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex justify-end gap-1">
//                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
//                           <MoreVertical size={18} />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(customer._id, customer.name)}
//                           className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <AddCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   );
// };

// export default Customers;
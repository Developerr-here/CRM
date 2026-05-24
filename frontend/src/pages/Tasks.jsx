import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTask } from '../api/taskApi';
import AddTaskModal from '../components/AddTaskModal';
import api from '../api/axios';
import {
  CheckCircle2, Circle, Calendar, Clock,
  Plus, Trash2, ChevronRight, AlertCircle
} from 'lucide-react';
 
/**
 * Tasks — to-do list with toggle + delete
 * Logic UNCHANGED; markup/styling fully updated.
 */
const Tasks = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter]           = useState('all'); // 'all' | 'pending' | 'completed'
 
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
 
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });
 
  const deleteMutation = useMutation({
    mutationFn: async (id) => { await api.delete(`/tasks/${id}`); },
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });
 
  const PRIORITY = {
    high:   { cls: 'priority-high',   label: 'High' },
    medium: { cls: 'priority-medium', label: 'Med' },
    low:    { cls: 'priority-low',    label: 'Low' },
  };
 
  const displayed = tasks?.filter(t =>
    filter === 'all'       ? true :
    filter === 'pending'   ? t.status !== 'completed' :
    t.status === 'completed'
  );
 
  const pendingCount = tasks?.filter(t => t.status !== 'completed').length ?? 0;
 
  if (isError) return (
    <div style={{ padding: 20, background: 'var(--red-bg)', borderRadius: 'var(--radius-lg)', color: 'var(--red)', fontSize: 14 }}>
      Error loading tasks.
    </div>
  );
 
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Header card ── */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
            {pendingCount > 0 ? (
              <><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{pendingCount}</span> task{pendingCount !== 1 ? 's' : ''} remaining</>
            ) : (
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>All caught up! 🎉</span>
            )}
          </p>
        </div>
        <button className="btn btn-dark" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Task
        </button>
      </div>
 
      {/* ── Filter tabs ── */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { key: 'all',       label: 'All',       count: tasks?.length },
          { key: 'pending',   label: 'Pending',   count: pendingCount },
          { key: 'completed', label: 'Completed', count: tasks?.filter(t => t.status === 'completed').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              fontSize: 12.5, fontWeight: 600, padding: '6px 14px',
              borderRadius: 99, cursor: 'pointer',
              border: filter === tab.key ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
              background: filter === tab.key ? 'var(--accent-light)' : 'var(--bg-surface)',
              color: filter === tab.key ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all .15s'
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{ marginLeft: 6, fontSize: 11, opacity: .8 }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>
 
      {/* ── Task list ── */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" />
        </div>
      ) : displayed?.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--bg-surface)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-xl)' }}>
          <div className="empty-icon"><Clock size={24} /></div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>No tasks here</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {filter === 'completed' ? "You haven't completed any tasks yet." : "Add a task to get started."}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {displayed?.map((task, i) => {
            const done = task.status === 'completed';
            const isOverdue = !done && new Date(task.dueDate) < new Date();
            return (
              <div
                key={task._id}
                className={`task-item ${done ? 'completed' : ''}`}
                style={{ animationDelay: `${i * .03}s` }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleMutation.mutate({
                    id: task._id,
                    status: done ? 'pending' : 'completed'
                  })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0, transition: 'transform .15s' }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {done ? (
                    <CheckCircle2 size={22} style={{ color: 'var(--green)' }} />
                  ) : (
                    <Circle size={22} style={{ color: 'var(--border-strong)' }} />
                  )}
                </button>
 
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 14, fontWeight: 600,
                      color: done ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: done ? 'line-through' : 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {task.title}
                    </span>
                    {/* Priority badge */}
                    <span className={`badge ${PRIORITY[task.priority]?.cls || ''}`} style={{ fontSize: 10 }}>
                      {PRIORITY[task.priority]?.label || task.priority}
                    </span>
                    {/* Overdue */}
                    {isOverdue && (
                      <span className="badge" style={{ background: 'var(--red-bg)', color: 'var(--red)', borderColor: '#FECACA', fontSize: 10 }}>
                        <AlertCircle size={9} /> Overdue
                      </span>
                    )}
                  </div>
 
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: isOverdue ? 'var(--red)' : 'var(--text-muted)', fontWeight: 500 }}>
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {task.relatedLead && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        fontSize: 11.5, fontWeight: 600, color: 'var(--accent)',
                        background: 'var(--accent-light)', border: '1px solid rgba(79,110,247,.15)',
                        borderRadius: 6, padding: '2px 7px'
                      }}>
                        <ChevronRight size={11} />
                        {task.relatedLead.customer?.name}
                      </span>
                    )}
                  </div>
                </div>
 
                {/* Delete (visible on hover via group) */}
                <button
                  onClick={() => { if (window.confirm('Delete this task?')) deleteMutation.mutate(task._id); }}
                  style={{
                    width: 30, height: 30, borderRadius: 7, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', opacity: 0, transition: 'all .15s',
                    flexShrink: 0
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-bg)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0'; }}
                  className="task-delete-btn"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
 
      {/* Make delete btn visible on parent hover via JS approach */}
      <style>{`
        .task-item:hover .task-delete-btn { opacity: 1 !important; }
      `}</style>
 
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
 
export default Tasks;




// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchTasks, updateTask } from '../api/taskApi';
// import AddTaskModal from '../components/AddTaskModal';
// import api from '../api/axios'; // For the delete call
// import { 
//   CheckCircle2, 
//   Circle, 
//   Calendar, 
//   Clock, 
//   Plus, 
//   Trash2, 
//   AlertCircle,
//   ChevronRight,
// } from 'lucide-react';

// const Tasks = () => {
//   const queryClient = useQueryClient();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // --- 1. Fetch Tasks ---
//   const { data: tasks, isLoading, isError } = useQuery({
//     queryKey: ['tasks'],
//     queryFn: fetchTasks,
//   });

//   // --- 2. Toggle Completion Mutation ---
//   const toggleMutation = useMutation({
//     mutationFn: ({ id, status }) => updateTask(id, { status }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks']);
//     },
//   });

//   // --- 3. Delete Task Mutation ---
//   const deleteMutation = useMutation({
//     mutationFn: async (id) => {
//       await api.delete(`/tasks/${id}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks']);
//     },
//   });

//   const getPriorityStyle = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-700 border-red-200';
//       case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
//       default: return 'bg-blue-100 text-blue-700 border-blue-200';
//     }
//   };

//   if (isError) return <div className="p-8 text-red-500">Error loading tasks. Please try again.</div>;

//   return (
//     <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Tasks</h1>
//           <p className="text-slate-500 text-sm font-medium">
//   You have <span className="text-blue-600">{(tasks || []).filter(t => t.status !== 'completed').length}</span> pending items
// </p>
//         </div>
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
//         >
//           <Plus size={18} />
//           New Task
//         </button>
//       </div>

//       {/* Task List */}
//       <div className="space-y-3">
//         {isLoading ? (
//           <div className="p-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div></div>
//         ) : tasks?.length > 0 ? (
//           tasks.map((task) => (
//             <div 
//               key={task._id} 
//               className={`group relative bg-white p-4 rounded-2xl border transition-all flex items-center gap-4 ${
//                 task.status === 'completed' 
//                 ? 'border-slate-100 bg-slate-50/50' 
//                 : 'border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md'
//               }`}
//             >
//               {/* Custom Checkbox */}
//               <button 
//                 onClick={() => toggleMutation.mutate({ 
//                   id: task._id, 
//                   status: task.status === 'completed' ? 'pending' : 'completed' 
//                 })}
//                 className="transition-transform active:scale-125"
//               >
//                 {task.status === 'completed' ? (
//                   <CheckCircle2 className="text-green-500 fill-green-50" size={26} />
//                 ) : (
//                   <Circle className="text-slate-300 hover:text-blue-500" size={26} />
//                 )}
//               </button>

//               {/* Task Details */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <h3 className={`font-bold truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
//                     {task.title}
//                   </h3>
//                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getPriorityStyle(task.priority)}`}>
//                     {task.priority.toUpperCase()}
//                   </span>
//                 </div>
                
//                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                   <span className="text-xs text-slate-500 flex items-center gap-1">
//                     <Calendar size={13} className="text-slate-400" />
//                     {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                   </span>
                  
//                   {task.relatedLead && (
//                     <div className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
//                       <ChevronRight size={12} />
//                       Lead: {task.relatedLead.customer?.name}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Actions Toggleable on Hover */}
//               <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
//                 <button 
//                   onClick={() => { if(window.confirm('Delete this task?')) deleteMutation.mutate(task._id) }}
//                   className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//             <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
//               <Clock className="text-slate-300" size={32} />
//             </div>
//             <h3 className="text-slate-900 font-bold">All caught up!</h3>
//             <p className="text-slate-500 text-sm">No tasks scheduled for today. Take a break!</p>
//           </div>
//         )}
//       </div>

//       {/* Modal Integration */}
//       <AddTaskModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//       />
//     </div>
//   );
// };

// export default Tasks;
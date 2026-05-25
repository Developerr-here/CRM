import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTask } from '../api/taskApi';
import AddTaskModal from '../components/AddTaskModal';
import api from '../api/axios'; // For the delete call
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

const Tasks = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. Fetch Tasks ---
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // --- 2. Toggle Completion Mutation ---
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // --- 3. Delete Task Mutation ---
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (isError) return <div className="p-8 text-red-500">Error loading tasks. Please try again.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Tasks</h1>
          <p className="text-slate-500 text-sm font-medium">
  You have <span className="text-blue-600">{(tasks || []).filter(t => t.status !== 'completed').length}</span> pending items
</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div></div>
        ) : tasks?.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task._id} 
              className={`group relative bg-white p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                task.status === 'completed' 
                ? 'border-slate-100 bg-slate-50/50' 
                : 'border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md'
              }`}
            >
              {/* Custom Checkbox */}
              <button 
                onClick={() => toggleMutation.mutate({ 
                  id: task._id, 
                  status: task.status === 'completed' ? 'pending' : 'completed' 
                })}
                className="transition-transform active:scale-125"
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="text-green-500 fill-green-50" size={26} />
                ) : (
                  <Circle className="text-slate-300 hover:text-blue-500" size={26} />
                )}
              </button>

              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getPriorityStyle(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  
                  {task.relatedLead && (
                    <div className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      <ChevronRight size={12} />
                      Lead: {task.relatedLead.customer?.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Toggleable on Hover */}
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                <button 
                  onClick={() => { if(window.confirm('Delete this task?')) deleteMutation.mutate(task._id) }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Clock className="text-slate-300" size={32} />
            </div>
            <h3 className="text-slate-900 font-bold">All caught up!</h3>
            <p className="text-slate-500 text-sm">No tasks scheduled for today. Take a break!</p>
          </div>
        )}
      </div>

      {/* Modal Integration */}
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Tasks;
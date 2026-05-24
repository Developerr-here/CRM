








import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { User, Mail, Lock, Building2, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    organization: '' // The unique ID for the SaaS Tenant
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // This hits your POST /api/auth/register endpoint
      const response = await api.post('/auth/register', formData);
      
      // Update Zustand store and navigate to Dashboard
      setUser(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl mb-4 shadow-lg shadow-blue-200">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Start Your SaaS</h2>
          <p className="text-slate-500 mt-2 text-sm">Create a private, secure environment for your team.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <div className="w-1 h-1 bg-red-600 rounded-full" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Company/Organization Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 text-slate-400 size-5" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="e.g. Nexus Tech"
                value={formData.organization} 
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Admin Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400 size-5" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="Full Name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 size-5" />
              <input 
                type="email" required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="name@company.com"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 size-5" />
              <input 
                type="password" required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-70 mt-6 group"
          >
            {loading ? 'Initializing...' : 'Create My Environment'} 
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
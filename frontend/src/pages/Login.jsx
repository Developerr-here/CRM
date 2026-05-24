import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { Lock, Mail, Zap, ArrowRight } from 'lucide-react';
 
/**
 * Login — clean, centered card on soft bg
 * - Logo mark top-center
 * - Bordered inputs with focus glow
 * - Primary CTA with arrow icon
 */
const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate  = useNavigate();
  const { setUser } = useAuthStore();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      /* Subtle grid pattern bg */
      backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
      backgroundSize: '28px 28px'
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xl)',
        padding: '36px 32px',
        animation: 'scaleIn .25s both'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(79,110,247,.35)',
            marginBottom: 14
          }}>
            <Zap size={22} fill="white" color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.02em' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Sign in to your CRM workspace
          </p>
        </div>
 
        {/* Error */}
        {error && (
          <div style={{
            background: 'var(--red-bg)', border: '1px solid #FECACA',
            color: 'var(--red)', borderRadius: 'var(--radius-md)',
            padding: '10px 14px', fontSize: 13, marginBottom: 18,
            display: 'flex', gap: 8, alignItems: 'center'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
            {error}
          </div>
        )}
 
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label className="form-label">Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" required
                className="field"
                style={{ paddingLeft: 36 }}
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
 
          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Forgot?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password" required
                className="field"
                style={{ paddingLeft: 36 }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px 18px', marginTop: 4, fontSize: 14, borderRadius: 'var(--radius-md)' }}
          >
            {loading ? 'Signing in...' : (
              <>Sign In <ArrowRight size={15} /></>
            )}
          </button>
        </form>
 
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Create workspace
          </Link>
        </div>
      </div>
    </div>
  );
};
 
export default Login;







// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import useAuthStore from '../store/useAuthStore';
// import { Lock, Mail } from 'lucide-react'; // Icons
// import {Link} from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { setUser } = useAuthStore();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       setUser(response.data); // Save to Zustand + LocalStorage
//       navigate('/'); // Go to Dashboard
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-slate-900">CRM Login</h2>
//           <p className="text-slate-500 mt-2">Enter your credentials to manage leads</p>
//         </div>

//         {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 text-slate-400 size-5" />
//               <input 
//                 type="email" required
//                 className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="admin@crm.com"
//                 value={email} onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 text-slate-400 size-5" />
//               <input 
//                 type="password" required
//                 className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="••••••••"
//                 value={password} onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-lg shadow-blue-200">
//             Sign In
//           </button>

//           <div className="mt-6 text-center">
//   <p className="text-sm text-slate-500">
//     Don't have an account yet?{' '}
//     <Link 
//       to="/register" 
//       className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
//     >
//       Create an account
//     </Link>
//   </p>
// </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
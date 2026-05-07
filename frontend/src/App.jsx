import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Login from './pages/Login';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import { useEffect } from 'react';


function App() {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show a loading spinner so the user doesn't see the Login page for 1 second
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        {/* All internal routes go inside the Layout */}
        <Route element={user ? <Layout /> : <Navigate to="/register" />}>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/leads" element={<Leads />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/customers" element={<Customers />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? "/" : "/register"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
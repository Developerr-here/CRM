import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true, // This stops the "checkAuth is not a function" crash

  // Function to manually set user after login/register
  setUser: (user) => {
    if (user?.token) {
      localStorage.setItem('token', user.token);
    }
    set({ user, isCheckingAuth: false });
  },

  // THE MISSING FUNCTION:
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isCheckingAuth: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('token');
      set({ user: null });
    }
  },
}));

export default useAuthStore;
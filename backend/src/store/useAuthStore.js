import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true, // New state to prevent flickering

  setUser: (user) => set({ user, isCheckingAuth: false }),

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
    }
  },

  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null });
  },
}));

export default useAuthStore;
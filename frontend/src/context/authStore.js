import { create } from 'zustand';
import { authService } from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.signup(data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({ user: response.data.user, token: response.data.token });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Signup failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({ user: response.data.user, token: response.data.token });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Login failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

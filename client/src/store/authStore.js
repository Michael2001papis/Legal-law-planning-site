import { create } from 'zustand';
import { authApi } from '../services/api';

const stored = () => {
  try {
    const t = localStorage.getItem('accessToken');
    const u = localStorage.getItem('user');
    if (t && u) return { accessToken: t, user: JSON.parse(u) };
  } catch (_) {}
  return { accessToken: null, user: null };
};

export const useAuth = create((set, get) => ({
  ...stored(),
  setAuth: (user, accessToken) => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    set({ user, accessToken });
  },
  logout: async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null });
  },
  refreshUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

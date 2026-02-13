import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';

const AUTH_KEY = 'mp-auth';

export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => {
        set({ user, accessToken });
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (user) localStorage.setItem('user', JSON.stringify(user));
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
      refreshUser: (user) => set({ user }),
    }),
    {
      name: AUTH_KEY,
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      storage: {
        getItem: (name) => {
          try {
            const t = localStorage.getItem('accessToken');
            const u = localStorage.getItem('user');
            if (t && u) {
              return JSON.stringify({ state: { user: JSON.parse(u), accessToken: t }, version: 1 });
            }
            return null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const { state } = JSON.parse(value);
          if (state.accessToken) localStorage.setItem('accessToken', state.accessToken);
          if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
        },
        removeItem: () => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        },
      },
    }
  )
);

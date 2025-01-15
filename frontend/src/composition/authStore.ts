import { defineStore } from 'pinia';
import type { IUser } from '@shared/crudTypes';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as IUser | null,
    token: localStorage.getItem('token') as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setUser(user: IUser) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    updateUserData(updatedUser: Partial<IUser>) {
      if (this.user) {
        this.user = { ...this.user, ...updatedUser }; // Fusionne les nouvelles données
        localStorage.setItem('user', JSON.stringify(this.user)); // Met à jour le stockage local
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    deleteUser() {
      this.logout(); // Réutilise l'action logout
    },
  },
});

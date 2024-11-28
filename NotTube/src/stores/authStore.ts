import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    accessToken: '',
    refreshToken: '',
  }),
  actions: {
    setAuthData(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
    },
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.isAuthenticated = false;
    },
  },
});

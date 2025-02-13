import { api } from './api';

export const authService = {
  async login(username: string, password: string, remember_me: boolean) {
    return await api.post('/login', { username, password, remember_me }, false);
  },

  async verifyToken(token: string) {
    return await api.get(`/verify?token=${token}`);
  },
};

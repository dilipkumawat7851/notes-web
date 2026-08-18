import { mockUser } from '../data/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await delay(500);
    if (email && password) {
      const token = 'mock-jwt-token-xyz-123';
      localStorage.setItem('notesweb_token', token);
      return { user: mockUser, token };
    }
    throw new Error('Invalid credentials');
  },

  register: async (data) => {
    await delay(500);
    const token = 'mock-jwt-token-xyz-123';
    localStorage.setItem('notesweb_token', token);
    return { user: { ...mockUser, name: data.name, email: data.email }, token };
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem('notesweb_token');
  },

  getCurrentUser: async () => {
    await delay(300);
    const token = localStorage.getItem('notesweb_token');
    if (token) {
      return mockUser;
    }
    return null;
  },

  forgotPassword: async (email) => {
    await delay(800);
    return { message: 'Password reset link has been sent to your email.' };
  }
};

export default authService;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('notesweb_token');
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        } catch {
          localStorage.removeItem('notesweb_token');
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('notesweb_token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    navigate('/');
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    localStorage.setItem('notesweb_token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    navigate('/');
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('notesweb_token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    // In a real app, you'd also save to backend/localStorage
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

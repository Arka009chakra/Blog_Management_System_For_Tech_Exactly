import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const restore = async () => {
      let token = localStorage.getItem('accessToken');

      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (_) {
          token = null;
        }
      }

      if (!token) {
        try {
          const { data } = await api.post('/auth/refresh');
          localStorage.setItem('accessToken', data.accessToken);
          setUser(data.user);
        } catch (_) {
          localStorage.removeItem('accessToken');
        }
      }

      setLoading(false);
    };
    restore();
    const expired = () => setUser(null);
    window.addEventListener('auth:expired', expired);
    return () => window.removeEventListener('auth:expired', expired);
  }, []);
  const login = async (form) => {
    const { data } = await api.post('/auth/login', form);
    localStorage.setItem('accessToken', data.accessToken); setUser(data.user);
  };
  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('accessToken', data.accessToken); setUser(data.user);
  };
  const logout = async () => {
    try { await api.post('/auth/logout'); } finally { localStorage.removeItem('accessToken'); setUser(null); }
  };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

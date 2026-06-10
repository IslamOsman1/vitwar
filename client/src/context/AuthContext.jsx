import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/api.js';
import { removePushSubscription } from '../utils/pushNotifications.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const refreshProfile = async () => {
    const { data } = await api.get('/auth/profile');
    if (data?.role !== 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    throw new Error('Customer accounts are disabled');
  };

  const adminLogin = async (username, password) => {
    const { data } = await api.post('/auth/admin-login', { username, password });
    saveSession(data);
    toast.success('تم تسجيل الدخول إلى لوحة التحكم');
  };

  const register = async (payload) => {
    throw new Error('Customer accounts are disabled');
  };

  const googleLogin = async (credential) => {
    throw new Error('Customer accounts are disabled');
  };

  const setManualPassword = async (password) => {
    throw new Error('Customer accounts are disabled');
  };

  const logout = () => {
    removePushSubscription().catch(() => undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    toast.success('تم تسجيل الخروج');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      setUser(null);
      return;
    }

    refreshProfile().catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, register, googleLogin, setManualPassword, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

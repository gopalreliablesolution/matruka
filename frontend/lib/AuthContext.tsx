'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { adminApi } from './api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'content_manager';
  avatar?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token =
      Cookies.get('matruka_admin_token') ||
      (typeof window !== 'undefined' ? localStorage.getItem('matruka_admin_token') : null);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await adminApi.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
        Cookies.remove('matruka_admin_token');
        if (typeof window !== 'undefined') localStorage.removeItem('matruka_admin_token');
      }
    } catch {
      setUser(null);
      Cookies.remove('matruka_admin_token');
      if (typeof window !== 'undefined') localStorage.removeItem('matruka_admin_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await adminApi.post('/auth/login', { email, password });
      if (res.data.success) {
        const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
        Cookies.set('matruka_admin_token', res.data.token, {
          expires: 7,
          sameSite: 'lax',
          secure: isHttps,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('matruka_admin_token', res.data.token);
        }
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.data.error || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Invalid credentials or network error',
      };
    }
  };

  const logout = async () => {
    try {
      await adminApi.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      Cookies.remove('matruka_admin_token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('matruka_admin_token');
      }
      setUser(null);
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isSuperAdmin: user?.role === 'super_admin',
        isAdmin: user?.role === 'super_admin' || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


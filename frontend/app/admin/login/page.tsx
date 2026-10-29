'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@matruka.in');
  const [password, setPassword] = useState('Admin@Matruka2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        const errorMsg = res.error || 'Login failed. Please check your credentials.';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      toast.success('Signed in successfully');
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient background glows - Jogi Style */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-teal-500/20">
        {/* Brand Header with Authentic Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="p-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 shadow-sm inline-flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Matruka - Complete Care for Her"
                width={190}
                height={55}
                className="max-h-12 w-auto object-contain"
                priority
              />
            </div>
          </div>
          <p className="text-primary font-bold uppercase tracking-widest text-[11px] mt-2">
            Hospital Administration Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-6 text-xs sm:text-sm font-medium border border-red-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@matruka.in"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm text-gray-900 bg-gray-50/50 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm text-gray-900 bg-gray-50/50 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>Keep me signed in</span>
            </label>
            <span className="text-gray-400">Strictly Authorized Personnel</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Reminder */}
        <div className="mt-6 p-3 rounded-xl bg-teal-50 border border-teal-100 text-[11px] text-teal-800">
          <p className="font-semibold text-primary mb-0.5">Default System Credentials:</p>
          <p>
            Email: <code className="font-bold">admin@matruka.in</code>
          </p>
          <p>
            Password: <code className="font-bold">Admin@Matruka2026</code>
          </p>
        </div>

        <p className="text-center mt-6 text-gray-400 text-xs font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Protected & Encrypted Local Server Access</span>
        </p>
      </div>
    </div>
  );
}

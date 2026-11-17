'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import {
  LockKeyhole,
  Mail,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CalendarCheck,
  FileCheck2,
  Activity,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (!response.success) {
        const errorMessage =
          response.error || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        toast.error(errorMessage);
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
    <main className="h-screen max-h-screen overflow-hidden bg-[#F5F7F8] font-sans select-none">
      <div className="grid h-full lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left Side: Branding & Features */}
        <section className="relative hidden h-full overflow-hidden bg-primary px-8 py-6 text-white lg:flex lg:flex-col justify-between xl:px-12 xl:py-8">
          <div
            className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-white/[0.07]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-36 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#32BDC8]/20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-20 top-1/3 h-52 w-52 rounded-full border border-white/10"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Image
                src="/logo-white.png"
                alt="MatruKa - Complete Care for Her"
                width={160}
                height={45}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/85">
              <ShieldCheck size={13} />
              Secure workspace
            </span>
          </div>

          <div className="relative z-10 max-w-xl py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">
              MatruKa Administration
            </p>
            <h1 className="mt-2 font-heading text-2xl font-bold leading-tight tracking-tight xl:text-3xl">
              Complete care starts with confident management.
            </h1>
            <p className="mt-2.5 max-w-lg text-xs leading-relaxed text-white/75 xl:text-sm">
              A secure, centralized workspace for patient consultations, clinical
              content, hospital information, and every update on the MatruKa
              website.
            </p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  icon: CalendarCheck,
                  title: 'Patient enquiries',
                  text: 'Review and progress consultation requests.',
                },
                {
                  icon: FileCheck2,
                  title: 'Clinical content',
                  text: 'Keep services, doctors, and guides accurate.',
                },
                {
                  icon: Activity,
                  title: 'System visibility',
                  text: 'Monitor content and API health in real time.',
                },
                {
                  icon: Globe,
                  title: 'Website control',
                  text: 'Publish updates without developer delays.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm"
                >
                  <feature.icon size={16} className="text-white/90" />
                  <p className="mt-2 text-xs font-bold">{feature.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/60">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
            <span>Complete Care for Her</span>
            <span>Authorized personnel only</span>
          </div>
        </section>

        {/* Right Side: Login Form (Completely non-scrollable on desktop) */}
        <section className="flex h-full items-center justify-center overflow-y-auto px-6 py-6 sm:px-10 lg:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-full max-w-[25rem]">
            {/* Mobile Logo */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="MatruKa"
                  width={130}
                  height={40}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>
              <Link
                href="/"
                className="text-xs font-semibold text-primary transition hover:text-primary-dark"
              >
                Back to website
              </Link>
            </div>

            <div className="mb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LockKeyhole size={19} />
              </span>
              <h2 className="mt-3.5 font-heading text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Sign in to manage the MatruKa hospital website and patient
                enquiry workflow.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-red-700"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Admin email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@matruka.in"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 !pl-11 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-xs outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <LockKeyhole size={18} />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 !pl-11 !pr-11 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-xs outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-0.5">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
                  <ShieldCheck size={13} className="text-primary" />
                  <span>Encrypted access</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition-all hover:bg-primary-dark active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3.5 text-[11px] font-medium text-gray-400">
              <span>MatruKa CMS · Secure Admin</span>
              <Link
                href="/"
                className="font-semibold text-primary transition hover:text-primary-dark"
              >
                Return to website
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

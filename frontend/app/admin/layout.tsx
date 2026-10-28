'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/admin/Sidebar';
import { Loader2 } from 'lucide-react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
    if (!loading && user && isLoginPage) {
      router.push('/admin');
    }
  }, [user, loading, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="w-full min-h-screen bg-[#F8FAFB]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-white font-bold tracking-widest text-xs uppercase">
          Matruka Admin
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex bg-[#F8FAFB] min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 md:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}

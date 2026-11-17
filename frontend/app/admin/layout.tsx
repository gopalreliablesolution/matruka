'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Loader2 } from 'lucide-react';
import './admin.css';

const ADMIN_ROUTES: Array<{ prefix: string; title: string }> = [
  { prefix: '/admin/appointments', title: 'Patient Consultations' },
  { prefix: '/admin/videos', title: 'Video Library' },
  { prefix: '/admin/hospital-locations', title: 'Hospital Locations & Contact' },
  { prefix: '/admin/newsletter', title: 'Newsletter Subscribers' },
  { prefix: '/admin/banners', title: 'Banners & Hero Sliders' },
  { prefix: '/admin/faqs', title: 'Clinical FAQs' },
  { prefix: '/admin/gallery', title: 'Photo Gallery' },
  { prefix: '/admin/blogs', title: 'Blog & Guides' },
  { prefix: '/admin/doctors', title: 'Doctors & Credentials' },
  { prefix: '/admin/services', title: 'Clinical Specialities' },
  { prefix: '/admin/facilities', title: 'Facilities & Infrastructure' },
  { prefix: '/admin/homepage', title: 'Homepage Sections' },
  { prefix: '/admin/menus', title: 'Header & Footer Menus' },
  { prefix: '/admin/pages', title: 'Dynamic Pages' },
  { prefix: '/admin/media', title: 'Media Library' },
  { prefix: '/admin/settings', title: 'Hospital Settings' },
  { prefix: '/admin/users', title: 'Admin Users & Roles' },
  { prefix: '/admin/activity-logs', title: 'Activity Audit Logs' },
  { prefix: '/admin/backup', title: 'System & Database' },
];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  const pageTitle = useMemo(() => {
    if (pathname === '/admin' || pathname === '/admin/') return 'Dashboard';
    return (
      ADMIN_ROUTES.find(
        (route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)
      )?.title || 'Administration'
    );
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
    if (!loading && user && isLoginPage) {
      router.push('/admin');
    }
  }, [user, loading, isLoginPage, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <div className="w-full h-screen overflow-hidden bg-[#F5F7F8]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary text-white">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/85">
          MatruKa Admin
        </p>
        <p className="mt-2 text-xs text-white/55">Securing your workspace</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="admin-shell min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0 lg:pl-64">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          title={pageTitle}
          subtitle="MatruKa CMS administration"
        />

        <main className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          <div className="admin-page">{children}</div>
        </main>
      </div>
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

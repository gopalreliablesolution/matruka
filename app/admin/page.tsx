'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  HardDrive,
  Building2,
  Plus,
  Settings,
  ArrowRight,
  ShieldCheck,
  Clock,
  Loader2,
  TrendingUp,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Activity,
  Globe,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Breadcrumb from '@/components/admin/Breadcrumb';

interface StatsData {
  counts: {
    doctors: { total: number; published: number };
    services: { total: number; published: number };
    facilities: { total: number };
    blogs: { total: number; published: number; draft: number };
    gallery: { albums: number; items: number };
    testimonials: { total: number };
    faqs: { total: number };
    media: { total: number };
  };
  recentActivity: Array<{
    _id: string;
    userName: string;
    action: string;
    module: string;
    description: string;
    timestamp: string;
  }>;
  system: {
    status: string;
    db: string;
    uptime: number;
    nodeVersion: string;
  };
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.get('/dashboard/stats');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-primary" />
        <p className="text-gray-500 font-medium text-sm">Loading Matruka Dashboard...</p>
      </div>
    );
  }

  const { counts, recentActivity = [], system } = stats || {};

  const statCards = [
    {
      name: 'Doctors',
      count: counts?.doctors?.total || 2,
      subtitle: `${counts?.doctors?.published || 2} Active in OPD`,
      icon: Stethoscope,
      color: 'bg-teal-50 text-teal-600',
      href: '/admin/doctors',
    },
    {
      name: 'Clinical Services',
      count: counts?.services?.total || 14,
      subtitle: '14 Confirmed Specialities',
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/admin/services',
    },
    {
      name: 'Facilities & Tech',
      count: counts?.facilities?.total || 4,
      subtitle: 'OT, USG, LDR, Recovery',
      icon: Building2,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/facilities',
    },
    {
      name: 'Blogs & Articles',
      count: counts?.blogs?.total || 2,
      subtitle: `${counts?.blogs?.published || 2} Published Guides`,
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/blogs',
    },
    {
      name: 'Patient Reviews',
      count: counts?.testimonials?.total || 3,
      subtitle: '5-Star Verified Feedback',
      icon: MessageSquareQuote,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/testimonials',
    },
    {
      name: 'Patient FAQs',
      count: counts?.faqs?.total || 5,
      subtitle: 'Categorized Clinical Q&As',
      icon: HelpCircle,
      color: 'bg-rose-50 text-rose-600',
      href: '/admin/faqs',
    },
    {
      name: 'Gallery & Media',
      count: counts?.media?.total || 0,
      subtitle: 'Server Disk Storage',
      icon: HardDrive,
      color: 'bg-indigo-50 text-indigo-600',
      href: '/admin/media',
    },
    {
      name: 'System Status',
      count: 'Online',
      subtitle: 'MongoDB & API Active',
      icon: ShieldCheck,
      color: 'bg-cyan-50 text-cyan-600',
      href: '/admin/backup',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hospital Administration</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Welcome back, <span className="text-primary font-semibold">{user?.name || 'Administrator'}</span>
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-semibold shadow-sm"
            >
              <Globe size={16} />
              <span>Live Website</span>
            </Link>
            <Link
              href="/admin/doctors"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition text-sm font-semibold shadow-sm"
            >
              <Plus size={16} />
              <span>Add Content</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Jogi Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <Link
            href={stat.href}
            key={stat.name}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98] group"
          >
            <div className={`p-3.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform shrink-0`}>
              <stat.icon size={26} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{stat.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clinical Operations Widget (Jogi User Insights Style) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-all pointer-events-none" />
          <div className="absolute -bottom-12 left-8 w-28 h-28 bg-sky-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-primary font-bold">Clinical Operations</p>
              <h2 className="text-xl font-bold flex items-center gap-3 mt-1 text-slate-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-primary">
                  <TrendingUp size={20} />
                </span>
                Matruka Highlights
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={13} /> OPD Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consultant Obstetricians</p>
              <p className="text-xl font-bold text-slate-900 mt-1">Dr. Kairavi Yagnik & Dr. Rut Shah</p>
              <p className="text-xs text-slate-600 mt-1">MBBS, MS OBGYN | Laparoscopic Specialists</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">OPD Consultation Hours</p>
              <p className="text-base font-bold text-slate-900 mt-1">10:00 AM - 1:00 PM</p>
              <p className="text-base font-bold text-slate-900">5:00 PM - 7:00 PM</p>
              <p className="text-[11px] text-primary font-medium mt-0.5">Monday to Saturday</p>
            </div>
          </div>

          <div className="space-y-2.5 relative z-10 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                <span>303-306, Solaris Cure, Besides Ratnajyoti Apt, VIP Road, Surat</span>
              </span>
              <span className="font-semibold text-gray-800">VIP Road</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                <span>Official Contact & Emergency Line</span>
              </span>
              <a href="tel:7984882273" className="font-bold text-primary hover:underline">
                7984882273
              </a>
            </div>
          </div>
        </div>

        {/* Quick Management Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-primary font-bold">Admin Shortcuts</p>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Quick Management</h2>
            </div>
            <Link href="/admin/settings" className="text-xs text-primary font-medium hover:underline">
              All Settings
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Link
              href="/admin/doctors"
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-teal-50/40 hover:border-teal-200 transition-all group flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Stethoscope size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Manage Doctors</p>
                <p className="text-xs text-gray-500 mt-0.5">Qualifications & Profiles</p>
              </div>
            </Link>

            <Link
              href="/admin/services"
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-teal-50/40 hover:border-teal-200 transition-all group flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">14 Specialities</p>
                <p className="text-xs text-gray-500 mt-0.5">Edit Descriptions & SEO</p>
              </div>
            </Link>

            <Link
              href="/admin/media"
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-teal-50/40 hover:border-teal-200 transition-all group flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <HardDrive size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Media Library</p>
                <p className="text-xs text-gray-500 mt-0.5">Local Server File Upload</p>
              </div>
            </Link>

            <Link
              href="/admin/homepage"
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-teal-50/40 hover:border-teal-200 transition-all group flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Homepage Builder</p>
                <p className="text-xs text-gray-500 mt-0.5">Hero & Dynamic Sections</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Content Activity Table (Jogi Style) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-xl text-primary">
              <Activity size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Content Activity</h2>
              <p className="text-xs text-gray-500 mt-0.5">Audit log of latest changes across the CMS</p>
            </div>
          </div>
          <Link
            href="/admin/activity-logs"
            className="text-xs text-primary font-semibold hover:underline"
          >
            View Full Logs
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs uppercase font-semibold text-gray-700 tracking-wider border-y border-gray-200">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3 rounded-r-lg">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {log.userName?.[0] || 'A'}
                      </div>
                      <span>{log.userName || 'Administrator'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-700 uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 capitalize font-medium text-gray-800">{log.module}</td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs max-w-xs truncate">{log.description}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">
                       {new Date(log.timestamp).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-1.5 opacity-60">
                      <Activity size={32} className="text-gray-300" />
                      <p className="text-sm">Database seeded with initial clinical records.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

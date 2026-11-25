'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Stethoscope,
  Activity,
  Building2,
  BookOpen,
  Video,
  MessageSquareQuote,
  Images,
  ArrowRight,
  Globe,
  Loader2,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Server,
  Database,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface StatsData {
  counts: {
    appointments?: { total: number; pending: number };
    doctors: { total: number; published: number };
    services: { total: number; published: number };
    facilities: { total: number };
    blogs: { total: number; published: number; draft: number };
    gallery: { albums: number; items: number };
    testimonials: { total: number };
    faqs: { total: number };
    media: { total: number };
    videos?: { total: number };
  };
  recentAppointments?: Array<{
    _id: string;
    patientName: string;
    phone: string;
    department: string;
    status: string;
    preferredDate?: string;
    createdAt: string;
  }>;
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

const statusClasses: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError('');
      const response = await adminApi.get('/dashboard/stats');
      if (response.data?.success) {
        setStats(response.data.data);
      } else {
        setError('Dashboard statistics are temporarily unavailable.');
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('We could not load the latest dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light/20">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </span>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#344B53]">
            Preparing your dashboard
          </p>
          <p className="mt-1 text-xs text-[#8AA3AD]">
            Loading the latest hospital operations data...
          </p>
        </div>
      </div>
    );
  }

  const {
    counts,
    recentAppointments = [],
    recentActivity = [],
    system,
  } = stats || ({} as StatsData);
  const safeCounts = counts || ({} as StatsData['counts']);

  const primaryMetrics = [
    {
      name: 'Consultation Leads',
      value: safeCounts.appointments?.total ?? 0,
      note: `${safeCounts.appointments?.pending ?? 0} awaiting review`,
      icon: Calendar,
      iconClass: 'bg-primary-light/20 text-primary',
      href: '/admin/appointments',
    },
    {
      name: 'Clinical Specialists',
      value: safeCounts.doctors?.total ?? 0,
      note: `${safeCounts.doctors?.published ?? 0} published on website`,
      icon: Stethoscope,
      iconClass: 'bg-emerald-50 text-emerald-600',
      href: '/admin/doctors',
    },
    {
      name: 'Clinical Specialities',
      value: safeCounts.services?.total ?? 0,
      note: `${safeCounts.services?.published ?? 0} currently published`,
      icon: Activity,
      iconClass: 'bg-blue-50 text-blue-600',
      href: '/admin/services',
    },
    {
      name: 'Published Guides',
      value: safeCounts.blogs?.published ?? 0,
      note: `${safeCounts.blogs?.draft ?? 0} drafts in progress`,
      icon: BookOpen,
      iconClass: 'bg-violet-50 text-violet-600',
      href: '/admin/blogs',
    },
  ];

  const secondaryMetrics = [
    {
      name: 'Facilities & OT',
      value: safeCounts.facilities?.total ?? 0,
      icon: Building2,
      href: '/admin/facilities',
    },
    {
      name: 'Gallery Assets',
      value: safeCounts.gallery?.items ?? 0,
      icon: Images,
      href: '/admin/gallery',
    },
    {
      name: 'Clinical Videos',
      value: safeCounts.videos?.total ?? 0,
      icon: Video,
      href: '/admin/videos',
    },
    {
      name: 'Patient Reviews',
      value: safeCounts.testimonials?.total ?? 0,
      icon: MessageSquareQuote,
      href: '/admin/testimonials',
    },
  ];

  const doctorProgress = safeCounts.doctors?.total
    ? ((safeCounts.doctors?.published ?? 0) / safeCounts.doctors.total) * 100
    : 0;
  const serviceProgress = safeCounts.services?.total
    ? ((safeCounts.services?.published ?? 0) / safeCounts.services.total) * 100
    : 0;
  const blogProgress = safeCounts.blogs?.total
    ? ((safeCounts.blogs?.published ?? 0) / safeCounts.blogs.total) * 100
    : 0;

  const systemIsOnline =
    String(system?.status || '').toLowerCase() === 'online' ||
    String(system?.status || '').toLowerCase() === 'healthy';

  return (
    <div className="space-y-7 pb-10">
      <AdminPageHeader
        title="Hospital Administration"
        description={
          <>
            Welcome back,{' '}
            <span className="font-semibold text-primary">
              {user?.name || 'Administrator'}
            </span>
            . Here is the latest overview of consultations, clinical content, and website operations.
          </>
        }
        breadcrumb={[{ label: 'Dashboard' }]}
        actions={
          <>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-btn-secondary"
            >
              <Globe size={16} />
              Live website
            </Link>
            <Link href="/admin/appointments" className="admin-btn-primary">
              <Calendar size={16} />
              Review appointments
            </Link>
          </>
        }
      />

      {error && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchStats}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            Try again
          </button>
        </div>
      )}

      <section aria-labelledby="primary-metrics-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="primary-metrics-heading"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#637C85]"
          >
            Key Performance Indicators
          </h2>
          <span className="text-[11px] font-medium text-[#8AA3AD]">
            Live CMS data
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {primaryMetrics.map((metric) => (
            <Link
              key={metric.name}
              href={metric.href}
              className="admin-card-lg group flex items-center gap-4 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(19,52,58,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${metric.iconClass}`}
              >
                <metric.icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-[#637C85]">
                  {metric.name}
                </span>
                <span className="mt-0.5 block font-heading text-2xl font-bold leading-none text-[#1A2C30]">
                  {metric.value}
                </span>
                <span className="mt-1.5 block truncate text-[10px] font-medium text-[#8AA3AD]">
                  {metric.note}
                </span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-[#B2C3C9] transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="admin-card overflow-hidden xl:col-span-8">
          <div className="flex items-center justify-between gap-4 border-b border-[#E7EDEF] px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#1A2C30]">
                Recent Consultation Requests
              </h2>
              <p className="mt-0.5 text-xs text-[#8AA3AD]">
                New patient leads submitted through the website.
              </p>
            </div>
            <Link
              href="/admin/appointments"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-light/20"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F4F5] text-[#8AA3AD]">
                <Calendar size={22} />
              </span>
              <p className="text-sm font-semibold text-[#344B53]">
                No consultation requests yet
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#8AA3AD]">
                New patient enquiries will appear here as soon as they are received.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EDF1F2]">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-[#F8FAFB] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light/20 text-xs font-bold text-primary">
                      {appointment.patientName?.charAt(0).toUpperCase() || 'P'}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#27393F]">
                        {appointment.patientName || 'Patient enquiry'}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#637C85]">
                        <span className="inline-flex items-center gap-1">
                          <Phone size={11} className="text-primary" />
                          {appointment.phone || 'No phone'}
                        </span>
                        <span className="truncate">{appointment.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pl-12 sm:justify-end sm:pl-0">
                    <div className="text-left sm:text-right">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          statusClasses[appointment.status] ||
                          'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        {appointment.status || 'Unknown'}
                      </span>
                      <p className="mt-1 text-[10px] text-[#8AA3AD]">
                        {new Date(appointment.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Link
                      href="/admin/appointments"
                      className="rounded-lg p-2 text-[#8AA3AD] transition hover:bg-primary-light/20 hover:text-primary"
                      aria-label={`Review appointment for ${appointment.patientName}`}
                    >
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card overflow-hidden xl:col-span-4">
          <div className="border-b border-[#E7EDEF] px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#1A2C30]">
                  System Health
                </h2>
                <p className="mt-0.5 text-xs text-[#8AA3AD]">
                  API and CMS infrastructure status.
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                  systemIsOnline
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    systemIsOnline ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {systemIsOnline ? 'Operational' : 'Check status'}
              </span>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex items-center gap-3 rounded-xl border border-[#E7EDEF] bg-[#F8FAFB] p-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <Server size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#344B53]">API Server</p>
                <p className="mt-0.5 text-[10px] capitalize text-[#8AA3AD]">
                  {system?.status || 'Status unavailable'}
                </p>
              </div>
              <CheckCircle2
                size={16}
                className={systemIsOnline ? 'text-emerald-500' : 'text-amber-500'}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#E7EDEF] bg-[#F8FAFB] p-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <Database size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#344B53]">Database</p>
                <p className="mt-0.5 text-[10px] capitalize text-[#8AA3AD]">
                  {system?.db || 'MongoDB'}
                </p>
              </div>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#E7EDEF] p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8AA3AD]">
                  Uptime
                </p>
                <p className="mt-1 text-sm font-bold text-[#344B53]">
                  {system?.uptime ?? 0}%
                </p>
              </div>
              <div className="rounded-xl border border-[#E7EDEF] p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8AA3AD]">
                  Runtime
                </p>
                <p className="mt-1 truncate text-sm font-bold text-[#344B53]">
                  {system?.nodeVersion || 'Node'}
                </p>
              </div>
            </div>

            {/* <Link
              href="/admin/backup"
              className="flex items-center justify-between rounded-lg border border-[#D8E1E4] px-3.5 py-2.5 text-xs font-semibold text-[#4D636B] transition hover:border-primary/30 hover:bg-primary-light/15 hover:text-primary"
            >
              Open system controls
              <ArrowRight size={14} />
            </Link> */}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="admin-card p-5 sm:p-6 xl:col-span-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#1A2C30]">
                Publishing Overview
              </h2>
              <p className="mt-0.5 text-xs text-[#8AA3AD]">
                Website content readiness across key sections.
              </p>
            </div>
            <Activity size={19} className="text-primary" />
          </div>

          <div className="space-y-5">
            {[
              {
                label: 'Doctor profiles',
                published: safeCounts.doctors?.published ?? 0,
                total: safeCounts.doctors?.total ?? 0,
                progress: doctorProgress,
              },
              {
                label: 'Clinical specialities',
                published: safeCounts.services?.published ?? 0,
                total: safeCounts.services?.total ?? 0,
                progress: serviceProgress,
              },
              {
                label: 'Pregnancy guides',
                published: safeCounts.blogs?.published ?? 0,
                total: safeCounts.blogs?.total ?? 0,
                progress: blogProgress,
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#4D636B]">{item.label}</span>
                  <span className="text-[#8AA3AD]">
                    <strong className="font-bold text-[#344B53]">{item.published}</strong>
                    {' / '}
                    {item.total} published
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#EAF0F1]">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#EDF1F2] pt-5 sm:grid-cols-4">
            {secondaryMetrics.map((metric) => (
              <Link
                key={metric.name}
                href={metric.href}
                className="rounded-xl border border-[#E7EDEF] p-3.5 transition hover:border-primary/25 hover:bg-primary-light/10"
              >
                <metric.icon size={17} className="text-primary" />
                <p className="mt-2 font-heading text-xl font-bold text-[#27393F]">
                  {metric.value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#8AA3AD]">
                  {metric.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card overflow-hidden xl:col-span-5">
          <div className="flex items-center justify-between border-b border-[#E7EDEF] px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#1A2C30]">
                Recent Activity
              </h2>
              <p className="mt-0.5 text-xs text-[#8AA3AD]">
                Latest administrator actions.
              </p>
            </div>
            <Link
              href="/admin/activity-logs"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View log
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs text-[#8AA3AD]">
              No recent administrator activity.
            </div>
          ) : (
            <div className="divide-y divide-[#EDF1F2]">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity._id} className="flex gap-3 px-5 py-3.5 sm:px-6">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light/20 text-primary">
                    <Activity size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#344B53]">
                      {activity.description || activity.action}
                    </p>
                    <p className="mt-1 text-[10px] text-[#8AA3AD]">
                      {activity.userName || 'Administrator'} · {activity.module} ·{' '}
                      {new Date(activity.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="admin-card grid grid-cols-1 divide-y divide-[#EDF1F2] md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#637C85]">
            <Clock size={15} className="text-primary" />
            OPD Timings
          </div>
          <p className="mt-3 text-sm font-bold text-[#344B53]">
            Morning: 10:00 AM – 1:00 PM
          </p>
          <p className="mt-1 text-sm font-bold text-[#344B53]">
            Evening: 5:00 PM – 7:00 PM
          </p>
          <p className="mt-1.5 text-[11px] text-[#8AA3AD]">Monday to Saturday</p>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#637C85]">
            <MapPin size={15} className="text-primary" />
            Clinic Address
          </div>
          <p className="mt-3 text-xs font-medium leading-relaxed text-[#4D636B]">
            303–306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat – 395007
          </p>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#637C85]">
            <Phone size={15} className="text-primary" />
            Patient Support
          </div>
          <p className="mt-3 text-sm font-bold text-[#344B53]">
            +91 79848 82273
          </p>
          <p className="mt-1.5 text-[11px] text-[#8AA3AD]">
            24×7 emergency maternity support
          </p>
        </div>
      </section>
    </div>
  );
}

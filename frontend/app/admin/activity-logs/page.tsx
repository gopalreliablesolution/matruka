'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Search, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

interface LogItem {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  description: string;
  timestamp: string;
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const fetchLogs = async () => {
    try {
      const q = new URLSearchParams();
      if (moduleFilter) q.set('module', moduleFilter);
      q.set('limit', '50');

      const res = await adminApi.get(`/activity-logs?${q.toString()}`);
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administrative Activity"
        description="Review the latest 50 records showing who created, updated, or deleted website content and settings."
        icon={Activity}
        breadcrumb={[{ label: 'Activity Audit Logs' }]}
        actions={
          <select
            value={moduleFilter}
            onChange={(event) => setModuleFilter(event.target.value)}
            className="rounded-lg border border-[#D8E1E4] bg-white px-3.5 py-2.5 text-xs font-medium text-[#344B53] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
            aria-label="Filter activity by module"
          >
            <option value="">All Modules</option>
            <option value="doctors">Doctors</option>
            <option value="services">Services</option>
            <option value="blogs">Blogs</option>
            <option value="banners">Banners</option>
            <option value="media">Media</option>
            <option value="settings">Settings</option>
            <option value="auth">Auth / Logins</option>
          </select>
        }
      />

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No activity logs recorded.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition text-xs sm:text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-slate-900">{log.userName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      log.action === 'create'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.action === 'update'
                        ? 'bg-blue-100 text-blue-800'
                        : log.action === 'delete'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-xs font-mono text-slate-400">[{log.module}]</span>
                  </div>
                  <p className="text-slate-600 mt-1">{log.description}</p>
                </div>

                <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


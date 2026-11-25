'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBackupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return null;
}

/*
// COMMENTED OUT - DATABASE BACKUP & HEALTH SECTION
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Download, HardDrive, Server, Database, Loader2, CheckCircle2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export function CommentedAdminBackupPage() {
  const { isAdmin } = useAuth();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await adminApi.get('/system/health');
      if (res.data.success) {
        setHealth(res.data.data);
      }
    } catch {
      toast.error('Failed to load system health status');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      setDownloading(true);
      const res = await adminApi.get('/backup/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `matruka_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Database backup exported successfully');
    } catch {
      toast.error('Failed to download backup');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Health & Disaster Recovery"
        description="Monitor database status, system uptime, and export complete JSON database dumps."
        icon={ShieldCheck}
        breadcrumb={[{ label: 'Database Backup & Health' }]}
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={handleExportBackup}
              disabled={downloading}
              className="admin-btn-primary"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {downloading ? 'Generating Dump...' : 'Export DB Backup (JSON)'}
              </span>
            </button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Database Engine</p>
              <p className="text-base font-bold text-brand-slate-900 font-heading">MongoDB</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Connected & Healthy</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Backend Node.js</p>
              <p className="text-base font-bold text-brand-slate-900 font-heading">{health?.nodeVersion || 'v22.x'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-2 font-mono">
            Uptime: {Math.round((health?.uptimeSeconds || 0) / 60)} minutes
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">File Storage</p>
              <p className="text-base font-bold text-brand-slate-900 font-heading">Local Server Disk</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>0% 3rd Party Cloud • Local Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

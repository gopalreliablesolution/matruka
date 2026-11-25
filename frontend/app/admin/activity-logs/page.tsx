'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(1, itemsPerPage, moduleFilter);
  }, [moduleFilter]);

  const fetchLogs = async (page = currentPage, limit = itemsPerPage, mod = moduleFilter) => {
    try {
      setLoading(true);
      const q = new URLSearchParams();
      if (mod) q.set('module', mod);
      q.set('page', String(page));
      q.set('limit', String(limit));

      const res = await adminApi.get(`/activity-logs?${q.toString()}`);
      if (res.data.success) {
        setLogs(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalItems(res.data.pagination.total || 0);
          setCurrentPage(res.data.pagination.page || page);
        }
      }
    } catch {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchLogs(newPage, itemsPerPage, moduleFilter);
  };

  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchLogs(1, newLimit, moduleFilter);
  };

  const startRecord = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administrative Activity"
        description={`Review audit logs showing who created, updated, or deleted website content and settings (${totalItems} total records).`}
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
            <option value="pages">Pages</option>
            <option value="users">Users</option>
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
              <div
                key={log._id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition text-xs sm:text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-slate-900">{log.userName}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        log.action === 'create'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'update'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'delete'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
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

        {/* Pagination Bar */}
        {!loading && totalItems > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#D8E1E4] bg-white px-4 py-3 sm:flex-row">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#637C85]">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="rounded-md border border-[#D8E1E4] bg-white px-2 py-1 text-xs font-semibold text-[#344B53] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <span>
                Showing <strong className="font-semibold text-[#344B53]">{startRecord}</strong> to{' '}
                <strong className="font-semibold text-[#344B53]">{endRecord}</strong> of{' '}
                <strong className="font-semibold text-[#344B53]">{totalItems}</strong> records
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-1 text-xs text-[#637C85]">
                Page <strong className="font-semibold text-[#344B53]">{currentPage}</strong> of{' '}
                <strong className="font-semibold text-[#344B53]">{totalPages}</strong>
              </span>

              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D8E1E4] bg-white px-3 py-1.5 text-xs font-semibold text-[#637C85] shadow-xs transition hover:bg-[#F6F8F9] hover:text-[#344B53] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              {/* Quick page numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span className="px-1 text-xs text-slate-400">...</span>}
                        <button
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`min-w-[28px] h-7 px-2 text-xs font-semibold rounded-md transition ${
                            currentPage === p
                              ? 'bg-[#0496AC] text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D8E1E4] bg-white px-3 py-1.5 text-xs font-semibold text-[#637C85] shadow-xs transition hover:bg-[#F6F8F9] hover:text-[#344B53] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Trash2, Calendar, User, Download, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import Breadcrumb from '@/components/admin/Breadcrumb';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface SubscriberItem {
  _id: string;
  name?: string;
  email: string;
  sourcePath?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNewsletterPage() {
  const [entries, setEntries] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: SubscriberItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    item: null,
    loading: false,
  });

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/newsletter');
      if (res.data?.success) {
        setEntries(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load newsletter subscribers:', err);
      toast.error('Failed to load newsletter subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) => {
      return [entry.name, entry.email, entry.sourcePath]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(query));
    });
  }, [entries, searchTerm]);

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/newsletter/${deleteModal.item._id}`);
      if (res.data?.success) {
        toast.success('Subscriber deleted');
        setDeleteModal({ isOpen: false, item: null, loading: false });
        fetchEntries();
      }
    } catch (err: any) {
      toast.error('Failed to delete subscriber');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const columns: Column[] = [
    {
      header: 'Subscriber Name',
      accessor: 'name',
      render: (item: SubscriberItem) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="font-semibold text-gray-900">{item.name || 'Anonymous Patient'}</span>
        </div>
      ),
    },
    {
      header: 'Email Address',
      accessor: 'email',
      render: (item: SubscriberItem) => (
        <div className="flex items-center gap-1.5 text-gray-700">
          <Mail size={14} className="text-primary shrink-0" />
          <span className="font-medium">{item.email}</span>
        </div>
      ),
    },
    {
      header: 'Source Page',
      accessor: 'sourcePath',
      render: (item: SubscriberItem) => (
        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium text-gray-600 bg-gray-100">
          {item.sourcePath || '/hospital-location'}
        </span>
      ),
    },
    {
      header: 'Subscribed Date',
      accessor: 'createdAt',
      render: (item: SubscriberItem) => (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: 'actions',
      align: 'right',
      render: (item: SubscriberItem) => (
        <button
          onClick={() => setDeleteModal({ isOpen: true, item, loading: false })}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete subscriber"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Newsletter Subscribers' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-gray-900">
              Newsletter Subscribers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
              {entries.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review patient and visitor email signups collected from the hospital location section and website.
          </p>
        </div>
        <button
          onClick={fetchEntries}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-xs sm:text-sm font-semibold"
        >
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredEntries}
        loading={loading}
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: 'Search by name, email, or source...',
        }}
        emptyMessage="No newsletter signups found."
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, loading: false })}
        onConfirm={confirmDelete}
        loading={deleteModal.loading}
        title="Delete Subscriber"
        message={`Are you sure you want to delete ${deleteModal.item?.email}?`}
      />
    </div>
  );
}

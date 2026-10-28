'use client';

import React, { useEffect, useState } from 'react';
import { HardDrive, Upload, Trash2, Copy, Check, Search, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import { adminApi } from '@/lib/api';
import Breadcrumb from '@/components/admin/Breadcrumb';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface MediaItem {
  _id: string;
  originalName: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: MediaItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    item: null,
    loading: false,
  });

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get(`/media?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setMediaList(res.data.data);
      }
    } catch {
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name);

    try {
      setUploading(true);
      const res = await adminApi.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('File saved directly to server disk!');
        fetchMedia();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/media/${deleteModal.item._id}`);
      if (res.data.success) {
        toast.success('Media removed from server');
        fetchMedia();
        setDeleteModal({ isOpen: false, item: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete media');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Local file URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Media Library' }]}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Library & Local Server Disk</h1>
            <p className="text-sm text-gray-500 mt-1">
              Zero 3rd party dependencies: All files are saved directly inside <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">backend/uploads/</code> on the server filesystem.
            </p>
          </div>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm cursor-pointer">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            <span>{uploading ? 'Saving to Server...' : 'Upload Media to Server'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media by filename..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Total Assets: <strong className="text-gray-900">{mediaList.length}</strong>
        </span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-gray-500 font-medium">Reading local disk storage...</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-primary flex items-center justify-center mx-auto mb-3">
            <HardDrive size={32} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No Media Files Stored Yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
            Click 'Upload Media to Server' above to upload photos, doctor portraits, ultrasound scans, or badges directly to the local server disk.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => {
            const isImage = item.mimeType?.startsWith('image/');
            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                <div className="h-32 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-gray-400" />
                  )}
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    {formatBytes(item.size)}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-semibold text-gray-900 truncate" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.mimeType}</p>

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => copyUrl(item._id, item.url)}
                      className="flex-1 py-1.5 px-2 bg-gray-50 hover:bg-teal-50 hover:text-primary text-gray-600 rounded text-[11px] font-semibold transition flex items-center justify-center gap-1 border border-gray-200"
                      title="Copy Local URL"
                    >
                      {copiedId === item._id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedId === item._id ? 'Copied' : 'Copy URL'}</span>
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, item: item, loading: false })}
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition border border-gray-200"
                      title="Delete from server"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, loading: false })}
        onConfirm={confirmDelete}
        title="Delete Local File?"
        message={`Are you sure you want to permanently delete "${deleteModal.item?.originalName}" from the server filesystem?`}
        confirmLabel="Delete from Disk"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

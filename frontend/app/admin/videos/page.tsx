'use client';

import React, { useState, useEffect } from 'react';
import {
  Video as VideoIcon,
  Plus,
  Edit2,
  Trash2,
  Play,
  Check,
  X,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';
import Pagination from '@/components/admin/Pagination';

interface VideoItem {
  _id: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl?: string;
  category?: string;
  description?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

function extractYouTubeId(url: string) {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : url.trim();
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    category: 'Maternity Awareness',
    description: '',
    isFeatured: true,
    isPublished: true,
    sortOrder: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    video: VideoItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    video: null,
    loading: false,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/videos');
      if (res.data?.success) {
        setVideos(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vid?: VideoItem) => {
    if (vid) {
      setEditingVideo(vid);
      setFormData({
        title: vid.title,
        youtubeUrl: vid.youtubeUrl,
        category: vid.category || 'Maternity Awareness',
        description: vid.description || '',
        isFeatured: vid.isFeatured,
        isPublished: vid.isPublished,
        sortOrder: vid.sortOrder || 0,
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: '',
        youtubeUrl: '',
        category: 'Maternity Awareness',
        description: '',
        isFeatured: true,
        isPublished: true,
        sortOrder: videos.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeUrl) {
      toast.error('Please provide a title and YouTube video URL');
      return;
    }

    try {
      setSubmitting(true);
      if (editingVideo) {
        const res = await adminApi.put(`/videos/${editingVideo._id}`, formData);
        if (res.data?.success) {
          toast.success('Video updated successfully');
          fetchVideos();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/videos', formData);
        if (res.data?.success) {
          toast.success('Video created successfully');
          fetchVideos();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save video');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.video) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/videos/${deleteModal.video._id}`);
      if (res.data?.success) {
        toast.success('Video deleted');
        setVideos((prev) => prev.filter((v) => v._id !== deleteModal.video!._id));
        setDeleteModal({ isOpen: false, video: null, loading: false });
      }
    } catch (err) {
      toast.error('Failed to delete video');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const previewYtId = extractYouTubeId(formData.youtubeUrl);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <AdminPageHeader
        title="Clinical Video Showcase"
        description="Manage YouTube educational clips, laparoscopic surgery explanations, and patient guidance videos."
        icon={VideoIcon}
        breadcrumb={[{ label: 'Video Showcase (YouTube)' }]}
        actions={
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="admin-btn-primary"
          >
            <Plus size={16} />
            <span>Add New Video</span>
          </button>
        }
      />

      {/* Videos Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-gray-500 font-medium">Loading clinical video library...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
          <div className="w-14 h-14 bg-brand-teal-50 text-primary rounded-full flex items-center justify-center mx-auto">
            <VideoIcon size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Videos Added Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click &ldquo;Add New Video&rdquo; to publish your YouTube patient awareness clips or surgery walkthroughs.
          </p>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            Add Your First Video
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((vid) => (
            <div
              key={vid._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="aspect-[16/9] bg-black relative overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/icon.png';
                    }}
                  />
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition"
                  >
                    <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={18} className="fill-white ml-0.5" />
                    </div>
                  </a>

                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {vid.category || 'Maternity'}
                  </div>

                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
                      vid.isPublished ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'
                    }`}
                  >
                    {vid.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm font-heading line-clamp-2">
                    {vid.title}
                  </h3>
                  {vid.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 font-mono pt-1">
                    YouTube ID: {vid.youtubeId}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <a
                  href={vid.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Open Video</span>
                  <ExternalLink size={12} />
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(vid)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-primary hover:bg-brand-teal-50 transition"
                    title="Edit Video"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: true, video: vid, loading: false })}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Video"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(videos.length / itemsPerPage) || 1}
          totalItems={videos.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
          className="mt-6 border border-gray-100 rounded-2xl"
        />
      </>
      )}

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <h3 className="text-base font-bold text-gray-900 font-heading">
                {editingVideo ? 'Edit Clinical Video' : 'Add New Clinical Video'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Painless Vaginal Delivery & Epidural Protocol Explained"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  YouTube Video Link or URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=w0iDfcAYZWc"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                {previewYtId && previewYtId.length === 11 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${previewYtId}/hqdefault.jpg`}
                      alt="Thumbnail Preview"
                      className="w-20 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/icon.png';
                      }}
                    />
                    <div className="text-[11px] text-gray-600">
                      <p className="font-bold text-emerald-600">Valid YouTube ID: {previewYtId}</p>
                      <p className="text-gray-400">Auto-detected thumbnail preview</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                >
                  <option value="Maternity Awareness">Maternity Awareness</option>
                  <option value="Laparoscopy Surgery">3D Laparoscopy Surgery</option>
                  <option value="High Risk Pregnancy">High Risk Pregnancy Care</option>
                  <option value="Ultrasound Sonography">Ultrasound Diagnostics</option>
                  <option value="Patient Stories">Patient Testimonial Videos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief clinical context or topic covered in this video..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Publish on Website</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{editingVideo ? 'Update Video' : 'Publish Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, video: null, loading: false })}
        onConfirm={handleDelete}
        title="Delete Video Showcase?"
        message={`Are you sure you want to delete "${deleteModal.video?.title}"?`}
        confirmLabel="Delete Video"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

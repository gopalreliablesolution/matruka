'use client';

import React, { useEffect, useState } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface BannerItem {
  _id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  desktopImage: string;
  mobileImage?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: 'Complete Care For Her',
    desktopImage: '',
    mobileImage: '',
    primaryBtnText: 'Explore Our Services',
    primaryBtnLink: '/services',
    secondaryBtnText: 'Meet Our Doctors',
    secondaryBtnLink: '/doctors',
    sortOrder: 0,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    banner: BannerItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    banner: null,
    loading: false,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/banners');
      if (res.data?.success) {
        setBanners(res.data.data);
      }
    } catch {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (b?: BannerItem) => {
    if (b) {
      setEditingBanner(b);
      setFormData({
        title: b.title,
        subtitle: b.subtitle,
        badgeText: b.badgeText || '',
        desktopImage: b.desktopImage,
        mobileImage: b.mobileImage || '',
        primaryBtnText: b.primaryBtnText || '',
        primaryBtnLink: b.primaryBtnLink || '',
        secondaryBtnText: b.secondaryBtnText || '',
        secondaryBtnLink: b.secondaryBtnLink || '',
        sortOrder: b.sortOrder,
        isActive: b.isActive,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        badgeText: 'Complete Care For Her',
        desktopImage: '',
        mobileImage: '',
        primaryBtnText: 'Book Appointment',
        primaryBtnLink: '/book-appointment',
        secondaryBtnText: 'Call Clinic: 7984882273',
        secondaryBtnLink: 'tel:7984882273',
        sortOrder: banners.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const DEFAULT_HERO_FALLBACK = '/images/hero/serene-maternity-moment-at-home.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle) {
      toast.error('Title and subtitle are required');
      return;
    }

    const payload = {
      ...formData,
      desktopImage: formData.desktopImage?.trim() || DEFAULT_HERO_FALLBACK,
    };

    try {
      setSubmitting(true);
      if (editingBanner) {
        const res = await adminApi.put(`/banners/${editingBanner._id}`, payload);
        if (res.data.success) {
          toast.success('Hero banner updated');
          fetchBanners();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/banners', payload);
        if (res.data.success) {
          toast.success('Hero banner created');
          fetchBanners();
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.banner) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/banners/${deleteModal.banner._id}`);
      if (res.data.success) {
        toast.success('Banner deleted');
        setBanners((prev) => prev.filter((b) => b._id !== deleteModal.banner!._id));
        setDeleteModal({ isOpen: false, banner: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete banner');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <AdminPageHeader
        title="Homepage Hero Banners & Sliders"
        description="Manage rotating hero slides, clinical headlines, badges, high-resolution photography, and calls to action."
        icon={Sliders}
        breadcrumb={[{ label: 'Banners & Hero Sliders' }]}
        actions={
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="admin-btn-primary"
          >
            <Plus size={16} />
            <span>Add New Slide</span>
          </button>
        }
      />

      {/* Grid of Banners */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-gray-500 font-medium">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
          <div className="w-14 h-14 bg-brand-teal-50 text-primary rounded-full flex items-center justify-center mx-auto">
            <Sliders size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Banners Configured</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click &ldquo;Add New Slide&rdquo; to create your first homepage hero banner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                  {b.desktopImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resolveImageUrl(b.desktopImage)}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image Uploaded
                    </div>
                  )}

                  <span
                    className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
                      b.isActive ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'
                    }`}
                  >
                    {b.isActive ? 'Active' : 'Hidden'}
                  </span>

                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Order: {b.sortOrder}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  {b.badgeText && (
                    <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-primary bg-brand-teal-50 px-2.5 py-0.5 rounded-md border border-brand-teal-200">
                      {b.badgeText}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 text-base font-heading">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {b.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    {b.primaryBtnText && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium text-[11px]">
                        Primary: {b.primaryBtnText} ({b.primaryBtnLink})
                      </span>
                    )}
                    {b.secondaryBtnText && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium text-[11px]">
                        Secondary: {b.secondaryBtnText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenModal(b)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-primary hover:bg-brand-teal-50 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Edit2 size={14} />
                  <span>Edit Slide</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: true, banner: b, loading: false })}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <h3 className="text-base font-bold text-gray-900 font-heading">
                {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
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
                  Badge Text (e.g. Complete Care for Her)
                </label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. FELLOWSHIP-TRAINED SURGEONS"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Hero Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Advanced Gynec Laparoscopic Surgeries"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Subtitle / Clinical Overview *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Minimally invasive keyhole procedures for fibroids, ovarian cysts, and hysterectomy with minimal pain and faster recovery."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Desktop Hero Image
                  </label>
                  <span className="text-[11px] text-slate-400 font-normal">
                    (Optional - default image will be used if removed)
                  </span>
                </div>
                <ImageUpload
                  value={formData.desktopImage}
                  onChange={(url) => setFormData({ ...formData, desktopImage: url })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Primary CTA Text
                  </label>
                  <input
                    type="text"
                    value={formData.primaryBtnText}
                    onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                    placeholder="Book Appointment"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    value={formData.primaryBtnLink}
                    onChange={(e) => setFormData({ ...formData, primaryBtnLink: e.target.value })}
                    placeholder="/book-appointment"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Secondary CTA Text
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryBtnText}
                    onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                    placeholder="Call Clinic: 7984882273"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Secondary CTA Link
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryBtnLink}
                    onChange={(e) => setFormData({ ...formData, secondaryBtnLink: e.target.value })}
                    placeholder="tel:7984882273"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Active on Homepage</span>
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
                  <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, banner: null, loading: false })}
        onConfirm={handleDelete}
        title="Delete Hero Banner?"
        message={`Are you sure you want to delete "${deleteModal.banner?.title}"? This cannot be undone.`}
        confirmLabel="Delete Banner"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

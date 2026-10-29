'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
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

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await adminApi.get('/banners');
      if (res.data.success) {
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
        primaryBtnText: 'Explore Our Services',
        primaryBtnLink: '/services',
        secondaryBtnText: 'Meet Our Doctors',
        secondaryBtnLink: '/doctors',
        sortOrder: banners.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle || !formData.desktopImage) {
      toast.error('Title, subtitle, and desktop image are required');
      return;
    }

    try {
      if (editingBanner) {
        const res = await adminApi.put(`/banners/${editingBanner._id}`, formData);
        if (res.data.success) {
          toast.success('Banner updated');
          fetchBanners();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/banners', formData);
        if (res.data.success) {
          toast.success('Banner created');
          fetchBanners();
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('Failed to save banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await adminApi.delete(`/banners/${id}`);
      if (res.data.success) {
        toast.success('Banner deleted');
        fetchBanners();
      }
    } catch {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-slate-900 font-heading flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-teal-600" />
            <span>Homepage Hero Banners & Sliders</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage hero banners, maternity photography, headlines, and call-to-action buttons.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-teal-600" />
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
            No banners found.
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="h-44 bg-slate-100 relative overflow-hidden">
                {b.desktopImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={resolveImageUrl(b.desktopImage)}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No image uploaded
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow ${
                    b.isActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                  }`}
                >
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="p-5 space-y-2">
                {b.badgeText && (
                  <span className="text-[10px] font-bold tracking-wider uppercase text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded">
                    {b.badgeText}
                  </span>
                )}
                <h3 className="font-bold text-brand-slate-900 text-base font-heading">{b.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{b.subtitle}</p>

                <div className="pt-2 flex items-center gap-2 text-xs">
                  {b.primaryBtnText && (
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                      Btn: {b.primaryBtnText} → {b.primaryBtnLink}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-brand-teal-700 hover:bg-brand-teal-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-slate-900 font-heading">
                {editingBanner ? 'Edit Banner' : 'Add Hero Slide'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. Complete Care For Her"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Main Heading *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Nurturing Motherhood With Expertise & Love"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Supporting Text *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <ImageUpload
                label="Slide Background / Hero Photo (Stored on server disk) *"
                value={formData.desktopImage}
                onChange={(url) => setFormData({ ...formData, desktopImage: url })}
                altText={formData.title}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={formData.primaryBtnText}
                    onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={formData.primaryBtnLink}
                    onChange={(e) => setFormData({ ...formData, primaryBtnLink: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand-teal-600 rounded"
                />
                <label htmlFor="bActive" className="font-semibold text-slate-700 cursor-pointer">
                  Slide is Active and visible on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold rounded-xl shadow"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


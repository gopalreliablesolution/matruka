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
  ExternalLink,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';
import Pagination from '@/components/admin/Pagination';

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
  showContent?: boolean;
  bannerLinkUrl?: string;
  openInNewTab?: boolean;
  sortOrder: number;
  isActive: boolean;
}

function decodeBanner(b: any): BannerItem {
  let showContent = b.showContent;
  let bannerLinkUrl = b.bannerLinkUrl || '';
  let openInNewTab = Boolean(b.openInNewTab);
  let mobileImage = b.mobileImage || '';

  if (mobileImage && typeof mobileImage === 'string' && mobileImage.startsWith('__META__:')) {
    try {
      const parsed = JSON.parse(mobileImage.substring(9));
      if (parsed.showContent !== undefined) showContent = Boolean(parsed.showContent);
      if (parsed.bannerLinkUrl !== undefined) bannerLinkUrl = parsed.bannerLinkUrl;
      if (parsed.openInNewTab !== undefined) openInNewTab = Boolean(parsed.openInNewTab);
      mobileImage = parsed.realMobileImage || '';
    } catch {}
  }

  if (showContent === undefined) {
    showContent = b.title !== 'Banner Graphic' && b.subtitle !== 'Graphic';
  }

  return {
    ...b,
    showContent: Boolean(showContent),
    bannerLinkUrl,
    openInNewTab,
    mobileImage,
    title: b.title === 'Banner Graphic' && !showContent ? '' : (b.title || ''),
    subtitle: b.subtitle === 'Graphic' && !showContent ? '' : (b.subtitle || ''),
  };
}

function encodeBannerData(formData: any, fallbackImage: string) {
  const meta = {
    showContent: Boolean(formData.showContent),
    bannerLinkUrl: formData.bannerLinkUrl ? formData.bannerLinkUrl.trim() : '',
    openInNewTab: Boolean(formData.openInNewTab),
    realMobileImage: formData.mobileImage ? formData.mobileImage.trim() : '',
  };

  const isContent = Boolean(formData.showContent);

  return {
    ...formData,
    title: formData.title.trim() || (isContent ? 'MatruKa Care' : 'Banner Graphic'),
    subtitle: formData.subtitle.trim() || (isContent ? 'Surat Healthcare' : 'Graphic'),
    badgeText: formData.badgeText.trim(),
    desktopImage: formData.desktopImage.trim() || fallbackImage,
    bannerLinkUrl: formData.bannerLinkUrl.trim(),
    openInNewTab: Boolean(formData.openInNewTab),
    showContent: isContent,
    mobileImage: `__META__:${JSON.stringify(meta)}`,
  };
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'image' | 'content'>('image');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: '',
    desktopImage: '',
    mobileImage: '',
    primaryBtnText: '',
    primaryBtnLink: '',
    secondaryBtnText: '',
    secondaryBtnLink: '',
    showContent: true,
    bannerLinkUrl: '',
    openInNewTab: false,
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
      if (res.data?.success && Array.isArray(res.data.data)) {
        setBanners(res.data.data.map(decodeBanner));
      }
    } catch {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rawB?: BannerItem) => {
    if (rawB) {
      const b = decodeBanner(rawB);
      setEditingBanner(b);
      setFormData({
        title: b.title || '',
        subtitle: b.subtitle || '',
        badgeText: b.badgeText || '',
        desktopImage: b.desktopImage || '',
        mobileImage: b.mobileImage || '',
        primaryBtnText: b.primaryBtnText || '',
        primaryBtnLink: b.primaryBtnLink || '',
        secondaryBtnText: b.secondaryBtnText || '',
        secondaryBtnLink: b.secondaryBtnLink || '',
        showContent: Boolean(b.showContent),
        bannerLinkUrl: b.bannerLinkUrl || '',
        openInNewTab: Boolean(b.openInNewTab),
        sortOrder: b.sortOrder || 0,
        isActive: b.isActive !== undefined ? b.isActive : true,
      });
      setActiveModalTab('image');
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        badgeText: '',
        desktopImage: '',
        mobileImage: '',
        primaryBtnText: '',
        primaryBtnLink: '',
        secondaryBtnText: '',
        secondaryBtnLink: '',
        showContent: true,
        bannerLinkUrl: '',
        openInNewTab: false,
        sortOrder: banners.length + 1,
        isActive: true,
      });
      setActiveModalTab('image');
    }
    setIsModalOpen(true);
  };

  const DEFAULT_HERO_FALLBACK = '/images/hero/serene-maternity-moment-at-home.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.desktopImage?.trim()) {
      toast.error('Please upload or provide a banner image');
      return;
    }

    const payload = encodeBannerData(formData, DEFAULT_HERO_FALLBACK);

    try {
      setSubmitting(true);
      if (editingBanner) {
        const res = await adminApi.put(`/banners/${editingBanner._id}`, payload);
        if (res.data.success) {
          toast.success('Hero banner updated successfully');
          fetchBanners();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/banners', payload);
        if (res.data.success) {
          toast.success('Hero banner created successfully');
          fetchBanners();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save banner');
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
        description="Manage rotating hero slides, graphic banner images, hyperlinks, and optional clinical content overlays."
        icon={Sliders}
        breadcrumb={[{ label: 'Banners & Hero Sliders' }]}
        actions={
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="admin-btn-primary flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white shadow-sm cursor-pointer"
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                  {b.desktopImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resolveImageUrl(b.desktopImage, '/images/brand/matruka-logo.png')}
                      alt={b.title || 'Hero Banner'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/brand/matruka-logo.png';
                        e.currentTarget.className = 'w-auto h-16 object-contain m-auto';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 p-4">
                      <img src="/logo.png" alt="MatruKa" className="h-12 w-auto object-contain opacity-60" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
                        b.isActive ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'
                      }`}
                    >
                      {b.isActive ? 'Active' : 'Hidden'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
                        b.showContent !== false ? 'bg-brand-teal-700 text-white' : 'bg-purple-700 text-white'
                      }`}
                    >
                      {b.showContent !== false ? 'With Content' : 'Image Only'}
                    </span>
                  </div>

                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Order: {b.sortOrder}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  {b.showContent !== false ? (
                    <>
                      {b.badgeText && (
                        <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-primary bg-brand-teal-50 px-2.5 py-0.5 rounded-md border border-brand-teal-200">
                          {b.badgeText}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-base font-heading">
                        {b.title || 'Untitled Slide'}
                      </h3>
                      {b.subtitle && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {b.subtitle}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="py-1">
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                        Pure Banner Graphic (Text Content Disabled)
                      </span>
                    </div>
                  )}

                  {/* Banner Link Info */}
                  {b.bannerLinkUrl && (
                    <div className="pt-2 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                      <LinkIcon size={13} />
                      <span className="truncate">Links to: {b.bannerLinkUrl}</span>
                      {b.openInNewTab && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                          (New Tab)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenModal(b)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-primary hover:bg-brand-teal-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit2 size={14} />
                  <span>Edit Slide</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: true, banner: b, loading: false })}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(banners.length / itemsPerPage) || 1}
          totalItems={banners.length}
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

      {/* Add / Edit Banner Modal with Separate Flows */}
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
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* SEPARATE FLOW TABS */}
            <div className="flex border-b border-gray-200 bg-gray-50/40 px-6 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveModalTab('image')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                  activeModalTab === 'image'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ImageIcon size={15} />
                <span>1. Banner Graphic & Link</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('content')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                  activeModalTab === 'content'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Type size={15} />
                <span>2. Text & Button Content</span>
                {!formData.showContent && (
                  <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.2 rounded-full">
                    Disabled
                  </span>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* ============================================================ */}
              {/* FLOW 1: BANNER GRAPHIC & LINK SETTINGS */}
              {/* ============================================================ */}
              {activeModalTab === 'image' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Banner Image Upload */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        Banner Graphic Image *
                      </label>
                      <span className="text-[11px] text-slate-400 font-normal">
                        (Upload high-res banner or slide image)
                      </span>
                    </div>
                    <ImageUpload
                      value={formData.desktopImage}
                      onChange={(url) => setFormData({ ...formData, desktopImage: url })}
                    />
                  </div>

                  {/* Banner Link URL */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      Banner Click URL / Link (Optional)
                    </label>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={formData.bannerLinkUrl}
                        onChange={(e) => setFormData({ ...formData, bannerLinkUrl: e.target.value })}
                        placeholder="e.g. /services or https://instagram.com/..."
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      When users click on the banner image, they will navigate to this link.
                    </p>
                  </div>

                  {/* Open in New Tab checkbox */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-700 select-none">
                      <input
                        type="checkbox"
                        checked={formData.openInNewTab}
                        onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <span>Open link in New Tab (`target=&quot;_blank&quot;`)</span>
                    </label>
                  </div>

                  {/* CONTENT VISIBILITY TOGGLE */}
                  <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {formData.showContent ? <Eye size={15} className="text-primary" /> : <EyeOff size={15} className="text-gray-500" />}
                        <span>Display Text Content Overlay</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {formData.showContent
                          ? 'Showing headline, subtitle, and CTA buttons over the slide.'
                          : 'Disabled: Slide will display purely as a full banner graphic.'}
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showContent}
                        onChange={(e) => setFormData({ ...formData, showContent: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Slide Sort Order & Active */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                        Slide Sort Order
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
                </div>
              )}

              {/* ============================================================ */}
              {/* FLOW 2: TEXT CONTENT & CTA BUTTONS */}
              {/* ============================================================ */}
              {activeModalTab === 'content' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {!formData.showContent ? (
                    <div className="p-6 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                      <EyeOff size={28} className="mx-auto text-gray-400" />
                      <p className="text-xs font-bold text-gray-700">Text Content is Currently Disabled</p>
                      <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                        This slide is configured as a graphic banner only. If you want to show headline and buttons, enable &ldquo;Display Text Content Overlay&rdquo; in the first tab.
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, showContent: true })}
                        className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl mt-2 cursor-pointer"
                      >
                        Enable Text Content
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                          Badge Text (Optional)
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
                          Slide Headline / Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g. Advanced Gynec Laparoscopic Surgeries"
                          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                          Subtitle / Overview (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.subtitle}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          placeholder="Minimally invasive keyhole procedures for fibroids, ovarian cysts, and hysterectomy..."
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                            Primary CTA Text
                          </label>
                          <input
                            type="text"
                            value={formData.primaryBtnText}
                            onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                            placeholder="e.g. Book Appointment"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                            Secondary CTA Text
                          </label>
                          <input
                            type="text"
                            value={formData.secondaryBtnText}
                            onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                            placeholder="e.g. Call Clinic"
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
                    </>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-medium">
                  {formData.showContent ? 'Mode: Image + Content' : 'Mode: Banner Graphic Only'}
                </span>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="admin-btn-secondary w-full sm:w-auto cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="admin-btn-primary w-full sm:w-auto disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                  </button>
                </div>
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
        message={`Are you sure you want to delete "${deleteModal.banner?.title || 'this banner'}"? This cannot be undone.`}
        confirmLabel="Delete Banner"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

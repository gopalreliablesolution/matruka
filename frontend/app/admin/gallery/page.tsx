'use client';

import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  X,
  FolderPlus,
  Folder,
  Eye,
  Check,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  caption?: string;
  albumId?: { _id: string; title: string } | string;
  isPublished: boolean;
  sortOrder?: number;
}

interface AlbumItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  description?: string;
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'None (No Category / No Badge)' },
  { value: 'Facilities', label: 'Hospital Facilities' },
  { value: 'Suites', label: 'Patient Rooms & Suites' },
  { value: 'OT & Surgery', label: '3D Laparoscopy OT & Recovery' },
  { value: 'Diagnostics', label: 'Ultrasound & Consultation' },
];

export default function AdminGalleryPage() {
  const [activeTab, setActiveTab] = useState<'photos' | 'albums'>('photos');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    caption: '',
    category: '',
    isPublished: true,
  });

  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    imageUrl: '',
    caption: '',
    category: '',
    isPublished: true,
  });

  const [albumData, setAlbumData] = useState({
    title: '',
    category: 'Facilities',
    description: '',
  });

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'photo' | 'album';
    id: string | null;
    title: string;
    loading: boolean;
  }>({
    isOpen: false,
    type: 'photo',
    id: null,
    title: '',
    loading: false,
  });

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const [itemsRes, albumsRes] = await Promise.all([
        adminApi.get('/gallery'),
        adminApi.get('/gallery/albums'),
      ]);
      if (itemsRes.data.success) setItems(itemsRes.data.data);
      if (albumsRes.data.success) setAlbums(albumsRes.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to load gallery data');
    } finally {
      setLoading(false);
    }
  };

  // CREATE PHOTO
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Please upload a photo image');
      return;
    }

    try {
      const payload: Record<string, any> = {
        imageUrl: formData.imageUrl,
        title: formData.title.trim(),
        caption: formData.caption.trim(),
        category: formData.category ? formData.category.trim() : '',
        isPublished: formData.isPublished,
      };

      const res = await adminApi.post('/gallery', payload);
      if (res.data.success) {
        toast.success('Gallery photo added successfully');
        fetchGalleryData();
        setIsCreateModalOpen(false);
        setFormData({
          title: '',
          imageUrl: '',
          caption: '',
          category: '',
          isPublished: true,
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add gallery photo');
    }
  };

  // OPEN EDIT MODAL
  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);

    setEditFormData({
      title: item.title || '',
      imageUrl: item.imageUrl || '',
      caption: item.caption || '',
      category: item.category ?? '',
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
    });
    setIsEditModalOpen(true);
  };

  // UPDATE PHOTO
  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editFormData.imageUrl) {
      toast.error('Please upload a photo image');
      return;
    }

    try {
      const payload: Record<string, any> = {
        imageUrl: editFormData.imageUrl,
        title: editFormData.title.trim(),
        caption: editFormData.caption.trim(),
        category: editFormData.category ? editFormData.category.trim() : '',
        isPublished: editFormData.isPublished,
      };

      const res = await adminApi.put(`/gallery/${editingItem._id}`, payload);
      if (res.data.success) {
        toast.success('Gallery photo updated successfully');
        fetchGalleryData();
        setIsEditModalOpen(false);
        setEditingItem(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update gallery photo');
    }
  };

  // CREATE ALBUM
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = albumData.title.trim();
    if (!trimmedTitle) {
      toast.error('Album title is required');
      return;
    }

    // Generate unique slug in frontend to prevent duplicate key error across any backend
    const baseSlug = trimmedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'album';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (albums.some((a) => a.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    try {
      const res = await adminApi.post('/gallery/albums', {
        title: trimmedTitle,
        slug: uniqueSlug,
        category: albumData.category,
        description: albumData.description.trim(),
      });
      if (res.data.success) {
        toast.success(`Album "${trimmedTitle}" created successfully`);
        fetchGalleryData();
        setIsAlbumModalOpen(false);
        setAlbumData({ title: '', category: 'Facilities', description: '' });
      }
    } catch (err: any) {
      const rawError = err.response?.data?.error || err.message || '';
      if (rawError.includes('E11000') || rawError.includes('duplicate key') || rawError.includes('slug')) {
        toast.error(`"${trimmedTitle}" નામનું આલ્બમ પહેલેથી જ બનેલું છે. કૃપા કરીને નવું ટાઇટલ આપો.`);
      } else {
        toast.error(rawError || 'Failed to create album');
      }
    }
  };

  // DELETE ITEM OR ALBUM
  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      if (deleteModal.type === 'photo') {
        const res = await adminApi.delete(`/gallery/${deleteModal.id}`);
        if (res.data.success) {
          toast.success('Photo removed from gallery');
          setItems((prev) => prev.filter((i) => i._id !== deleteModal.id));
        }
      } else {
        const res = await adminApi.delete(`/gallery/albums/${deleteModal.id}`);
        if (res.data.success) {
          toast.success('Album and associated photos deleted');
          fetchGalleryData();
        }
      }
      setDeleteModal({ isOpen: false, type: 'photo', id: null, title: '', loading: false });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete item');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const categories = ['All', 'Facilities', 'Suites', 'OT & Surgery', 'Diagnostics'];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((img) => img.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <AdminPageHeader
        title="Hospital Photography & Gallery"
        description="Upload and organize authentic hospital photographs, maternity suites, 3D laparoscopic OT, and patient care rooms."
        icon={ImageIcon}
        breadcrumb={[{ label: 'Photo Gallery & Rooms' }]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsAlbumModalOpen(true)}
              className="admin-btn-secondary flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs cursor-pointer"
            >
              <FolderPlus size={16} className="text-primary" />
              <span>Create Album</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="admin-btn-primary flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Photo</span>
            </button>
          </div>
        }
      />

      {/* Tabs Switcher: Photos vs Albums */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${activeTab === 'photos'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            <ImageIcon size={15} />
            <span>All Photos ({items.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('albums')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${activeTab === 'albums'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            <Folder size={15} />
            <span>Albums ({albums.length})</span>
          </button>
        </div>

        {/* Category Pills (Visible when in photos tab) */}
        {activeTab === 'photos' && (
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile category pills */}
      {activeTab === 'photos' && (
        <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 whitespace-nowrap rounded-full text-xs font-semibold transition ${selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-gray-500 font-medium">Loading hospital gallery...</p>
          </div>
        ) : activeTab === 'photos' ? (
          /* PHOTOS GRID */
          filteredItems.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No photographs found in this category. Click &quot;Add New Photo&quot; to upload!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map((img) => {
                const hasImage = Boolean(img.imageUrl && img.imageUrl.trim() !== '');
                const hasText = Boolean(img.title?.trim() || img.caption?.trim());
                const hasCategory = Boolean(img.category && img.category !== 'None' && img.category.trim() !== '');

                return (
                  <div
                    key={img._id}
                    className={`group relative rounded-2xl border border-gray-200 overflow-hidden bg-white flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 ${
                      hasImage ? 'h-full min-h-[260px]' : 'p-4 min-h-[160px]'
                    }`}
                  >
                    {hasImage ? (
                      <div className={`overflow-hidden relative bg-slate-100 ${!hasText ? 'flex-1 w-full h-full min-h-[260px]' : 'aspect-[4/3] w-full'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveImageUrl(img.imageUrl)}
                          alt={img.title || 'Hospital Photo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/images/gallery/default-cover.jpg';
                          }}
                        />

                        {/* Action buttons on hover */}
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 z-20">
                          {/* EDIT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(img)}
                            className="p-2.5 bg-white text-gray-800 rounded-xl hover:bg-primary hover:text-white transition-all shadow-md hover:scale-110 cursor-pointer"
                            title="Edit Photo Details"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                type: 'photo',
                                id: img._id,
                                title: img.title || 'Untitled Photo',
                                loading: false,
                              })
                            }
                            className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:scale-110 cursor-pointer"
                            title="Delete Photo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {hasCategory && (
                          <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                            {img.category}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* No Image: Render category, title & caption directly */
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          {hasCategory ? (
                            <span className="bg-brand-teal-50 text-brand-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-brand-teal-200">
                              {img.category}
                            </span>
                          ) : <span />}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(img)}
                              className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                              title="Edit Details"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteModal({
                                  isOpen: true,
                                  type: 'photo',
                                  id: img._id,
                                  title: img.title || 'Untitled Item',
                                  loading: false,
                                })
                              }
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {img.title && (
                          <p className="text-xs font-bold text-gray-900 leading-snug">
                            {img.title}
                          </p>
                        )}
                        {img.caption && (
                          <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">{img.caption}</p>
                        )}
                      </div>
                    )}

                    {hasImage && hasText && (
                      <div className="p-3 bg-white border-t border-gray-100">
                        {img.title && (
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {img.title}
                          </p>
                        )}
                        {img.caption && (
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">{img.caption}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* ALBUMS GRID */
          albums.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No albums created yet. Click &quot;Create Album&quot; to organize photos into collections!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {albums.map((album) => {
                const albumPhotoCount = items.filter(
                  (i) =>
                    (typeof i.albumId === 'object' && i.albumId?._id === album._id) ||
                    i.albumId === album._id
                ).length;

                return (
                  <div
                    key={album._id}
                    className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                          {album.category}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              type: 'album',
                              id: album._id,
                              title: album.title,
                              loading: false,
                            })
                          }
                          className="text-gray-400 hover:text-red-600 transition p-1"
                          title="Delete Album"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h4 className="font-bold text-gray-900 text-base mt-2">{album.title}</h4>
                      {album.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{album.description}</p>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500">
                      <span>{albumPhotoCount} {albumPhotoCount === 1 ? 'photo' : 'photos'}</span>
                      <span className="text-[11px] text-gray-400">Slug: /{album.slug}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ============================================================ */}
      {/* 1. ADD PHOTO MODAL */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <h3 className="text-base font-bold text-gray-900 font-heading">
                Upload Photograph to Hospital Gallery
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Photo Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Maternity Suite (leave empty if you only want image)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white font-medium"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Photo Upload *
                </label>
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spacious private birthing suite with medical monitoring"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Upload & Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. EDIT / UPDATE PHOTO MODAL */}
      {/* ============================================================ */}
      {isEditModalOpen && editingItem && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2">
                <Edit2 size={18} className="text-primary" />
                <h3 className="text-base font-bold text-gray-900 font-heading">
                  Edit Gallery Photo Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Photo Title (Optional — leave empty for image-only)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Maternity Suite"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white font-medium"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Photo Image *
                </label>
                <ImageUpload
                  value={editFormData.imageUrl}
                  onChange={(url) => setEditFormData({ ...editFormData, imageUrl: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spacious private birthing suite with medical monitoring"
                  value={editFormData.caption}
                  onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. CREATE ALBUM MODAL */}
      {/* ============================================================ */}
      {isAlbumModalOpen && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAlbumModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <h3 className="text-base font-bold text-gray-900 font-heading">
                Create New Photo Album
              </h3>
              <button
                type="button"
                onClick={() => setIsAlbumModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Birthing Suites & LDR Rooms"
                  value={albumData.title}
                  onChange={(e) => setAlbumData({ ...albumData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Category
                </label>
                <select
                  value={albumData.category}
                  onChange={(e) => setAlbumData({ ...albumData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white font-medium"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Album Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of photos in this album..."
                  value={albumData.description}
                  onChange={(e) => setAlbumData({ ...albumData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. DELETE CONFIRMATION MODAL */}
      {/* ============================================================ */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: 'photo', id: null, title: '', loading: false })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.type === 'album' ? 'Delete Album?' : 'Delete Photo?'}
        message={
          deleteModal.type === 'album'
            ? `Are you sure you want to delete the album "${deleteModal.title}"? All photographs inside this album will also be deleted.`
            : `Are you sure you want to delete "${deleteModal.title}" from the hospital gallery?`
        }
        confirmLabel={deleteModal.type === 'album' ? 'Delete Album & Photos' : 'Delete Photo'}
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

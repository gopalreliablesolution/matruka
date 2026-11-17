'use client';

import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  X,
  FolderPlus,
  ZoomIn,
  Eye,
  ExternalLink,
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
  albumId?: { _id: string; title: string };
  isPublished: boolean;
}

interface AlbumItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    caption: '',
    category: 'Facilities',
    albumId: '',
    isPublished: true,
  });

  const [albumData, setAlbumData] = useState({
    title: '',
    category: 'Facilities',
    description: '',
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    title: string;
    loading: boolean;
  }>({
    isOpen: false,
    itemId: null,
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
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast.error('Title and image upload are required');
      return;
    }

    try {
      const res = await adminApi.post('/gallery', formData);
      if (res.data.success) {
        toast.success('Gallery photo added successfully');
        fetchGalleryData();
        setIsModalOpen(false);
        setFormData({
          title: '',
          imageUrl: '',
          caption: '',
          category: 'Facilities',
          albumId: '',
          isPublished: true,
        });
      }
    } catch {
      toast.error('Failed to add gallery photo');
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumData.title) {
      toast.error('Album title is required');
      return;
    }

    try {
      const res = await adminApi.post('/gallery/albums', albumData);
      if (res.data.success) {
        toast.success('Album created successfully');
        fetchGalleryData();
        setIsAlbumModalOpen(false);
        setAlbumData({ title: '', category: 'Facilities', description: '' });
      }
    } catch {
      toast.error('Failed to create album');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteModal.itemId) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/gallery/${deleteModal.itemId}`);
      if (res.data.success) {
        toast.success('Photo removed from gallery');
        setItems((prev) => prev.filter((i) => i._id !== deleteModal.itemId));
        setDeleteModal({ isOpen: false, itemId: null, title: '', loading: false });
      }
    } catch {
      toast.error('Failed to delete photo');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const categories = ['All', 'Facilities', 'Suites', 'OT & Surgery', 'Diagnostics'];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter(
          (i) => i.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="space-y-6 pb-12 font-sans">
      <AdminPageHeader
        title="Hospital Photography & Suites"
        description="Manage authentic hospital photographs, maternity suites, 3D laparoscopic OT, and consultation cabins."
        icon={ImageIcon}
        breadcrumb={[{ label: 'Photo Gallery & Rooms' }]}
        actions={
          <>
            <button
              type="button"
              onClick={() => setIsAlbumModalOpen(true)}
              className="admin-btn-secondary"
            >
              <FolderPlus size={16} className="text-primary" />
              <span>Create Album</span>
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="admin-btn-primary"
            >
              <Plus size={16} />
              <span>Add New Photo</span>
            </button>
          </>
        }
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat === 'All' ? `All Photos (${items.length})` : cat}
          </button>
        ))}
      </div>

      {/* Gallery Items Grid */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-gray-500 font-medium">Loading hospital photographs...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No photographs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((img) => (
              <div
                key={img._id}
                className="group relative rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex flex-col justify-between shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(img.imageUrl)}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          itemId: img._id,
                          title: img.title,
                          loading: false,
                        })
                      }
                      className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow"
                      title="Delete Photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {img.category}
                  </span>
                </div>

                <div className="p-3.5 bg-white border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-900 truncate">{img.title}</p>
                  {img.caption && (
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{img.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Photo Modal */}
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
                Upload Photograph to Hospital Gallery
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Maternity Suite & Newborn Cradle"
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
                  <option value="Facilities">Hospital Facilities</option>
                  <option value="Suites">Patient Rooms & Suites</option>
                  <option value="OT & Surgery">3D Laparoscopy OT & Recovery</option>
                  <option value="Diagnostics">Ultrasound & Consultation</option>
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  Upload & Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
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
                className="text-gray-400 hover:text-gray-600"
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
                  <option value="Facilities">Hospital Facilities</option>
                  <option value="Suites">Patient Rooms & Suites</option>
                  <option value="OT & Surgery">3D Laparoscopy OT & Recovery</option>
                  <option value="Diagnostics">Ultrasound & Consultation</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, title: '', loading: false })}
        onConfirm={handleDeleteItem}
        title="Delete Photo?"
        message={`Are you sure you want to delete "${deleteModal.title}" from the hospital gallery?`}
        confirmLabel="Delete Photo"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

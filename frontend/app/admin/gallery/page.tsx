'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Loader2, X, FolderPlus } from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
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

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
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
        toast.success('Gallery image added');
        fetchGalleryData();
        setIsModalOpen(false);
        setFormData({ title: '', imageUrl: '', caption: '', category: 'Facilities', albumId: '', isPublished: true });
      }
    } catch {
      toast.error('Failed to add gallery image');
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
        toast.success('Album created');
        fetchGalleryData();
        setIsAlbumModalOpen(false);
        setAlbumData({ title: '', category: 'Facilities', description: '' });
      }
    } catch {
      toast.error('Failed to create album');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this gallery image?')) return;
    try {
      const res = await adminApi.delete(`/gallery/${id}`);
      if (res.data.success) {
        toast.success('Image deleted');
        fetchGalleryData();
      }
    } catch {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-slate-900 font-heading flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-brand-teal-600" />
            <span>Clinic Gallery & Album CMS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and organize authentic clinic photographs, delivery suites, laparoscopic theater, and consultation spaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition"
          >
            <FolderPlus className="w-4 h-4 text-brand-teal-600" />
            <span>Create Album</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* Gallery Items Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-brand-slate-900 font-heading mb-4">
          All Gallery Photos ({items.length})
        </h2>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-teal-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No photos added yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((img) => (
              <div
                key={img._id}
                className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between"
              >
                <div className="h-40 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(img.imageUrl)}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => handleDeleteItem(img._id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 bg-white border-t border-slate-100">
                  <p className="text-xs font-bold text-brand-slate-900 truncate">{img.title}</p>
                  <p className="text-[11px] text-brand-teal-700 mt-0.5">{img.category}</p>
                  {img.caption && <p className="text-[10px] text-slate-400 truncate mt-1">{img.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-slate-900 font-heading">Add Photo to Gallery</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Labor & Birthing Suite"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <ImageUpload
                label="Select Photo (Stored on server disk) *"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                altText={formData.title}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Facilities">Facilities & OT</option>
                    <option value="Suites">Suites & Inpatient</option>
                    <option value="Clinic">Clinic Interior</option>
                    <option value="Doctors">Doctors & Events</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Album</label>
                  <select
                    value={formData.albumId}
                    onChange={(e) => setFormData({ ...formData, albumId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none bg-white"
                  >
                    <option value="">No Album (Standalone)</option>
                    {albums.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption / Description</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Brief descriptive note..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-slate-900 font-heading">Create New Album</h2>
              <button onClick={() => setIsAlbumModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={albumData.title}
                  onChange={(e) => setAlbumData({ ...albumData, title: e.target.value })}
                  placeholder="e.g. Labor & Birthing Suites"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={albumData.category}
                  onChange={(e) => setAlbumData({ ...albumData, category: e.target.value })}
                  placeholder="e.g. Facilities"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold rounded-xl shadow"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


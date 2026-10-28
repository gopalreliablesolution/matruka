'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Plus, Edit2, Trash2, Check, X, Loader2, Sparkles } from 'lucide-react';
import { adminApi } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import Breadcrumb from '@/components/admin/Breadcrumb';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface FacilityItem {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  features: string[];
  sortOrder: number;
  isPublished: boolean;
}

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    facility: FacilityItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    facility: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    icon: 'Building2',
    image: '',
    features: '',
    sortOrder: 1,
    isPublished: true,
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/facilities');
      if (res.data?.success) {
        setFacilities(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (fac?: FacilityItem) => {
    if (fac) {
      setEditingFacility(fac);
      setFormData({
        name: fac.name || '',
        shortDescription: fac.shortDescription || '',
        fullDescription: fac.fullDescription || '',
        icon: fac.icon || 'Building2',
        image: fac.image || '',
        features: (fac.features || []).join(', '),
        sortOrder: fac.sortOrder || 1,
        isPublished: fac.isPublished ?? true,
      });
    } else {
      setEditingFacility(null);
      setFormData({
        name: '',
        shortDescription: '',
        fullDescription: '',
        icon: 'Building2',
        image: '',
        features: '',
        sortOrder: facilities.length + 1,
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Facility name is required');
      return;
    }

    const payload = {
      ...formData,
      features: formData.features
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingFacility) {
        const res = await adminApi.put(`/facilities/${editingFacility._id}`, payload);
        if (res.data.success) {
          toast.success('Facility updated');
          fetchFacilities();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/facilities', payload);
        if (res.data.success) {
          toast.success('Facility created');
          fetchFacilities();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save facility');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.facility) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/facilities/${deleteModal.facility._id}`);
      if (res.data.success) {
        toast.success('Facility deleted');
        fetchFacilities();
        setDeleteModal({ isOpen: false, facility: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete facility');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Facilities & Tech' }]}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facilities & Infrastructure</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage ultrasound suites, modular laparoscopic OT, delivery rooms, and recovery infrastructure.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Facility</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-gray-500 font-medium">Loading clinic facilities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac._id}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-primary flex items-center justify-center font-bold">
                      <Building2 size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{fac.name}</h3>
                      <p className="text-xs text-primary font-medium">Display Order: #{fac.sortOrder}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      fac.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {fac.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {fac.image && (
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                    <img src={fac.image} alt={fac.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{fac.shortDescription}</p>

                {fac.features && fac.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {fac.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-0.5 rounded-lg font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(fac)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, facility: fac, loading: false })}
                  className="px-3 py-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingFacility ? 'Edit Facility' : 'Add New Facility'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update equipment details, specifications, and facility photos.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Advanced Laparoscopic Operating Theatre"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Short Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Infrastructure Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Key Features (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="HEPA air filtration, 4K Stryker laparoscopy tower, Harmonic scalpel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Facility Photo (Saved to local server disk)
                </label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublished: e.target.checked })
                      }
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-xs font-semibold text-gray-700">Published</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-xs transition shadow-sm"
                >
                  {editingFacility ? 'Save Changes' : 'Create Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, facility: null, loading: false })}
        onConfirm={confirmDelete}
        title="Delete Facility?"
        message={`Are you sure you want to delete ${deleteModal.facility?.name}?`}
        confirmLabel="Delete Facility"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

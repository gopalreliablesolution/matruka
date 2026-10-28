'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquareQuote, Plus, Edit2, Trash2, Star, Check, X, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import Breadcrumb from '@/components/admin/Breadcrumb';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface TestimonialItem {
  _id: string;
  patientName: string;
  location: string;
  story: string;
  rating: number;
  treatmentReceived: string;
  doctorAttended?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: TestimonialItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    item: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    patientName: '',
    location: 'Surat, Gujarat',
    story: '',
    rating: 5,
    treatmentReceived: '',
    doctorAttended: 'Dr. Kairavi Yagnik',
    isFeatured: true,
    isPublished: true,
    sortOrder: 1,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/testimonials');
      if (res.data?.success) {
        setTestimonials(res.data.data);
      }
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: TestimonialItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        patientName: item.patientName || '',
        location: item.location || 'Surat, Gujarat',
        story: item.story || '',
        rating: item.rating || 5,
        treatmentReceived: item.treatmentReceived || '',
        doctorAttended: item.doctorAttended || 'Dr. Kairavi Yagnik',
        isFeatured: item.isFeatured ?? true,
        isPublished: item.isPublished ?? true,
        sortOrder: item.sortOrder || 1,
      });
    } else {
      setEditingItem(null);
      setFormData({
        patientName: '',
        location: 'Surat, Gujarat',
        story: '',
        rating: 5,
        treatmentReceived: 'Personalized Antenatal Care & Normal Delivery',
        doctorAttended: 'Dr. Kairavi Yagnik',
        isFeatured: true,
        isPublished: true,
        sortOrder: testimonials.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      toast.error('Patient name is required');
      return;
    }

    try {
      if (editingItem) {
        const res = await adminApi.put(`/testimonials/${editingItem._id}`, formData);
        if (res.data.success) {
          toast.success('Testimonial updated');
          fetchTestimonials();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/testimonials', formData);
        if (res.data.success) {
          toast.success('Testimonial added');
          fetchTestimonials();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save testimonial');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/testimonials/${deleteModal.item._id}`);
      if (res.data.success) {
        toast.success('Testimonial removed');
        fetchTestimonials();
        setDeleteModal({ isOpen: false, item: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete testimonial');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Patient Testimonials' }]}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Experiences & Reviews</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage patient feedback, delivery stories, 5-star ratings, and consulting doctor attribution.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-gray-500 font-medium">Loading patient feedback...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                      t.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {t.isPublished ? 'Active' : 'Draft'}
                  </span>
                </div>

                <p className="text-xs text-gray-600 italic mb-4 leading-relaxed line-clamp-4">
                  "{t.story}"
                </p>

                <div className="pt-3 border-t border-gray-100">
                  <p className="font-bold text-gray-900 text-sm">{t.patientName}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                  <p className="text-xs text-primary font-medium mt-1 truncate">
                    {t.treatmentReceived}
                  </p>
                  {t.doctorAttended && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Attended by: <strong className="text-gray-700">{t.doctorAttended}</strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => handleOpenModal(t)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, item: t, loading: false })}
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingItem ? 'Edit Testimonial' : 'Add Patient Review'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified clinical review from patients in Surat.
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Priyanshi Mehta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Treatment / Care Received
                </label>
                <input
                  type="text"
                  value={formData.treatmentReceived}
                  onChange={(e) => setFormData({ ...formData, treatmentReceived: e.target.value })}
                  placeholder="e.g. Painless Vaginal Delivery & Antenatal Care"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Doctor Attended</label>
                  <select
                    value={formData.doctorAttended}
                    onChange={(e) => setFormData({ ...formData, doctorAttended: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="Dr. Kairavi Yagnik">Dr. Kairavi Yagnik</option>
                    <option value="Dr. Rut Shah">Dr. Rut Shah</option>
                    <option value="Both Doctors & Team">Both Doctors & Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rating (1 to 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Patient Experience Story *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-gray-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-gray-700">Featured on Homepage</span>
                </label>
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
                  {editingItem ? 'Save Review' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, loading: false })}
        onConfirm={confirmDelete}
        title="Delete Testimonial?"
        message={`Are you sure you want to delete the review from ${deleteModal.item?.patientName}?`}
        confirmLabel="Delete Review"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

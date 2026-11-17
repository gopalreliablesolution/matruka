'use client';

import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Loader2,
  MessageCircleQuestion,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Pregnancy & Delivery',
    sortOrder: 0,
    isPublished: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    faq: FAQItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    faq: null,
    loading: false,
  });

  useEffect(() => {
    fetchFaqs();
  }, [search, categoryFilter]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (categoryFilter) q.set('category', categoryFilter);

      const res = await adminApi.get(`/faqs?${q.toString()}`);
      if (res.data?.success) {
        setFaqs(res.data.data);
      }
    } catch {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: FAQItem) => {
    if (item) {
      setEditingFaq(item);
      setFormData({
        question: item.question,
        answer: item.answer,
        category: item.category,
        sortOrder: item.sortOrder,
        isPublished: item.isPublished,
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        category: 'Pregnancy & Delivery',
        sortOrder: faqs.length + 1,
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingFaq) {
        const res = await adminApi.put(`/faqs/${editingFaq._id}`, formData);
        if (res.data.success) {
          toast.success('FAQ updated');
          fetchFaqs();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/faqs', formData);
        if (res.data.success) {
          toast.success('FAQ added');
          fetchFaqs();
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('Failed to save FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.faq) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/faqs/${deleteModal.faq._id}`);
      if (res.data.success) {
        toast.success('FAQ deleted');
        setFaqs((prev) => prev.filter((f) => f._id !== deleteModal.faq!._id));
        setDeleteModal({ isOpen: false, faq: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete FAQ');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <AdminPageHeader
        title="Frequently Asked Questions"
        description="Manage patient clinical Q&As regarding antenatal care, painless delivery, 3D laparoscopy, and OPD protocols."
        icon={HelpCircle}
        breadcrumb={[{ label: 'Patient Clinical FAQs' }]}
        actions={
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="admin-btn-primary"
          >
            <Plus size={16} />
            <span>Add New FAQ</span>
          </button>
        }
      />

      {/* Toolbar / Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-gray-700"
        >
          <option value="">All Categories</option>
          <option value="Clinic & Timings">Clinic & Timings</option>
          <option value="Pregnancy & Delivery">Pregnancy & Delivery</option>
          <option value="Laparoscopy & Surgery">Laparoscopy & Surgery</option>
          <option value="Infertility">Infertility</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* FAQs List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-gray-500 font-medium">Loading clinical FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No FAQs found matching your query.
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq._id}
              className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50/60 transition"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-brand-teal-50 text-primary border border-brand-teal-200">
                    {faq.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm font-heading">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pl-3 border-l-2 border-primary/40">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenModal(faq)}
                  className="p-1.5 text-gray-500 hover:text-primary hover:bg-brand-teal-50 rounded-lg transition"
                  title="Edit FAQ"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: true, faq, loading: false })}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete FAQ"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
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
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
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
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Is painless normal delivery completely safe for the baby?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
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
                  <option value="Pregnancy & Delivery">Pregnancy & Delivery</option>
                  <option value="Laparoscopy & Surgery">3D Laparoscopy & Keyhole Surgery</option>
                  <option value="Clinic & Timings">Clinic & Timings</option>
                  <option value="Infertility">Infertility Evaluation</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide a clear, reassuring, and evidence-based answer..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Sort Order
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
                  <span>{editingFaq ? 'Update FAQ' : 'Save FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, faq: null, loading: false })}
        onConfirm={handleDelete}
        title="Delete FAQ?"
        message={`Are you sure you want to delete "${deleteModal.faq?.question}"?`}
        confirmLabel="Delete FAQ"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

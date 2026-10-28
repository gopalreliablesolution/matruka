'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, Check, X, Search, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
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
    category: 'General',
    sortOrder: 0,
    isPublished: true,
  });

  useEffect(() => {
    fetchFaqs();
  }, [search, categoryFilter]);

  const fetchFaqs = async () => {
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (categoryFilter) q.set('category', categoryFilter);

      const res = await adminApi.get(`/faqs?${q.toString()}`);
      if (res.data.success) {
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
          toast.success('FAQ created');
          fetchFaqs();
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('Failed to save FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await adminApi.delete(`/faqs/${id}`);
      if (res.data.success) {
        toast.success('FAQ deleted');
        fetchFaqs();
      }
    } catch {
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-slate-900 font-heading flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-teal-600" />
            <span>FAQ Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage categorized patient questions regarding OPD timings, delivery care, laparoscopy, and clinic protocols.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-60 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
        >
          <option value="">All Categories</option>
          <option value="Clinic & Timings">Clinic & Timings</option>
          <option value="Pregnancy & Delivery">Pregnancy & Delivery</option>
          <option value="Laparoscopy & Surgery">Laparoscopy & Surgery</option>
          <option value="Infertility">Infertility</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-teal-600" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No FAQs found.</div>
        ) : (
          faqs.map((faq) => (
            <div key={faq._id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-teal-50 text-brand-teal-700">
                    {faq.category}
                  </span>
                  <h3 className="font-bold text-brand-slate-900 text-sm font-heading">{faq.question}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-2 border-l-2 border-slate-200">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpenModal(faq)}
                  className="p-1.5 text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-slate-900 font-heading">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none bg-white"
                >
                  <option value="Clinic & Timings">Clinic & Timings</option>
                  <option value="Pregnancy & Delivery">Pregnancy & Delivery</option>
                  <option value="Laparoscopy & Surgery">Laparoscopy & Surgery</option>
                  <option value="Infertility">Infertility</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What are the OPD consultation hours at Matruka?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Clear, helpful response..."
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminApi } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import Breadcrumb from '@/components/admin/Breadcrumb';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  featuredImage: string;
  treatments: string[];
  benefits: string[];
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    service: ServiceItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    service: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    category: 'Pregnancy & Maternity Care',
    shortDescription: '',
    fullDescription: '',
    featuredImage: '',
    treatments: '',
    benefits: '',
    isFeatured: false,
    isPublished: true,
    sortOrder: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/services/categories');
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/services?category=${encodeURIComponent(selectedCategory)}`
        : '/services';
      const res = await adminApi.get(url);
      if (res.data?.success) {
        setServices(res.data.data.services || res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (srv?: ServiceItem) => {
    if (srv) {
      setEditingService(srv);
      setFormData({
        name: srv.name || '',
        category: srv.category || 'Pregnancy & Maternity Care',
        shortDescription: srv.shortDescription || '',
        fullDescription: srv.fullDescription || '',
        featuredImage: srv.featuredImage || '',
        treatments: (srv.treatments || []).join(', '),
        benefits: (srv.benefits || []).join(', '),
        isFeatured: srv.isFeatured ?? false,
        isPublished: srv.isPublished ?? true,
        sortOrder: srv.sortOrder || 1,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        category: categories[0]?.name || 'Pregnancy & Maternity Care',
        shortDescription: '',
        fullDescription: '',
        featuredImage: '',
        treatments: '',
        benefits: '',
        isFeatured: false,
        isPublished: true,
        sortOrder: services.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    const payload = {
      ...formData,
      treatments: formData.treatments
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: formData.benefits
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingService) {
        const res = await adminApi.put(`/services/${editingService._id}`, payload);
        if (res.data.success) {
          toast.success('Clinical speciality updated');
          fetchServices();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/services', payload);
        if (res.data.success) {
          toast.success('Clinical speciality created');
          fetchServices();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save service');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.service) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/services/${deleteModal.service._id}`);
      if (res.data.success) {
        toast.success('Service deleted');
        fetchServices();
        setDeleteModal({ isOpen: false, service: null, loading: false });
      }
    } catch {
      toast.error('Failed to delete service');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleTogglePublish = async (srv: ServiceItem) => {
    try {
      const res = await adminApi.put(`/services/${srv._id}`, { isPublished: !srv.isPublished });
      if (res.data.success) {
        toast.success(`Service ${srv.isPublished ? 'Unpublished' : 'Published'}`);
        fetchServices();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.category?.toLowerCase().includes(search.toLowerCase()) ||
      srv.shortDescription?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory ? srv.category === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  const columns: Column[] = [
    {
      header: 'Speciality & Service',
      accessor: 'name',
      render: (srv: ServiceItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 overflow-hidden">
            {srv.featuredImage ? (
              <img src={srv.featuredImage} alt={srv.name} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{srv.name}</p>
            <p className="text-xs text-gray-500 line-clamp-1 max-w-sm">{srv.shortDescription}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (srv: ServiceItem) => (
        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          {srv.category}
        </span>
      ),
    },
    {
      header: 'Order',
      accessor: 'sortOrder',
      align: 'center',
      render: (srv: ServiceItem) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
          #{srv.sortOrder}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'isPublished',
      render: (srv: ServiceItem) => (
        <button
          onClick={() => handleTogglePublish(srv)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${srv.isPublished
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
        >
          {srv.isPublished ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          <span>{srv.isPublished ? 'Active' : 'Draft'}</span>
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (srv: ServiceItem) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenModal(srv)}
            className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition"
            title="Edit Service"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, service: srv, loading: false })}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete Service"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[{ label: 'Dashboard', href: '/admin' }, { label: '14 Core Specialities' }]}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinical Specialities & Services</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage the 14 confirmed Matruka specialities, procedures, patient benefits, and clinical descriptions.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Speciality</span>
          </button>
        </div>
      </div>

      {/* Jogi-Style Data Table */}
      <DataTable
        columns={columns}
        data={filteredServices}
        loading={loading}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'Search specialities by name or description...',
        }}
        filters={[
          {
            name: 'category',
            label: 'All Categories',
            options: categories.map((c) => ({ label: c.name, value: c.name })),
            value: selectedCategory,
            onChange: setSelectedCategory,
          },
        ]}
        emptyMessage="No clinical specialities found."
      />

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingService ? 'Edit Clinical Speciality' : 'Add New Clinical Speciality'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update clinical procedures, benefits, and local media.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Speciality Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Personalized Antenatal Care"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Pregnancy & Maternity Care">Pregnancy & Maternity Care</option>
                    <option value="Gynaecology & Women Health">Gynaecology & Women Health</option>
                    <option value="Laparoscopic Surgery">Laparoscopic Surgery</option>
                    <option value="Infertility & Conception">Infertility & Conception</option>
                    <option value="Ultrasound & Diagnostics">Ultrasound & Diagnostics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Short Summary (Shown on Cards) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise 1-2 sentence overview for patient awareness..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Clinical Description
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="In-depth details on protocol, equipment, patient eligibility, and care..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Treatments & Procedures (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.treatments}
                  onChange={(e) => setFormData({ ...formData, treatments: e.target.value })}
                  placeholder="Trimester Screening, Fetal Growth Scan, Nutrition Planning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Patient Benefits (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="24*7 Emergency Support, Continuous Fetal Monitoring, Compassionate Delivery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Featured Image (Saved to local server disk)
                </label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div className="flex items-center gap-6 pt-5">
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-xs font-semibold text-gray-700">Featured</span>
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
                  {editingService ? 'Save Changes' : 'Create Speciality'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jogi-Style Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, service: null, loading: false })}
        onConfirm={confirmDelete}
        title="Delete Speciality?"
        message={`Are you sure you want to delete ${deleteModal.service?.name}? This will remove it from the public services listing.`}
        confirmLabel="Delete Speciality"
        variant="danger"
        loading={deleteModal.loading}
      />
    </div>
  );
}

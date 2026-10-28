'use client';

import React, { useEffect, useState } from 'react';
import { Menu, Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface MenuItemType {
  _id: string;
  label: string;
  url: string;
  sortOrder: number;
  isHeader: boolean;
  isFooter: boolean;
  footerSection?: string;
  isActive: boolean;
}

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);

  const [formData, setFormData] = useState({
    label: '',
    url: '',
    sortOrder: 0,
    isHeader: true,
    isFooter: false,
    footerSection: 'quick_links',
    isActive: true,
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await adminApi.get('/menus');
      if (res.data.success) {
        setMenus(res.data.data);
      }
    } catch {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: MenuItemType) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        url: item.url,
        sortOrder: item.sortOrder,
        isHeader: item.isHeader,
        isFooter: item.isFooter,
        footerSection: item.footerSection || 'quick_links',
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '',
        url: '',
        sortOrder: menus.length + 1,
        isHeader: true,
        isFooter: false,
        footerSection: 'quick_links',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url) {
      toast.error('Label and URL are required');
      return;
    }

    try {
      if (editingItem) {
        const res = await adminApi.put(`/menus/${editingItem._id}`, formData);
        if (res.data.success) {
          toast.success('Menu item updated');
          fetchMenus();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/menus', formData);
        if (res.data.success) {
          toast.success('Menu item added');
          fetchMenus();
          setIsModalOpen(false);
        }
      }
    } catch {
      toast.error('Failed to save menu item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await adminApi.delete(`/menus/${id}`);
      if (res.data.success) {
        toast.success('Menu item deleted');
        fetchMenus();
      }
    } catch {
      toast.error('Failed to delete menu item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-slate-900 font-heading flex items-center gap-2">
            <Menu className="w-6 h-6 text-brand-teal-600" />
            <span>Navigation & Menu CMS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage header and footer navigation links, internal routes, and ordering.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Link</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-teal-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Label</th>
                  <th className="py-3.5 px-4">URL / Path</th>
                  <th className="py-3.5 px-4 text-center">Header</th>
                  <th className="py-3.5 px-4 text-center">Footer</th>
                  <th className="py-3.5 px-4 text-center">Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menus.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-brand-slate-900">{item.label}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-brand-teal-700">{item.url}</td>
                    <td className="py-3.5 px-4 text-center">
                      {item.isHeader ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.isFooter ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {item.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-brand-teal-700 hover:bg-brand-teal-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-slate-900 font-heading">
                {editingItem ? 'Edit Menu Link' : 'Add Menu Link'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Menu Label *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Services"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination URL / Path *</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="e.g. /services"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHeader}
                    onChange={(e) => setFormData({ ...formData, isHeader: e.target.checked })}
                    className="w-4 h-4 text-brand-teal-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Show in Header</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFooter}
                    onChange={(e) => setFormData({ ...formData, isFooter: e.target.checked })}
                    className="w-4 h-4 text-brand-teal-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Show in Footer</span>
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
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


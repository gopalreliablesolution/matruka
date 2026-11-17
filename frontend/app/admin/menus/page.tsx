'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Menu,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  CornerDownRight,
  Layers,
  ExternalLink,
  ChevronRight,
  FolderTree,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

export interface MenuItemType {
  _id: string;
  label: string;
  url: string;
  sortOrder: number;
  isHeader: boolean;
  isFooter: boolean;
  footerSection?: 'quick_links' | 'specialities' | 'patient_info';
  isActive: boolean;
  parentId?: string | { _id: string; label: string; url: string } | null;
}

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'header' | 'footer'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: MenuItemType | null;
    loading: boolean;
  }>({
    isOpen: false,
    item: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    label: '',
    url: '',
    parentId: '',
    sortOrder: 1,
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

  const getParentIdStr = (item: MenuItemType): string | null => {
    if (!item.parentId) return null;
    if (typeof item.parentId === 'object' && item.parentId !== null) {
      return item.parentId._id;
    }
    return String(item.parentId);
  };

  const topLevelMenus = useMemo(() => {
    return menus
      .filter((m) => !getParentIdStr(m))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [menus]);

  const getChildrenOf = (parentId: string): MenuItemType[] => {
    return menus
      .filter((m) => getParentIdStr(m) === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const handleOpenModal = (item?: MenuItemType, defaultParentId?: string) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        url: item.url,
        parentId: getParentIdStr(item) || '',
        sortOrder: item.sortOrder || 1,
        isHeader: item.isHeader,
        isFooter: item.isFooter,
        footerSection: item.footerSection || 'quick_links',
        isActive: item.isActive,
      });
    } else {
      const pId = defaultParentId || '';
      const siblings = pId ? getChildrenOf(pId) : topLevelMenus;
      const nextOrder = siblings.length > 0 ? Math.max(...siblings.map((s) => s.sortOrder)) + 1 : 1;

      setEditingItem(null);
      setFormData({
        label: '',
        url: '',
        parentId: pId,
        sortOrder: nextOrder,
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
    if (!formData.label.trim() || !formData.url.trim()) {
      toast.error('Menu Label and Destination URL are required');
      return;
    }

    const payload = {
      ...formData,
      label: formData.label.trim(),
      url: formData.url.trim(),
      sortOrder: Number(formData.sortOrder) || 1,
      parentId: formData.parentId && formData.parentId !== 'none' ? formData.parentId : null,
    };

    try {
      if (editingItem) {
        const res = await adminApi.put(`/menus/${editingItem._id}`, payload);
        if (res.data.success) {
          toast.success(`Updated "${payload.label}" successfully`);
          fetchMenus();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/menus', payload);
        if (res.data.success) {
          toast.success(`Created "${payload.label}" successfully`);
          fetchMenus();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save menu item');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/menus/${deleteModal.item._id}`);
      if (res.data.success) {
        toast.success('Menu item deleted');
        setDeleteModal({ isOpen: false, item: null, loading: false });
        fetchMenus();
      }
    } catch {
      toast.error('Failed to delete menu item');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Reordering function: swaps items inside the same sibling tier
  const handleMove = async (item: MenuItemType, direction: 'up' | 'down') => {
    const parentId = getParentIdStr(item);
    const siblings = parentId ? getChildrenOf(parentId) : topLevelMenus;
    const currentIndex = siblings.findIndex((s) => s._id === item._id);

    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const swapped = [...siblings];
    const temp = swapped[currentIndex];
    swapped[currentIndex] = swapped[targetIndex];
    swapped[targetIndex] = temp;

    // Build reorder items array
    const reorderPayload = swapped.map((sibling, idx) => ({
      id: sibling._id,
      sortOrder: idx + 1,
      parentId: parentId || null,
    }));

    try {
      setReordering(true);
      // Optimistic update
      setMenus((prev) =>
        prev.map((m) => {
          const found = reorderPayload.find((p) => p.id === m._id);
          return found ? { ...m, sortOrder: found.sortOrder } : m;
        })
      );

      const res = await adminApi.put('/menus/reorder', { items: reorderPayload });
      if (res.data.success) {
        toast.success(`Moved "${item.label}" ${direction}`);
        setMenus(res.data.data);
      }
    } catch {
      toast.error('Failed to update menu order');
      fetchMenus();
    } finally {
      setReordering(false);
    }
  };

  const filteredTopLevel = useMemo(() => {
    if (activeTab === 'header') {
      return topLevelMenus.filter((m) => m.isHeader);
    }
    if (activeTab === 'footer') {
      return topLevelMenus.filter((m) => m.isFooter);
    }
    return topLevelMenus;
  }, [topLevelMenus, activeTab]);

  return (
    <>
      <div className="space-y-6">
      <AdminPageHeader
        title="Navigation & Menu CMS"
        description="Manage top-level navigation, nested dropdown submenus, footer links, and precise display ordering."
        icon={Menu}
        breadcrumb={[{ label: 'Header & Footer Menus' }]}
        actions={
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="admin-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Link</span>
          </button>
        }
      />

      {/* Scope Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Items ({menus.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('header')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'header'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Header Navigation ({menus.filter((m) => m.isHeader).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('footer')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'footer'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Footer Links ({menus.filter((m) => m.isFooter).length})
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Tip: Use <ArrowUp className="inline w-3 h-3 text-primary" /> and{' '}
          <ArrowDown className="inline w-3 h-3 text-primary" /> to reorder items instantly.
        </p>
      </div>

      {/* Menus Table */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-slate-500">Loading navigation tree...</p>
          </div>
        ) : filteredTopLevel.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <FolderTree className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No menu links found in this view.</p>
            <p className="text-xs text-slate-400 mt-1">Click &ldquo;Add Menu Link&rdquo; to start configuring your website navigation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[50rem] text-left text-xs sm:text-sm divide-y divide-slate-200">
              <thead className="sticky top-0 z-10 bg-[#F6F8F9] text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-20 text-center">Order</th>
                  <th className="py-3 px-4">Menu Structure & Label</th>
                  <th className="py-3 px-4">Destination URL / Path</th>
                  <th className="py-3 px-3 text-center">Header</th>
                  <th className="py-3 px-3 text-center">Footer</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTopLevel.map((parent, pIndex) => {
                  const children = getChildrenOf(parent._id);
                  const isFirstParent = pIndex === 0;
                  const isLastParent = pIndex === filteredTopLevel.length - 1;

                  return (
                    <React.Fragment key={parent._id}>
                      {/* Top-Level Menu Row */}
                      <tr className="hover:bg-slate-50/70 transition bg-white">
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary font-bold text-xs">
                              {parent.sortOrder}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={isFirstParent || reordering}
                                onClick={() => handleMove(parent, 'up')}
                                className="p-0.5 text-slate-400 hover:text-primary disabled:opacity-20 disabled:hover:text-slate-400"
                                title="Move Up"
                                aria-label={`Move ${parent.label} up`}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLastParent || reordering}
                                onClick={() => handleMove(parent, 'down')}
                                className="p-0.5 text-slate-400 hover:text-primary disabled:opacity-20 disabled:hover:text-slate-400"
                                title="Move Down"
                                aria-label={`Move ${parent.label} down`}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {parent.label}
                            </span>
                            {children.length > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-primary border border-teal-200">
                                <Layers className="w-3 h-3" />
                                {children.length} submenus
                              </span>
                            ) : (
                              <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                                Top Level
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-primary font-medium">
                          {parent.url}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {parent.isHeader ? (
                            <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mx-auto" />
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {parent.isFooter ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              <Check className="w-3 h-3" />
                              {parent.footerSection === 'patient_info'
                                ? 'Info'
                                : parent.footerSection === 'specialities'
                                ? 'Specs'
                                : 'Links'}
                            </span>
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mx-auto" />
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                              parent.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {parent.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(undefined, parent._id)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition"
                              title="Add child submenu item under this menu"
                            >
                              <CornerDownRight className="w-3.5 h-3.5" />
                              <span>Submenu</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenModal(parent)}
                              className="p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition"
                              title="Edit menu link"
                              aria-label={`Edit ${parent.label}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteModal({ isOpen: true, item: parent, loading: false })
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete menu link"
                              aria-label={`Delete ${parent.label}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Submenus Rendered Nested Under This Parent */}
                      {children.map((child, cIndex) => {
                        const isFirstChild = cIndex === 0;
                        const isLastChild = cIndex === children.length - 1;

                        return (
                          <tr
                            key={child._id}
                            className="bg-slate-50/50 hover:bg-slate-100/60 transition border-l-4 border-l-primary/40"
                          >
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                                  {child.sortOrder}
                                </span>
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    type="button"
                                    disabled={isFirstChild || reordering}
                                    onClick={() => handleMove(child, 'up')}
                                    className="p-0.5 text-slate-400 hover:text-primary disabled:opacity-20 disabled:hover:text-slate-400"
                                    title="Move Submenu Up"
                                    aria-label={`Move ${child.label} up`}
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isLastChild || reordering}
                                    onClick={() => handleMove(child, 'down')}
                                    className="p-0.5 text-slate-400 hover:text-primary disabled:opacity-20 disabled:hover:text-slate-400"
                                    title="Move Submenu Down"
                                    aria-label={`Move ${child.label} down`}
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-4 pl-8">
                              <div className="flex items-center gap-2">
                                <CornerDownRight className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                                <span className="font-semibold text-slate-800 text-xs">
                                  {child.label}
                                </span>
                                <span className="inline-block text-[9px] uppercase tracking-wider font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                  under {parent.label}
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">
                              {child.url}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              {child.isHeader ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              {child.isFooter ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                                  child.isActive
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {child.isActive ? 'Active' : 'Hidden'}
                              </span>
                            </td>

                            <td className="py-2.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenModal(child)}
                                  className="p-1 text-slate-600 hover:text-primary hover:bg-slate-200/60 rounded transition"
                                  title="Edit submenu link"
                                  aria-label={`Edit ${child.label}`}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteModal({ isOpen: true, item: child, loading: false })
                                  }
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                                  title="Delete submenu link"
                                  aria-label={`Delete ${child.label}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* Add / Edit Menu Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 !m-0 !mt-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 font-heading">
                {editingItem ? `Edit Menu Link: ${editingItem.label}` : 'Add New Menu Link'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Menu Label *
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Services, About Us, Tour"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination URL / Internal Path *
                </label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="e.g. /services, /about, /tour"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Use internal paths like <code className="text-primary font-mono">/services</code> or full URLs like <code className="text-primary font-mono">https://...</code>
                </p>
              </div>

              {/* Parent Menu (Submenu Selector) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Parent Menu (Hierarchy / Dropdown Placement)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => {
                    const newParent = e.target.value;
                    const siblings = newParent ? getChildrenOf(newParent) : topLevelMenus;
                    const nextOrder = siblings.length > 0 ? Math.max(...siblings.map((s) => s.sortOrder)) + 1 : 1;
                    setFormData({
                      ...formData,
                      parentId: newParent,
                      sortOrder: nextOrder,
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                >
                  <option value="">None (Top-Level Main Menu)</option>
                  {topLevelMenus
                    .filter((m) => !editingItem || m._id !== editingItem._id)
                    .map((m) => (
                      <option key={m._id} value={m._id}>
                        ↳ Place inside: {m.label} ({m.url})
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Selecting a parent menu automatically nests this link as a dropdown item under that menu.
                </p>
              </div>

              {/* Order Number */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Display Order (# Index)
                </label>
                <input
                  type="number"
                  min={1}
                  max={999}
                  required
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Lower numbers display first (1, 2, 3...). You can also reorder using the arrows on the main list.
                </p>
              </div>

              {/* Navigation Placements */}
              <div className="rounded-xl bg-slate-50 p-3 space-y-2 border border-slate-100">
                <p className="text-xs font-bold text-slate-700">Display Settings</p>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isHeader}
                      onChange={(e) => setFormData({ ...formData, isHeader: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="font-semibold text-slate-700 text-xs">Show in Header</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFooter}
                      onChange={(e) => setFormData({ ...formData, isFooter: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="font-semibold text-slate-700 text-xs">Show in Footer</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="font-semibold text-slate-700 text-xs">Active on Site</span>
                  </label>
                </div>

                {formData.isFooter && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <label className="block font-semibold text-slate-700 mb-1 text-xs">
                      Footer Column / Section
                    </label>
                    <select
                      value={formData.footerSection}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          footerSection: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                    >
                      <option value="quick_links">Quick Links</option>
                      <option value="specialities">Clinical Specialities</option>
                      <option value="patient_info">Patient Information & Legal</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-xs transition"
                >
                  {editingItem ? 'Update Link' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, item: null, loading: false })
        }
        onConfirm={handleDelete}
        title="Delete Menu Link?"
        message={`Are you sure you want to delete “${deleteModal.item?.label || 'this link'}”? Any submenus under this item will automatically be preserved as top-level links.`}
        confirmLabel="Delete Link"
        variant="danger"
        loading={deleteModal.loading}
      />
    </>
  );
}

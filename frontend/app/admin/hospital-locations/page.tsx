'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Check,
  X,
  Phone,
  Mail,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import Breadcrumb from '@/components/admin/Breadcrumb';
import ConfirmModal from '@/components/admin/ConfirmModal';
import toast from 'react-hot-toast';

interface HospitalLocationItem {
  _id: string;
  sectionTitle: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  days: string;
  hours: string;
  mapEmbedUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function AdminHospitalLocationsPage() {
  const [locations, setLocations] = useState<HospitalLocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<HospitalLocationItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sectionTitle: 'Visit Our Clinic',
    name: '',
    address: '',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395007',
    phone: '',
    email: '',
    days: 'Monday to Saturday',
    hours: '10:00 AM to 1:00 PM | 5:00 PM to 7:00 PM',
    mapEmbedUrl: '',
    isActive: true,
    order: 1,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    location: HospitalLocationItem | null;
    loading: boolean;
  }>({
    isOpen: false,
    location: null,
    loading: false,
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/hospital-locations');
      if (res.data?.success) {
        setLocations(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load hospital locations:', err);
      toast.error('Failed to load hospital locations');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingLocation(null);
    setFormData({
      sectionTitle: 'Visit Our Clinic',
      name: '',
      address: '',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      phone: '7984882273',
      email: 'info@matruka.in',
      days: 'Monday to Saturday',
      hours: '10:00 AM to 1:00 PM | 5:00 PM to 7:00 PM',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.1557991965564!2d72.7797779759714!3d21.146200283737225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be05307bdfbcdd7%3A0xe54e1f7481ba2aa6!2sSolaris%20Cure!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin',
      isActive: true,
      order: locations.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (loc: HospitalLocationItem) => {
    setEditingLocation(loc);
    setFormData({
      sectionTitle: loc.sectionTitle || 'Visit Our Clinic',
      name: loc.name || '',
      address: loc.address || '',
      city: loc.city || 'Surat',
      state: loc.state || 'Gujarat',
      pincode: loc.pincode || '395007',
      phone: loc.phone || '',
      email: loc.email || '',
      days: loc.days || 'Monday to Saturday',
      hours: loc.hours || '10:00 AM to 1:00 PM | 5:00 PM to 7:00 PM',
      mapEmbedUrl: loc.mapEmbedUrl || '',
      isActive: loc.isActive ?? true,
      order: loc.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error('Clinic name and address are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingLocation) {
        const res = await adminApi.put(`/hospital-locations/${editingLocation._id}`, formData);
        if (res.data?.success) {
          toast.success('Hospital location updated');
          setIsModalOpen(false);
          fetchLocations();
        }
      } else {
        const res = await adminApi.post('/hospital-locations', formData);
        if (res.data?.success) {
          toast.success('Hospital location created');
          setIsModalOpen(false);
          fetchLocations();
        }
      }
    } catch (err: any) {
      console.error('Error saving location:', err);
      toast.error(err.response?.data?.error || 'Failed to save location');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (loc: HospitalLocationItem) => {
    try {
      const res = await adminApi.put(`/hospital-locations/${loc._id}`, {
        isActive: !loc.isActive,
      });
      if (res.data?.success) {
        toast.success(`Location ${!loc.isActive ? 'activated' : 'deactivated'}`);
        fetchLocations();
      }
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.location) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const res = await adminApi.delete(`/hospital-locations/${deleteModal.location._id}`);
      if (res.data?.success) {
        toast.success('Location deleted successfully');
        setDeleteModal({ isOpen: false, location: null, loading: false });
        fetchLocations();
      }
    } catch (err: any) {
      toast.error('Failed to delete location');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Hospital Locations & Contact' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-gray-900">
            Hospital Locations & Contact
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your hospital clinics, address, OPD consultation hours, direct helpline, and Google Maps embed.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-xs sm:text-sm font-semibold shadow-sm hover:shadow active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Add New Location</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Clinic Name & Section</th>
                <th className="px-5 py-3.5">Address & City</th>
                <th className="px-5 py-3.5">Days & Hours</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Map Status</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Loading hospital locations...</p>
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">No locations found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click &quot;Add New Location&quot; to configure your hospital address.
                    </p>
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc._id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{loc.name}</div>
                      <span className="inline-block mt-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {loc.sectionTitle || 'Visit Our Clinic'}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <div className="text-xs text-gray-700 leading-snug">{loc.address}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {loc.city}, {loc.state} - {loc.pincode}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-primary">{loc.days}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{loc.hours}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Phone size={13} className="text-primary" />
                        <span>{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                        <Mail size={13} className="text-gray-400" />
                        <span>{loc.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {loc.mapEmbedUrl ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                          <Check size={13} />
                          Embed Connected
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">No embed URL</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(loc)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          loc.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            loc.isActive ? 'bg-emerald-600' : 'bg-gray-400'
                          }`}
                        />
                        <span>{loc.isActive ? 'Active' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(loc)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit location"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, location: loc, loading: false })}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete location"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary w-5 h-5" />
                <h3 className="text-base sm:text-lg font-bold font-heading text-gray-900">
                  {editingLocation ? 'Edit Hospital Location' : 'Add New Hospital Location'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sectionTitle}
                    onChange={(e) => setFormData({ ...formData, sectionTitle: e.target.value })}
                    placeholder="e.g. Visit Our Clinic"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Clinic / Hospital Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. MatruKa — Complete Care for Her"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Street Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 303-306, Solaris Cure, Beside Ratnajyoti Apartment, VIP Road"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Helpline / Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 7984882273"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. info@matruka.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Working Days
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    placeholder="e.g. Monday to Saturday"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    OPD Consultation Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="e.g. 10:00 AM to 1:00 PM | 5:00 PM to 7:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Google Maps Embed URL (iframe src)
                </label>
                <input
                  type="text"
                  value={formData.mapEmbedUrl}
                  onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-xs"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Copy the &apos;src&apos; URL from Google Maps &gt; Share &gt; Embed a map.
                </p>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-semibold text-gray-700">Display on Public Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm disabled:opacity-50"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{editingLocation ? 'Update Location' : 'Save Location'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, location: null, loading: false })}
        onConfirm={confirmDelete}
        loading={deleteModal.loading}
        title="Delete Hospital Location"
        message={`Are you sure you want to delete "${deleteModal.location?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

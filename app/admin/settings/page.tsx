'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, Loader2, Check, Globe, MapPin, Phone, Clock, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import Breadcrumb from '@/components/admin/Breadcrumb';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'timings' | 'seo' | 'social'>('general');

  const [formData, setFormData] = useState({
    clinicName: 'Matruka',
    gujaratiName: 'માતૃકા',
    tagline: 'Complete Care for Her',
    appointmentPhone: '7984882273',
    emergencyPhone: '7984882273',
    whatsappNumber: '917984882273',
    email: 'info@matruka.in',
    website: 'www.matruka.in',
    address: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
    landmark: 'Besides Ratnajyoti Apartment, VIP Road',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395007',
    googleMapsEmbedUrl: '',
    googleMapsDirectionsUrl: '',
    opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
    sundayTimings: 'Emergency Only (24*7)',
    emergencyHours: '24*7 Available for Obstetrics & Emergency',
    announcementBarText: 'OPD Timings: 10:00 AM - 1:00 PM & 5:00 PM - 7:00 PM (Mon-Sat) | 24*7 Emergency Care Available',
    isAnnouncementActive: true,
    copyrightText: '© 2026 Matruka — Complete Care for Her. All rights reserved.',
    socialLinks: {
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
    },
    seoDefaults: {
      metaTitle: 'Matruka — Complete Care for Her | Best OBGYN & Maternity Clinic in Surat',
      metaDescription: 'Expert Obstetrics & Gynaecology, Advanced Laparoscopic Surgery, and Infertility Care in Surat led by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road.',
      keywords: 'gynecologist in surat, maternity clinic surat, Dr Kairavi Yagnik, Dr Rut Shah, normal delivery, laparoscopic surgery surat, infertility clinic surat',
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/settings');
      if (res.data?.success && res.data.data) {
        setFormData(res.data.data);
      }
    } catch {
      toast.error('Failed to load website settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminApi.put('/settings', formData);
      if (res.data?.success) {
        toast.success('Website settings updated live!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <Breadcrumb
          items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Clinic Settings' }]}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinic & Website Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure clinic address, verified telephone lines, OPD timings, and SEO parameters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Updating...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        {[
          { key: 'general', label: 'General Identity', icon: Globe },
          { key: 'contact', label: 'Contact & Address', icon: MapPin },
          { key: 'timings', label: 'OPD & Emergency Hours', icon: Clock },
          { key: 'seo', label: 'SEO Defaults', icon: Sparkles },
          { key: 'social', label: 'Social Profiles', icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs sm:text-sm border-b-2 transition whitespace-nowrap ${isActive
                  ? 'border-primary text-primary bg-teal-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-gray-500 font-medium">Loading settings from database...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Brand & Header Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Clinic Brand Name</label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Gujarati Script Name</label>
                  <input
                    type="text"
                    value={formData.gujaratiName}
                    onChange={(e) => setFormData({ ...formData, gujaratiName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAnnouncementActive}
                    onChange={(e) => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-xs font-bold text-gray-800">Display Top Announcement Bar</span>
                </label>
                <input
                  type="text"
                  value={formData.announcementBarText}
                  onChange={(e) => setFormData({ ...formData, announcementBarText: e.target.value })}
                  placeholder="Announcement ticker text..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Contact & Navigation Coordinates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Appointment Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.appointmentPhone}
                    onChange={(e) => setFormData({ ...formData, appointmentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-semibold text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">24*7 Emergency Line *</label>
                  <input
                    type="text"
                    required
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-semibold text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Chat Number</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Clinic Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Google Maps Embed Iframe URL</label>
                  <input
                    type="text"
                    value={formData.googleMapsEmbedUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsEmbedUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Directions Direct URL</label>
                  <input
                    type="text"
                    value={formData.googleMapsDirectionsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsDirectionsUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timings' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Consultation Hours & Availability</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Monday - Saturday OPD Hours</label>
                <input
                  type="text"
                  value={formData.opdTimings}
                  onChange={(e) => setFormData({ ...formData, opdTimings: e.target.value })}
                  placeholder="10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-semibold text-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sunday Timings</label>
                  <input
                    type="text"
                    value={formData.sundayTimings}
                    onChange={(e) => setFormData({ ...formData, sundayTimings: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Coverage Status</label>
                  <input
                    type="text"
                    value={formData.emergencyHours}
                    onChange={(e) => setFormData({ ...formData, emergencyHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-semibold text-emerald-700"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Search Engine Optimization (SEO)</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Global Meta Title</label>
                <input
                  type="text"
                  value={formData.seoDefaults?.metaTitle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoDefaults: { ...formData.seoDefaults, metaTitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Global Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.seoDefaults?.metaDescription || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoDefaults: { ...formData.seoDefaults, metaDescription: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">SEO Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.seoDefaults?.keywords || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoDefaults: { ...formData.seoDefaults, keywords: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Social Media Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram Profile</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook Page</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? 'Updating...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

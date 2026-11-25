'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, Loader2, Check, Globe, MapPin, Phone, Clock, Share2, Search, AlertCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ImageUpload from '@/components/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'timings' | 'seo' | 'social'>('general');
  const [contactSectionId, setContactSectionId] = useState<string | null>(null);
  const [contactSectionSettings, setContactSectionSettings] = useState<any>({});

  const [formData, setFormData] = useState({
    clinicName: 'Matruka',
    gujaratiName: 'માતૃકા',
    tagline: 'Complete Care for Her',
    logoUrl: '',
    logoWhiteUrl: '',
    footerAboutText: 'Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.',
    footerBadge1: 'FOGSI Certified Ultrasound',
    footerBadge2: 'Laparoscopic Surgeons',
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
      const [res, secRes] = await Promise.all([
        adminApi.get('/settings'),
        adminApi.get('/homepage-sections').catch(() => null),
      ]);

      let footerLogoFromSec = '';
      let footerAboutFromSec = '';
      let footerBadge1FromSec = '';
      let footerBadge2FromSec = '';
      if (secRes?.data?.success && Array.isArray(secRes.data.data)) {
        const contactSec = secRes.data.data.find((s: any) => s.sectionKey === 'location_contact');
        if (contactSec) {
          setContactSectionId(contactSec._id);
          setContactSectionSettings(contactSec.settings || {});
          footerLogoFromSec = contactSec.settings?.footerLogo || '';
          footerAboutFromSec = contactSec.settings?.footerAboutText || '';
          footerBadge1FromSec = contactSec.settings?.footerBadge1 || '';
          footerBadge2FromSec = contactSec.settings?.footerBadge2 || '';
        }
      }

      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        const activeHeaderLogo = d.logoUrl && d.logoUrl !== '/logo.png' ? d.logoUrl : '';
        const activeFooterLogo = footerLogoFromSec || (d.logoWhiteUrl && d.logoWhiteUrl !== '/logo-white.png' ? d.logoWhiteUrl : '');
        setFormData({
          ...d,
          logoUrl: activeHeaderLogo,
          logoWhiteUrl: activeFooterLogo,
          footerAboutText: footerAboutFromSec || d.footerAboutText || 'Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.',
          footerBadge1: footerBadge1FromSec || d.footerBadge1 || 'FOGSI Certified Ultrasound',
          footerBadge2: footerBadge2FromSec || d.footerBadge2 || 'Laparoscopic Surgeons',
        });
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
      const payload = {
        ...formData,
        logoUrl: formData.logoUrl || '',
        logoWhiteUrl: formData.logoWhiteUrl || '',
        footerAboutText: formData.footerAboutText || '',
        footerBadge1: formData.footerBadge1 || '',
        footerBadge2: formData.footerBadge2 || '',
      };

      const promises: Promise<any>[] = [adminApi.put('/settings', payload)];

      // Persist footer settings reliably in HomepageSection settings as well
      if (contactSectionId) {
        promises.push(
          adminApi.put(`/homepage-sections/${contactSectionId}`, {
            settings: {
              ...contactSectionSettings,
              footerLogo: formData.logoWhiteUrl || '',
              footerAboutText: formData.footerAboutText || '',
              footerBadge1: formData.footerBadge1 || '',
              footerBadge2: formData.footerBadge2 || '',
            },
          })
        );
      }

      await Promise.all(promises);
      toast.success('Website settings & logos updated live!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Clinic & Website Settings"
        description="Configure clinic identity, verified contact details, OPD timings, SEO defaults, and social profiles."
        icon={Settings}
        breadcrumb={[{ label: 'Hospital Settings & Hours' }]}
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn-primary"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>{saving ? 'Updating...' : 'Save All Settings'}</span>
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        {[
          { key: 'general', label: 'General Identity', icon: Globe },
          { key: 'contact', label: 'Contact & Address', icon: MapPin },
          { key: 'timings', label: 'OPD & Emergency Hours', icon: Clock },
          { key: 'seo', label: 'SEO Defaults', icon: Search },
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
                  ? 'border-primary text-primary bg-primary-light/15 rounded-t-lg'
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
        <form onSubmit={handleSave} className="admin-card space-y-6 p-6">
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

              {/* Logos & Branding */}
              <div className="pt-3 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Clinic Logos & Branding</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <div>
                      <ImageUpload
                        label="Header Logo (Color / Light Theme)"
                        value={formData.logoUrl}
                        onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                        altText="MatruKa Header Logo"
                      />
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-medium">
                        {formData.logoUrl ? '✓ Custom logo active' : 'Default active: /logo.png'}
                      </span>
                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logoUrl: '' })}
                          className="text-red-600 hover:underline font-semibold cursor-pointer"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <div>
                      <ImageUpload
                        label="Footer Logo (White / Dark Background)"
                        value={formData.logoWhiteUrl}
                        onChange={(url) => setFormData({ ...formData, logoWhiteUrl: url })}
                        altText="MatruKa Footer Logo"
                        isDarkPreview={true}
                      />
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-medium">
                        {formData.logoWhiteUrl ? '✓ Custom logo active' : 'Default active: /logo-white.png'}
                      </span>
                      {formData.logoWhiteUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logoWhiteUrl: '' })}
                          className="text-red-600 hover:underline font-semibold cursor-pointer"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Brand Description & Trust Badges */}
                <div className="mt-5 pt-4 border-t border-gray-200/80 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Footer Brand Description &amp; Trust Badges
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Footer Brand Summary / Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.footerAboutText}
                      onChange={(e) => setFormData({ ...formData, footerAboutText: e.target.value })}
                      placeholder="Surat’s dedicated women’s healthcare, pregnancy..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm leading-relaxed"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Displayed directly below the white logo in the website footer.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Footer Trust Badge 1
                      </label>
                      <input
                        type="text"
                        value={formData.footerBadge1}
                        onChange={(e) => setFormData({ ...formData, footerBadge1: e.target.value })}
                        placeholder="FOGSI Certified Ultrasound"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Footer Trust Badge 2
                      </label>
                      <input
                        type="text"
                        value={formData.footerBadge2}
                        onChange={(e) => setFormData({ ...formData, footerBadge2: e.target.value })}
                        placeholder="Laparoscopic Surgeons"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
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

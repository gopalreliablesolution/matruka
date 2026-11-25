'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Settings,
  Save,
  Loader2,
  Globe,
  MapPin,
  Phone,
  Clock,
  Share2,
  Search,
  MessageSquare,
  RotateCcw,
  MessageCircle,
  X,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ImageUpload from '@/components/ImageUpload';
import SafeImage from '@/components/SafeImage';
import toast from 'react-hot-toast';

const DEFAULT_POPUP_SETTINGS = {
  isActive: true,
  title: 'Matruka Women’s Hospital',
  subtitle: 'Complete Care for Her • Surat',
  showHeader: true,
  description:
    'Welcome to Matruka. For any clinical inquiries, maternity care, or emergency help, contact our care desk directly:',
  showDescription: true,
  imageUrl: '',
  showImage: false,
  showInfo: true,
  showOpd: true,
  opdText: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
  showAddress: true,
  addressText: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
  showWhatsapp: true,
  whatsappText: 'Connect on WhatsApp',
  whatsappNumber: '917984882273',
  whatsappMessage: 'Hello Matruka, I would like to inquire regarding clinic consultation and facilities.',
  showCall: true,
  callText: 'Call Helpline',
  callNumber: '7984882273',
  showDismiss: true,
  dismissText: 'Continue to website →',
  delaySeconds: 3.5,
  showOncePerSession: true,
};

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'timings' | 'popup' | 'seo' | 'social'>('general');
  const [contactSectionId, setContactSectionId] = useState<string | null>(null);
  const [contactSectionSettings, setContactSectionSettings] = useState<any>({});

  const [formData, setFormData] = useState({
    clinicName: 'Matruka',
    gujaratiName: 'માતૃકા',
    tagline: 'Complete Care for Her',
    logoUrl: '',
    logoWhiteUrl: '',
    footerAboutText:
      'Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.',
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
    announcementBarText:
      'OPD Timings: 10:00 AM - 1:00 PM & 5:00 PM - 7:00 PM (Mon-Sat) | 24*7 Emergency Care Available',
    isAnnouncementActive: true,
    copyrightText: '© 2026 Matruka — Complete Care for Her. All rights reserved.',
    popup: { ...DEFAULT_POPUP_SETTINGS },
    socialLinks: {
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
    },
    seoDefaults: {
      metaTitle: 'Matruka — Complete Care for Her | Best OBGYN & Maternity Clinic in Surat',
      metaDescription:
        'Expert Obstetrics & Gynaecology, Advanced Laparoscopic Surgery, and Infertility Care in Surat led by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road.',
      keywords:
        'gynecologist in surat, maternity clinic surat, Dr Kairavi Yagnik, Dr Rut Shah, normal delivery, laparoscopic surgery surat, infertility clinic surat',
    },
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['general', 'contact', 'timings', 'popup', 'seo', 'social'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

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
      let popupFromSec: any = null;
      if (secRes?.data?.success && Array.isArray(secRes.data.data)) {
        const contactSec = secRes.data.data.find((s: any) => s.sectionKey === 'location_contact');
        if (contactSec) {
          setContactSectionId(contactSec._id);
          setContactSectionSettings(contactSec.settings || {});
          footerLogoFromSec = contactSec.settings?.footerLogo || '';
          footerAboutFromSec = contactSec.settings?.footerAboutText || '';
          footerBadge1FromSec = contactSec.settings?.footerBadge1 || '';
          footerBadge2FromSec = contactSec.settings?.footerBadge2 || '';
          popupFromSec = contactSec.settings?.popup || null;
        }
      }

      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        const activeHeaderLogo = d.logoUrl && d.logoUrl !== '/logo.png' ? d.logoUrl : '';
        const activeFooterLogo =
          footerLogoFromSec || (d.logoWhiteUrl && d.logoWhiteUrl !== '/logo-white.png' ? d.logoWhiteUrl : '');
        const effectivePopup =
          d.popup?.isActive !== undefined
            ? d.popup
            : (popupFromSec?.isActive !== undefined ? popupFromSec : (d.popup || {}));

        setFormData({
          ...d,
          logoUrl: activeHeaderLogo,
          logoWhiteUrl: activeFooterLogo,
          footerAboutText:
            footerAboutFromSec ||
            d.footerAboutText ||
            'Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.',
          footerBadge1: footerBadge1FromSec || d.footerBadge1 || 'FOGSI Certified Ultrasound',
          footerBadge2: footerBadge2FromSec || d.footerBadge2 || 'Laparoscopic Surgeons',
          popup: {
            isActive: effectivePopup.isActive !== undefined ? effectivePopup.isActive : DEFAULT_POPUP_SETTINGS.isActive,
            title: effectivePopup.title || `${d.clinicName || 'Matruka'} Women’s Hospital`,
            subtitle: effectivePopup.subtitle || `${d.tagline || 'Complete Care for Her'} • Surat`,
            showHeader: effectivePopup.showHeader !== undefined ? effectivePopup.showHeader : DEFAULT_POPUP_SETTINGS.showHeader,
            description:
              effectivePopup.description ||
              `Welcome to ${d.clinicName || 'Matruka'}. For any clinical inquiries, maternity care, or emergency help, contact our care desk directly:`,
            showDescription:
              effectivePopup.showDescription !== undefined ? effectivePopup.showDescription : DEFAULT_POPUP_SETTINGS.showDescription,
            imageUrl: effectivePopup.imageUrl || '',
            showImage: effectivePopup.showImage !== undefined ? effectivePopup.showImage : DEFAULT_POPUP_SETTINGS.showImage,
            showInfo: effectivePopup.showInfo !== undefined ? effectivePopup.showInfo : DEFAULT_POPUP_SETTINGS.showInfo,
            showOpd: effectivePopup.showOpd !== undefined ? effectivePopup.showOpd : DEFAULT_POPUP_SETTINGS.showOpd,
            opdText: effectivePopup.opdText || d.opdTimings || DEFAULT_POPUP_SETTINGS.opdText,
            showAddress: effectivePopup.showAddress !== undefined ? effectivePopup.showAddress : DEFAULT_POPUP_SETTINGS.showAddress,
            addressText: effectivePopup.addressText || d.address || DEFAULT_POPUP_SETTINGS.addressText,
            showWhatsapp: effectivePopup.showWhatsapp !== undefined ? effectivePopup.showWhatsapp : DEFAULT_POPUP_SETTINGS.showWhatsapp,
            whatsappText: effectivePopup.whatsappText || DEFAULT_POPUP_SETTINGS.whatsappText,
            whatsappNumber: effectivePopup.whatsappNumber || d.whatsappNumber || DEFAULT_POPUP_SETTINGS.whatsappNumber,
            whatsappMessage: effectivePopup.whatsappMessage || DEFAULT_POPUP_SETTINGS.whatsappMessage,
            showCall: effectivePopup.showCall !== undefined ? effectivePopup.showCall : DEFAULT_POPUP_SETTINGS.showCall,
            callText: effectivePopup.callText || DEFAULT_POPUP_SETTINGS.callText,
            callNumber: effectivePopup.callNumber || d.appointmentPhone || DEFAULT_POPUP_SETTINGS.callNumber,
            showDismiss: effectivePopup.showDismiss !== undefined ? effectivePopup.showDismiss : DEFAULT_POPUP_SETTINGS.showDismiss,
            dismissText: effectivePopup.dismissText || DEFAULT_POPUP_SETTINGS.dismissText,
            delaySeconds:
              typeof effectivePopup.delaySeconds === 'number' ? effectivePopup.delaySeconds : DEFAULT_POPUP_SETTINGS.delaySeconds,
            showOncePerSession:
              effectivePopup.showOncePerSession !== undefined
                ? effectivePopup.showOncePerSession
                : DEFAULT_POPUP_SETTINGS.showOncePerSession,
          },
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
      const { _id, __v, createdAt, updatedAt, ...cleanFormData } = formData as any;
      const payload = {
        ...cleanFormData,
        logoUrl: formData.logoUrl || '',
        logoWhiteUrl: formData.logoWhiteUrl || '',
        footerAboutText: formData.footerAboutText || '',
        footerBadge1: formData.footerBadge1 || '',
        footerBadge2: formData.footerBadge2 || '',
        popup: formData.popup,
      };

      const promises: Promise<any>[] = [adminApi.put('/settings', payload)];

      // Persist footer settings reliably in HomepageSection settings as well
      if (contactSectionId) {
        promises.push(
          adminApi
            .put(`/homepage-sections/${contactSectionId}`, {
              settings: {
                ...contactSectionSettings,
                footerLogo: formData.logoWhiteUrl || '',
                footerAboutText: formData.footerAboutText || '',
                footerBadge1: formData.footerBadge1 || '',
                footerBadge2: formData.footerBadge2 || '',
                popup: formData.popup,
              },
            })
            .catch((err) => console.warn('Homepage section footer update ignored:', err))
        );
      }

      const [settingsRes] = await Promise.all(promises);
      if (settingsRes?.data?.data?.popup) {
        setFormData((prev) => ({
          ...prev,
          popup: settingsRes.data.data.popup,
        }));
      }
      toast.success('Website settings & pop-up modal updated live!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updatePopupField = (field: keyof typeof DEFAULT_POPUP_SETTINGS, value: any) => {
    setFormData((prev) => ({
      ...prev,
      popup: {
        ...prev.popup,
        [field]: value,
      },
    }));
  };

  const handleResetPopupDefaults = () => {
    if (confirm('Reset pop-up modal fields to default Matruka information?')) {
      setFormData((prev) => ({
        ...prev,
        popup: {
          ...DEFAULT_POPUP_SETTINGS,
          title: `${prev.clinicName || 'Matruka'} Women’s Hospital`,
          subtitle: `${prev.tagline || 'Complete Care for Her'} • Surat`,
          description: `Welcome to ${prev.clinicName || 'Matruka'}. For any clinical inquiries, maternity care, or emergency help, contact our care desk directly:`,
          opdText: prev.opdTimings || DEFAULT_POPUP_SETTINGS.opdText,
          addressText: prev.address || DEFAULT_POPUP_SETTINGS.addressText,
          whatsappNumber: prev.whatsappNumber || DEFAULT_POPUP_SETTINGS.whatsappNumber,
          callNumber: prev.appointmentPhone || DEFAULT_POPUP_SETTINGS.callNumber,
        },
      }));
      toast.success('Pop-up values restored to clinic defaults.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Clinic & Website Settings"
        description="Configure clinic identity, verified contact details, OPD timings, website pop-up modal, and SEO defaults."
        icon={Settings}
        breadcrumb={[{ label: 'Hospital Settings & Hours' }]}
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn-primary"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
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
          {
            key: 'popup',
            label: 'Pop-up Modal',
            icon: MessageSquare,
            badge: formData.popup?.isActive ? 'Active' : 'Disabled',
          },
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
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs sm:text-sm border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary-light/15 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tab.badge === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
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
          {/* General Tab */}
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Gujarati Name</label>
                  <input
                    type="text"
                    value={formData.gujaratiName}
                    onChange={(e) => setFormData({ ...formData, gujaratiName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Header Main Logo</label>
                  <ImageUpload
                    value={formData.logoUrl}
                    onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Dark Logo</label>
                  <ImageUpload
                    value={formData.logoWhiteUrl}
                    onChange={(url) => setFormData({ ...formData, logoWhiteUrl: url })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Footer About Text</label>
                <textarea
                  rows={3}
                  value={formData.footerAboutText}
                  onChange={(e) => setFormData({ ...formData, footerAboutText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Badge 1</label>
                  <input
                    type="text"
                    value={formData.footerBadge1}
                    onChange={(e) => setFormData({ ...formData, footerBadge1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Badge 2</label>
                  <input
                    type="text"
                    value={formData.footerBadge2}
                    onChange={(e) => setFormData({ ...formData, footerBadge2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Appointment Phone</label>
                  <input
                    type="text"
                    value={formData.appointmentPhone}
                    onChange={(e) => setFormData({ ...formData, appointmentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Clinic Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Complete Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timings Tab */}
          {activeTab === 'timings' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">OPD & Consultation Hours</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">OPD Consultation Hours (Mon - Sat)</label>
                <input
                  type="text"
                  value={formData.opdTimings}
                  onChange={(e) => setFormData({ ...formData, opdTimings: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Availability</label>
                  <input
                    type="text"
                    value={formData.emergencyHours}
                    onChange={(e) => setFormData({ ...formData, emergencyHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700">Top Announcement Bar</label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.isAnnouncementActive}
                      onChange={(e) => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Show Announcement Bar</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.announcementBarText}
                  onChange={(e) => setFormData({ ...formData, announcementBarText: e.target.value })}
                  placeholder="Text displayed on the top notification bar..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Pop-up Modal Tab */}
          {activeTab === 'popup' && (
            <div className="space-y-6">
              {/* Master Toggle Card */}
              <div className="p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white border-slate-200 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">Website Pop-up Modal Status</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        formData.popup.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {formData.popup.isActive ? 'Active on Website' : 'Hidden / Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xl">
                    {formData.popup.isActive
                      ? 'The consultation pop-up is currently active. Visitors will see it after the configured delay.'
                      : 'The pop-up is currently disabled. No visitors will see this modal on the website.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetPopupDefaults}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Defaults</span>
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.popup.isActive}
                      onChange={(e) => updatePopupField('isActive', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0496AC]"></div>
                  </label>
                </div>
              </div>

              {/* Two Column: Left Form Controls, Right Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Controls */}
                <div className="lg:col-span-7 space-y-6">
                  {/* 1. Header Bar */}
                  <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">1. Header Bar</h3>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.popup.showHeader}
                          onChange={(e) => updatePopupField('showHeader', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>Show Header Bar</span>
                      </label>
                    </div>

                    {formData.popup.showHeader && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={formData.popup.title}
                            onChange={(e) => updatePopupField('title', e.target.value)}
                            placeholder="e.g. Matruka Women’s Hospital"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle / Tagline</label>
                          <input
                            type="text"
                            value={formData.popup.subtitle}
                            onChange={(e) => updatePopupField('subtitle', e.target.value)}
                            placeholder="e.g. Complete Care for Her • Surat"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Optional Banner Image */}
                  <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">2. Top Banner Image (Optional)</h3>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.popup.showImage}
                          onChange={(e) => updatePopupField('showImage', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>Show Image</span>
                      </label>
                    </div>

                    {formData.popup.showImage && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Banner Image or Poster</label>
                        <ImageUpload
                          value={formData.popup.imageUrl}
                          onChange={(url) => updatePopupField('imageUrl', url)}
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. Description Message */}
                  <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">3. Body Message</h3>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.popup.showDescription}
                          onChange={(e) => updatePopupField('showDescription', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>Show Message</span>
                      </label>
                    </div>

                    {formData.popup.showDescription && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Message Text</label>
                        <textarea
                          rows={3}
                          value={formData.popup.description}
                          onChange={(e) => updatePopupField('description', e.target.value)}
                          placeholder="Welcome message or clinical inquiry notice..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* 4. Quick Info Box (OPD & Location) */}
                  <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">4. Quick Info Box</h3>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.popup.showInfo}
                          onChange={(e) => updatePopupField('showInfo', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>Show Info Box</span>
                      </label>
                    </div>

                    {formData.popup.showInfo && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.popup.showOpd}
                              onChange={(e) => updatePopupField('showOpd', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Include OPD Timings</span>
                          </label>
                          {formData.popup.showOpd && (
                            <input
                              type="text"
                              value={formData.popup.opdText}
                              onChange={(e) => updatePopupField('opdText', e.target.value)}
                              placeholder="e.g. 10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                            />
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.popup.showAddress}
                              onChange={(e) => updatePopupField('showAddress', e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Include Address</span>
                          </label>
                          {formData.popup.showAddress && (
                            <textarea
                              rows={2}
                              value={formData.popup.addressText}
                              onChange={(e) => updatePopupField('addressText', e.target.value)}
                              placeholder="e.g. 303-306, Solaris Cure, VIP Road, Surat"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. Action Buttons (WhatsApp & Call) */}
                  <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5">
                      5. Direct Action Buttons
                    </h3>

                    {/* WhatsApp */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <MessageCircle size={15} className="text-[#25D366]" />
                          WhatsApp Button
                        </span>
                        <label className="flex items-center gap-2 text-xs font-semibold text-emerald-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.popup.showWhatsapp}
                            onChange={(e) => updatePopupField('showWhatsapp', e.target.checked)}
                            className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Show Button</span>
                        </label>
                      </div>

                      {formData.popup.showWhatsapp && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Button Label</label>
                              <input
                                type="text"
                                value={formData.popup.whatsappText}
                                onChange={(e) => updatePopupField('whatsappText', e.target.value)}
                                placeholder="Connect on WhatsApp"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-700 mb-1">WhatsApp Number (e.g. 917984882273)</label>
                              <input
                                type="text"
                                value={formData.popup.whatsappNumber}
                                onChange={(e) => updatePopupField('whatsappNumber', e.target.value)}
                                placeholder="917984882273"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Pre-filled Chat Message</label>
                            <input
                              type="text"
                              value={formData.popup.whatsappMessage}
                              onChange={(e) => updatePopupField('whatsappMessage', e.target.value)}
                              placeholder="Hello Matruka, I would like to inquire..."
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Call */}
                    <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                          <Phone size={14} className="text-[#0496AC]" />
                          Call Helpline Button
                        </span>
                        <label className="flex items-center gap-2 text-xs font-semibold text-teal-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.popup.showCall}
                            onChange={(e) => updatePopupField('showCall', e.target.checked)}
                            className="rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span>Show Button</span>
                        </label>
                      </div>

                      {formData.popup.showCall && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Button Label</label>
                            <input
                              type="text"
                              value={formData.popup.callText}
                              onChange={(e) => updatePopupField('callText', e.target.value)}
                              placeholder="Call Helpline"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={formData.popup.callNumber}
                              onChange={(e) => updatePopupField('callNumber', e.target.value)}
                              placeholder="7984882273"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:ring-1 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 6. Display Rules & Timing */}
                  <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5">
                      6. Rules & Timing
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Auto-open Delay (Seconds)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="60"
                          value={formData.popup.delaySeconds}
                          onChange={(e) => updatePopupField('delaySeconds', parseFloat(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                        />
                        <span className="text-[11px] text-gray-400 mt-0.5 block">Time after page load before modal appears</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700">Dismiss / Skip Link</label>
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={formData.popup.showDismiss}
                            onChange={(e) => updatePopupField('showDismiss', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-xs text-gray-600">Show dismiss link</span>
                        </div>
                        {formData.popup.showDismiss && (
                          <input
                            type="text"
                            value={formData.popup.dismissText}
                            onChange={(e) => updatePopupField('dismissText', e.target.value)}
                            placeholder="Continue to website →"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none"
                          />
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.popup.showOncePerSession}
                          onChange={(e) => updatePopupField('showOncePerSession', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>
                          <strong>Show once per user visit</strong> (recommended: avoids reopening on every single page click)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Live Interactive Preview */}
                <div className="lg:col-span-5 sticky top-24 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Live Website Preview</h4>
                      <p className="text-[11px] text-slate-500">Updates live as you configure</p>
                    </div>
                    {formData.popup.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <Eye size={12} />
                        Live Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <EyeOff size={12} />
                        Disabled
                      </span>
                    )}
                  </div>

                  {/* Backdrop Simulator */}
                  <div className="relative p-4 sm:p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xs border border-slate-200 flex items-center justify-center min-h-[30rem]">
                    {/* If disabled, notice banner */}
                    {!formData.popup.isActive && (
                      <div className="absolute top-2 left-2 right-2 z-30 bg-rose-600/90 text-white text-[11px] font-semibold py-1 px-3 rounded-xl text-center shadow-md">
                        ⚠️ Pop-up is currently disabled & hidden from visitors
                      </div>
                    )}

                    {/* Pop-up Card */}
                    <div className="relative w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all text-left">
                      {/* Optional Image */}
                      {formData.popup.showImage && formData.popup.imageUrl && (
                        <div className="relative w-full h-32 bg-slate-100 overflow-hidden">
                          <SafeImage
                            src={resolveImageUrl(formData.popup.imageUrl)}
                            alt={formData.popup.title}
                            fallbackSrc="/logo.png"
                            className="w-full h-full object-cover"
                            fallbackClassName="w-full h-full object-contain p-4 bg-slate-50"
                          />
                        </div>
                      )}

                      {/* Header Bar */}
                      {formData.popup.showHeader && (
                        <div className="relative bg-[#0496AC] text-white px-4 py-3.5 flex items-center justify-between">
                          <div className="pr-2">
                            <h3 className="text-sm font-bold font-heading text-white leading-tight">
                              {formData.popup.title || 'Matruka Women’s Hospital'}
                            </h3>
                            <p className="text-[11px] text-white/85 mt-0.5">
                              {formData.popup.subtitle || 'Complete Care for Her • Surat'}
                            </p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                            <X size={13} />
                          </div>
                        </div>
                      )}

                      {/* Body Content */}
                      <div className="p-4 space-y-3">
                        {formData.popup.showDescription && (
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {formData.popup.description || 'Welcome to Matruka...'}
                          </p>
                        )}

                        {/* Quick Info Box */}
                        {formData.popup.showInfo && (formData.popup.showOpd || formData.popup.showAddress) && (
                          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                            {formData.popup.showOpd && (
                              <div className="flex items-center gap-1.5">
                                <Clock size={13} className="text-[#0496AC] shrink-0" />
                                <span>
                                  OPD: <strong>{formData.popup.opdText}</strong>
                                </span>
                              </div>
                            )}
                            {formData.popup.showAddress && (
                              <div className="flex items-start gap-1.5">
                                <MapPin size={13} className="text-[#0496AC] shrink-0 mt-0.5" />
                                <span className="leading-snug">{formData.popup.addressText}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        {(formData.popup.showWhatsapp || formData.popup.showCall) && (
                          <div className="space-y-2 pt-0.5">
                            {formData.popup.showWhatsapp && (
                              <div className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-[11px] shadow-xs">
                                <MessageCircle size={14} />
                                <span>{formData.popup.whatsappText || 'Connect on WhatsApp'}</span>
                              </div>
                            )}

                            {formData.popup.showCall && (
                              <div className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0496AC] text-white font-bold text-[11px] shadow-xs">
                                <Phone size={13} />
                                <span>
                                  {formData.popup.callText || 'Call Helpline'}: +91 {formData.popup.callNumber || '7984882273'}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Dismiss */}
                        {formData.popup.showDismiss && (
                          <div className="pt-1.5 text-center border-t border-slate-100">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {formData.popup.dismissText || 'Continue to website →'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Defaults Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Default SEO Meta Tags</h2>
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

          {/* Social Profiles Tab */}
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
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 font-semibold text-sm transition shadow-sm disabled:opacity-50 cursor-pointer"
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

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm text-gray-500 font-medium">Loading settings...</p>
        </div>
      }
    >
      <AdminSettingsContent />
    </Suspense>
  );
}

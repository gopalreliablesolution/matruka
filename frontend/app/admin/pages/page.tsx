'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, X, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface PageItem {
  _id: string;
  title: string;
  slug: string;
  heroTitle: string;
  heroSubtitle?: string;
  content: string;
  isPublished: boolean;
  updatedAt: string;
}

const DEFAULT_PRIVACY_CONTENT = `### 1. Informational Purpose & Online Requests
This website provides public informational and educational guidance regarding the clinical services, doctors, facilities, and visiting guidelines of Matruka — Complete Care for Her. The website also allows users to submit basic appointment requests (such as name, contact number, preferred date/time, and concern summary) to help with consultation scheduling. We do not collect payment information through this website and request that sensitive diagnostic records only be shared in person during your clinical visit.

### 2. Patient Confidentiality
All personal data submitted through contact forms or consultation booking modules is strictly confidential and accessed solely by our clinic administration for scheduling and care coordination. We never sell, rent, or trade your contact details with external commercial third parties.

### 3. External Links & Communication
Our website includes convenient shortcuts to WhatsApp, direct calling links, and Google Maps directions. When interacting with these external services, their respective privacy policies apply.

### 4. Contact Information
For questions regarding our privacy practices or data inquiries, contact us directly:
- Address: Solaris Cure, Beside Ratnajyoti Apartment, VIP Road, Surat - 395007
- Phone: +91 79848 82273
- OPD Hours: 10:00 AM - 1:00 PM & 5:00 PM - 7:00 PM (Monday to Saturday)`;

const DEFAULT_TERMS_CONTENT = `### 1. Medical Disclaimer
The content provided on this website is for informational and educational awareness only. It is not intended as a substitute for professional clinical medical advice, formal diagnosis, or individualized treatment plans. Always seek the advice of our qualified obstetricians and gynaecologists in person.

### 2. Website Scope
Matruka operates this website to provide transparent details regarding clinic infrastructure, qualified consultants Dr. Kairavi Yagnik and Dr. Rut Shah, medical specialities, and clinic hours. No clinical relationship is formed solely by browsing this website.

### 3. In-Person OPD Consultations
To receive medical consultations, prescriptions, examinations, or ultrasound diagnostics, patients must visit our clinic during regular OPD consultation hours:
- Morning OPD: 10:00 AM - 1:00 PM (Monday to Saturday)
- Evening OPD: 5:00 PM - 7:00 PM (Monday to Saturday)
- Address: Solaris Cure, Beside Ratnajyoti Apartment, VIP Road, Surat - 395007

### 4. Acute Obstetric & Gynecologic Emergencies
In situations of sudden heavy vaginal bleeding, acute lower abdominal agony, reduced fetal movement, or spontaneous rupture of membranes, directly call our emergency care helpline: +91 79848 82273.

### 5. Intellectual Property
All website content, clinical photography, doctor profiles, and graphics belong exclusively to Matruka Women’s Hospital. Unauthorized duplication or commercial use without prior written consent is strictly prohibited.`;

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    heroTitle: '',
    heroSubtitle: '',
    content: '',
    isPublished: true,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await adminApi.get('/pages');
      if (res.data.success) {
        setPages(res.data.data);
      }
    } catch {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (p: PageItem) => {
    setEditingPage(p);

    let heroSubtitle = p.heroSubtitle || '';
    let content = p.content || '';

    // If Privacy Policy has legacy dummy seed, load the genuine clinic policy
    if (p.slug === 'privacy-policy' && (!content.includes('Patient Confidentiality') || content.includes('purely informational updated'))) {
      if (!heroSubtitle) {
        heroSubtitle = 'Your privacy, trust, and patient confidentiality are of paramount importance to Matruka — Complete Care for Her.';
      }
      content = DEFAULT_PRIVACY_CONTENT;
    }

    // If Terms has legacy dummy seed, load the genuine clinic terms
    if (p.slug === 'terms' && (!content.includes('Website Scope') || content.includes('Clinic Consultations'))) {
      if (!heroSubtitle) {
        heroSubtitle = 'Important website terms of use, informational guidelines, and clinical consultation disclaimers.';
      }
      content = DEFAULT_TERMS_CONTENT;
    }

    setFormData({
      title: p.title,
      slug: p.slug,
      heroTitle: p.heroTitle,
      heroSubtitle,
      content,
      isPublished: p.isPublished,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    try {
      const res = await adminApi.put(`/pages/${editingPage._id}`, formData);
      if (res.data.success) {
        toast.success(`Page "${formData.title}" updated`);
        setEditingPage(null);
        fetchPages();
      }
    } catch {
      toast.error('Failed to update page');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Informational Pages"
        description="Manage static pages including About Us, Privacy Policy, Terms & Conditions, and the clinic vision."
        icon={FileText}
        breadcrumb={[{ label: 'Dynamic Pages' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          pages.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-brand-teal-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded">
                    /{p.slug}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      p.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.isPublished ? 'Live' : 'Hidden'}
                  </span>
                </div>

                <h3 className="font-bold text-brand-slate-900 text-base font-heading">{p.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{p.content}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/${p.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-slate-500 hover:text-brand-teal-600 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>

                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700 hover:bg-brand-teal-100 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Content</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-slate-900 font-heading">
                Edit: {editingPage.title} (/{editingPage.slug})
              </h2>
              <button onClick={() => setEditingPage(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hero Heading *</label>
                <input
                  type="text"
                  required
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Body Content (Markdown supported) *</label>
                <textarea
                  rows={10}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold rounded-xl shadow"
                >
                  Save Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


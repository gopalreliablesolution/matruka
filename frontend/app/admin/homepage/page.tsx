'use client';

import React, { useEffect, useState } from 'react';
import { Home, Eye, EyeOff, Save, Loader2, Edit2, X, Check, Info } from 'lucide-react';
import { adminApi } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

interface SectionItem {
  _id: string;
  sectionKey: string;
  name: string;
  badgeText?: string;
  title: string;
  subtitle?: string;
  isEnabled: boolean;
  sortOrder: number;
  settings?: any;
}

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await adminApi.get('/homepage-sections');
      if (res.data.success) {
        setSections(res.data.data);
      }
    } catch {
      toast.error('Failed to load homepage sections');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (sec: SectionItem) => {
    try {
      const res = await adminApi.put(`/homepage-sections/${sec._id}`, { isEnabled: !sec.isEnabled });
      if (res.data.success) {
        toast.success(`Section "${sec.name}" ${sec.isEnabled ? 'Disabled' : 'Enabled'}`);
        fetchSections();
      }
    } catch {
      toast.error('Failed to toggle section');
    }
  };

  const openEditModal = (sec: SectionItem) => {
    const defaultStats = [
      { value: '10+', label: 'Years Experience', desc: 'Obstetrics & Gynec' },
      { value: '14', label: 'Specialities', desc: 'Antenatal to Surgery' },
      { value: '24*7', label: 'Emergency Support', desc: 'Obstetric readiness' },
      { value: '100%', label: 'Women-Centric', desc: 'Dignified patient care' },
    ];
    const defaultFeatures = [
      { title: 'Obstetrics & Maternity', desc: 'Antenatal care, normal and painless deliveries' },
      { title: 'Advanced Laparoscopy', desc: 'Keyhole surgery for cysts, fibroids, & hysterectomy' },
      { title: 'Infertility Care', desc: 'Evidence-based workup & follicular monitoring' },
      { title: 'FOGSI Sonography', desc: 'In-clinic high-resolution pelvic ultrasound' },
    ];
    const defaultStandards = [
      {
        title: 'Consultant-Led Care',
        desc: 'Every antenatal consultation, diagnostic ultrasound, and surgery is personally performed by our senior specialists.',
        badge: 'Direct Expertise',
      },
      {
        title: 'Minimally Invasive Surgery',
        desc: 'Advanced keyhole laparoscopic techniques for fibroids, endometriosis, and cysts ensuring tiny scars and rapid discharge.',
        badge: 'Daycare Available',
      },
      {
        title: 'Natural & Painless Birth Focus',
        desc: 'Scientific, patient-centered labour support prioritizing normal delivery and maternal comfort.',
        badge: 'Safe Deliveries',
      },
      {
        title: 'NABH-Standard Hygiene',
        desc: 'Modern modular surgical suites with HEPA air filtration and stringent hospital infection control protocols.',
        badge: 'Zero Compromise',
      },
    ];

    const defaultStages = [
      {
        step: '01',
        stageName: 'Pre-Conception & Planning',
        duration: 'Before Pregnancy',
        headline: 'Building a Strong, Healthy Foundation for Conception',
        description:
          'Evidence-based pre-pregnancy health screening, ovulation follicular tracking, rubella/thalassemia screening, and preconception nutritional guidance led directly by Dr. Kairavi Yagnik & Dr. Rut Shah.',
        recommendedScans: 'Pelvic Baseline Ultrasound',
        badge: 'Planning Stage',
      },
      {
        step: '02',
        stageName: 'Antenatal Care (Trimesters 1, 2 & 3)',
        duration: 'Weeks 1 to 36',
        headline: 'Continuous Clinical Monitoring for Mother and Baby',
        description:
          'Regular comprehensive check-ups, high-risk pregnancy stratification, early pregnancy scans, anomaly detection, and growth Doppler tracking in our in-clinic FOGSI-certified sonography suite.',
        recommendedScans: 'NT Scan, Anomaly Scan, Color Doppler',
        badge: 'Maternity Journey',
      },
      {
        step: '03',
        stageName: 'Painless Labor & Safe Delivery',
        duration: 'Weeks 37 to 40+',
        headline: 'Empowered, Gentle, and Scientifically Supported Childbirth',
        description:
          'Patient-centric labor suites designed for comfort. We specialize in encouraging natural normal deliveries, offering 24x7 epidural painless delivery, continuous CTG fetal heart monitoring, and swift emergency LSCS readiness.',
        recommendedScans: 'Fetal Biophysical Profile & Growth Scan',
        badge: 'Birth Day Care',
      },
      {
        step: '04',
        stageName: 'Postnatal & Lactation Care',
        duration: 'First 6 Weeks & Beyond',
        headline: 'Compassionate Care for Mother’s Healing & Newborn Bonding',
        description:
          'Comprehensive postpartum follow-ups focusing on maternal surgical wound healing, pelvic floor recovery, breast engorgement prevention, newborn feeding, and emotional wellbeing.',
        recommendedScans: 'Pelvic Recovery Scan (if required)',
        badge: 'Mother & Baby',
      },
    ];

    const currentSettings = sec.settings || {};
    const stats =
      currentSettings.stats && currentSettings.stats.length > 0
        ? currentSettings.stats
        : defaultStats;
    const features =
      currentSettings.features && currentSettings.features.length > 0
        ? currentSettings.features
        : defaultFeatures;
    const items =
      currentSettings.items && currentSettings.items.length > 0
        ? currentSettings.items
        : defaultStandards;
    const stages =
      currentSettings.stages && currentSettings.stages.length > 0
        ? currentSettings.stages
        : defaultStages;

    const defaultBtnText =
      sec.sectionKey === 'facilities_infrastructure'
        ? 'Tour Our Hospital Facilities'
        : sec.sectionKey === 'services_specialities'
        ? 'View All Specialities'
        : sec.sectionKey === 'gallery_preview'
        ? 'Explore Complete Hospital Tour'
        : sec.sectionKey === 'latest_blogs'
        ? 'Explore All Health Blogs'
        : 'Read More About Our Care Philosophy';

    const defaultBtnLink =
      sec.sectionKey === 'facilities_infrastructure'
        ? '/facilities'
        : sec.sectionKey === 'services_specialities'
        ? '/services'
        : sec.sectionKey === 'gallery_preview'
        ? '/gallery'
        : sec.sectionKey === 'latest_blogs'
        ? '/blog'
        : '/about';

    setEditingSection({
      ...sec,
      settings: {
        ...currentSettings,
        stats,
        features,
        items,
        stages,
        quote:
          currentSettings.quote ||
          'Every woman deserves clinical expertise delivered with unhurried listening, dignity, and warmth.',
        quoteAuthor: currentSettings.quoteAuthor || 'Dr. Kairavi Yagnik & Dr. Rut Shah',
        btnText: currentSettings.btnText || defaultBtnText,
        btnLink: currentSettings.btnLink || defaultBtnLink,
      },
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      const res = await adminApi.put(`/homepage-sections/${editingSection._id}`, {
        title: editingSection.title,
        subtitle: editingSection.subtitle,
        badgeText: editingSection.badgeText,
        settings: editingSection.settings || {},
      });
      if (res.data.success) {
        toast.success('Section titles & settings updated');
        setEditingSection(null);
        fetchSections();
      }
    } catch {
      toast.error('Failed to update section');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage Section Manager"
        description="Enable or disable sections, modify headings, and adjust content displayed on the public home page."
        icon={Home}
        breadcrumb={[{ label: 'Homepage Sections' }]}
      />

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sections.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No sections configured.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sections.map((sec, idx) => (
              <div
                key={sec._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs mt-0.5 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-brand-slate-900 font-heading text-sm">{sec.name}</h3>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {sec.sectionKey}
                      </span>
                    </div>
                    <p className="text-xs text-brand-teal-700 font-medium mt-0.5">
                      Display Title: &ldquo;{sec.title}&rdquo;
                    </p>
                    {sec.subtitle && (
                      <p className="text-xs text-slate-400 mt-0.5">{sec.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => openEditModal(sec)}
                    className="p-2 text-brand-teal-700 hover:bg-brand-teal-50 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Content</span>
                  </button>

                  <button
                    onClick={() => handleToggle(sec)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      sec.isEnabled
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{sec.isEnabled ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-brand-slate-900 font-heading">
                  Edit: {editingSection.name}
                </h2>
                <p className="text-xs text-slate-500">Configure title, subtitles, and section content</p>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs sm:text-sm overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge Text (Optional)</label>
                  <input
                    type="text"
                    value={editingSection.badgeText || ''}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, badgeText: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                    placeholder="e.g. About Matruka"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section Heading *</label>
                  <input
                    type="text"
                    required
                    value={editingSection.title}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Section Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={editingSection.subtitle || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                  placeholder="Main descriptive paragraph shown under the heading..."
                />
              </div>

              {/* Special content fields for Hero Banner */}
              {editingSection.sectionKey === 'hero_slider' && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="p-3.5 bg-brand-teal-50 border border-brand-teal-200 rounded-xl text-xs text-brand-teal-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-brand-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Dynamic Hero Banners & Images</p>
                      <p className="text-slate-600 mt-0.5">
                        The hero showcase displays your active highlights with left-side content and right-side images. You can add new slides, update images, and reorder them under{' '}
                        <a href="/admin/banners" className="text-brand-teal-700 font-bold underline hover:text-brand-teal-800">
                          Content & Media &rarr; Banners &amp; Hero Sliders
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Special content fields for About Section */}
              {editingSection.sectionKey === 'about_clinic' && (
                <div className="pt-3 border-t border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Action Button Text</label>
                      <input
                        type="text"
                        value={editingSection.settings?.btnText || ''}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            settings: { ...editingSection.settings, btnText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                        placeholder="Read More About Our Care Philosophy"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Action Button Link</label>
                      <input
                        type="text"
                        value={editingSection.settings?.btnLink || ''}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            settings: { ...editingSection.settings, btnLink: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                        placeholder="/about"
                      />
                    </div>
                  </div>

                  {/* Founder Quote */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="block font-semibold text-slate-700 text-xs">Doctor / Founder Quote</label>
                    <textarea
                      rows={2}
                      value={editingSection.settings?.quote || ''}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          settings: { ...editingSection.settings, quote: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="e.g. Every woman deserves clinical expertise..."
                    />
                    <input
                      type="text"
                      value={editingSection.settings?.quoteAuthor || ''}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          settings: { ...editingSection.settings, quoteAuthor: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="Quote Author (e.g. Dr. Kairavi Yagnik & Dr. Rut Shah)"
                    />
                  </div>

                  {/* Highlights / Features */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                      Key Highlights (4 Pillars)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(editingSection.settings?.features || []).map((feat: any, fIdx: number) => (
                        <div key={fIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <input
                            type="text"
                            value={feat.title || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.features || [])];
                              updated[fIdx] = { ...updated[fIdx], title: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, features: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 font-semibold text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder={`Pillar ${fIdx + 1} Title`}
                          />
                          <input
                            type="text"
                            value={feat.desc || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.features || [])];
                              updated[fIdx] = { ...updated[fIdx], desc: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, features: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder={`Pillar ${fIdx + 1} Description`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Counter */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                      Statistics & Counters (4 Metrics)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(editingSection.settings?.stats || []).map((st: any, sIdx: number) => (
                        <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={st.value || ''}
                              onChange={(e) => {
                                const updated = [...(editingSection.settings?.stats || [])];
                                updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  settings: { ...editingSection.settings, stats: updated },
                                });
                              }}
                              className="w-1/3 px-2 py-1.5 font-bold text-xs border border-slate-200 rounded-lg bg-white"
                              placeholder="Value (e.g. 10+)"
                            />
                            <input
                              type="text"
                              value={st.label || ''}
                              onChange={(e) => {
                                const updated = [...(editingSection.settings?.stats || [])];
                                updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  settings: { ...editingSection.settings, stats: updated },
                                });
                              }}
                              className="w-2/3 px-2 py-1.5 font-semibold text-xs border border-slate-200 rounded-lg bg-white"
                              placeholder="Label (e.g. Years Experience)"
                            />
                          </div>
                          <input
                            type="text"
                            value={st.desc || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stats || [])];
                              updated[sIdx] = { ...updated[sIdx], desc: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stats: updated },
                              });
                            }}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Subtext (e.g. Obstetrics & Gynec)"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Special content fields for Care Statistics Section */}
              {editingSection.sectionKey === 'care_statistics' && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Statistics & Counters (4 Metrics)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(editingSection.settings?.stats || []).map((st: any, sIdx: number) => (
                      <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={st.value || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stats || [])];
                              updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stats: updated },
                              });
                            }}
                            className="w-1/3 px-2 py-1.5 font-bold text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Value (e.g. 10+)"
                          />
                          <input
                            type="text"
                            value={st.label || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stats || [])];
                              updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stats: updated },
                              });
                            }}
                            className="w-2/3 px-2 py-1.5 font-semibold text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Label (e.g. Years Experience)"
                          />
                        </div>
                        <input
                          type="text"
                          value={st.desc || ''}
                          onChange={(e) => {
                            const updated = [...(editingSection.settings?.stats || [])];
                            updated[sIdx] = { ...updated[sIdx], desc: e.target.value };
                            setEditingSection({
                              ...editingSection,
                              settings: { ...editingSection.settings, stats: updated },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          placeholder="Subtext (e.g. Obstetrics & Gynec)"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special content fields for Why Choose Us */}
              {editingSection.sectionKey === 'why_choose_us' && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Clinical Standards &amp; Quality Pillars (4 Items)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(editingSection.settings?.items || []).map((item: any, iIdx: number) => (
                      <div key={iIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.badge || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.items || [])];
                              updated[iIdx] = { ...updated[iIdx], badge: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, items: updated },
                              });
                            }}
                            className="w-1/3 px-2 py-1.5 font-bold text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Badge (e.g. Daycare Available)"
                          />
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.items || [])];
                              updated[iIdx] = { ...updated[iIdx], title: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, items: updated },
                              });
                            }}
                            className="w-2/3 px-2 py-1.5 font-semibold text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Title (e.g. Minimally Invasive Surgery)"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={item.desc || ''}
                          onChange={(e) => {
                            const updated = [...(editingSection.settings?.items || [])];
                            updated[iIdx] = { ...updated[iIdx], desc: e.target.value };
                            setEditingSection({
                              ...editingSection,
                              settings: { ...editingSection.settings, items: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          placeholder="Description of standard..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special content fields for Maternity Pathway */}
              {(editingSection.sectionKey === 'maternity_pathway' ||
                editingSection.sectionKey === 'why_choose_us') && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Maternity Care Pathway / Trimester Roadmap (4 Stages)
                  </h4>
                  <div className="space-y-3">
                    {(editingSection.settings?.stages || []).map((stg: any, sIdx: number) => (
                      <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={stg.step || `0${sIdx + 1}`}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stages || [])];
                              updated[sIdx] = { ...updated[sIdx], step: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stages: updated },
                              });
                            }}
                            className="w-16 px-2 py-1.5 font-bold text-xs border border-slate-200 rounded-lg bg-white text-center"
                            placeholder="Step"
                          />
                          <input
                            type="text"
                            value={stg.stageName || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stages || [])];
                              updated[sIdx] = { ...updated[sIdx], stageName: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stages: updated },
                              });
                            }}
                            className="w-1/2 px-2.5 py-1.5 font-semibold text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Stage Name (e.g. Antenatal Care)"
                          />
                          <input
                            type="text"
                            value={stg.duration || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stages || [])];
                              updated[sIdx] = { ...updated[sIdx], duration: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stages: updated },
                              });
                            }}
                            className="w-1/3 px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Duration (e.g. Weeks 1 to 36)"
                          />
                        </div>
                        <input
                          type="text"
                          value={stg.headline || ''}
                          onChange={(e) => {
                            const updated = [...(editingSection.settings?.stages || [])];
                            updated[sIdx] = { ...updated[sIdx], headline: e.target.value };
                            setEditingSection({
                              ...editingSection,
                              settings: { ...editingSection.settings, stages: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                          placeholder="Headline for this stage"
                        />
                        <textarea
                          rows={2}
                          value={stg.description || ''}
                          onChange={(e) => {
                            const updated = [...(editingSection.settings?.stages || [])];
                            updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                            setEditingSection({
                              ...editingSection,
                              settings: { ...editingSection.settings, stages: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          placeholder="Description of clinical care provided..."
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={stg.recommendedScans || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stages || [])];
                              updated[sIdx] = { ...updated[sIdx], recommendedScans: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stages: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Recommended Scans"
                          />
                          <input
                            type="text"
                            value={stg.badge || ''}
                            onChange={(e) => {
                              const updated = [...(editingSection.settings?.stages || [])];
                              updated[sIdx] = { ...updated[sIdx], badge: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                settings: { ...editingSection.settings, stages: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                            placeholder="Badge (e.g. Planning Stage)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special content fields for Services, Facilities, Gallery, or Blogs CTA buttons */}
              {(editingSection.sectionKey === 'services_specialities' ||
                editingSection.sectionKey === 'facilities_infrastructure' ||
                editingSection.sectionKey === 'gallery_preview' ||
                editingSection.sectionKey === 'latest_blogs') && (
                <div className="pt-3 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bottom CTA Button Text</label>
                      <input
                        type="text"
                        value={editingSection.settings?.btnText || ''}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            settings: { ...editingSection.settings, btnText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                        placeholder="Button Text"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bottom CTA Button Link</label>
                      <input
                        type="text"
                        value={editingSection.settings?.btnLink || ''}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            settings: { ...editingSection.settings, btnLink: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                        placeholder="/services"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


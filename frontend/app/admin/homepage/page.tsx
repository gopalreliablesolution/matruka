'use client';

import React, { useEffect, useState } from 'react';
import { Home, Eye, EyeOff, Save, Loader2, Edit2, X, Check } from 'lucide-react';
import { adminApi } from '@/lib/api';
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

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      const res = await adminApi.put(`/homepage-sections/${editingSection._id}`, {
        title: editingSection.title,
        subtitle: editingSection.subtitle,
        badgeText: editingSection.badgeText,
      });
      if (res.data.success) {
        toast.success('Section titles updated');
        setEditingSection(null);
        fetchSections();
      }
    } catch {
      toast.error('Failed to update section');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-slate-900 font-heading flex items-center gap-2">
            <Home className="w-6 h-6 text-brand-teal-600" />
            <span>Homepage Section Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enable or disable sections, modify headings, and adjust section content displayed on the public home page.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-teal-600" />
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
                    onClick={() => setEditingSection(sec)}
                    className="p-2 text-brand-teal-700 hover:bg-brand-teal-50 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Headings</span>
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

      {/* Edit Headings Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-brand-slate-900 font-heading">
                Edit: {editingSection.name}
              </h2>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Text (Optional)</label>
                <input
                  type="text"
                  value={editingSection.badgeText || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, badgeText: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Section Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={editingSection.subtitle || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
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


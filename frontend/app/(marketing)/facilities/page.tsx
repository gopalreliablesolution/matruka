import React from 'react';
import { Building2, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';

async function getFacilitiesData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/public/facilities`, {
    next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export default async function FacilitiesPage() {
  const facilities = await getFacilitiesData();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Medical Infrastructure
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          Hospital Facilities & Surgical Suites
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Sterile, state-of-the-art medical infrastructure designed specifically for safe childbirth, advanced laparoscopy, and respectful patient healing.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac: any) => (
            <div
              key={fac._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 hover:border-brand-teal-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-teal-50 text-brand-teal-700 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading text-brand-slate-900">{fac.name}</h2>
                  <p className="text-xs text-brand-teal-700 font-medium">Matruka Solaris Cure, Surat</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {fac.fullDescription || fac.shortDescription}
              </p>

              {fac.features && fac.features.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-brand-slate-800 mb-2">Key Highlights & Tech:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fac.features.map((ft: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                        <span>{ft}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



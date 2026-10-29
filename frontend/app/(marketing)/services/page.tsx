import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

async function getServicesData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/services`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error(e);
  }
  return { services: [], categories: [] };
}

export default async function ServicesPage() {
  const { services, categories } = await getServicesData();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Specialities & Treatments
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          Our Clinical Specialities
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Comprehensive, pregnancy-first and laparoscopic women’s health services confirmed and managed at Matruka Clinic, Surat.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc: any) => (
            <div
              key={svc._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-teal-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-teal-50 text-brand-teal-700">
                    {svc.category}
                  </span>
                  <Sparkles className="w-4 h-4 text-brand-gold-500" />
                </div>

                <h3 className="text-lg font-bold text-brand-slate-900 font-heading group-hover:text-brand-teal-600 transition-colors">
                  {svc.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {svc.shortDescription}
                </p>

                {svc.treatments && svc.treatments.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-brand-slate-800 mb-1.5">Treatments & Care:</p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      {svc.treatments.slice(0, 3).map((t: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href={`/services/${svc.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800"
                >
                  <span>View Clinical Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



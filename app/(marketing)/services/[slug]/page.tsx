import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, CheckCircle2, Phone, Clock, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

async function getServiceDetail(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/services/${slug}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getServiceDetail(slug);

  if (!detail || !detail.service) {
    notFound();
  }

  const { service, related } = detail;

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal-700 hover:text-brand-teal-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Specialities</span>
        </Link>
      </div>

      {/* Service Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
            {service.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900 leading-tight">
            {service.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold font-heading text-brand-slate-900">
                Clinical Overview & Care Methodology
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                {service.fullDescription}
              </div>

              {service.treatments && service.treatments.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-base font-bold font-heading text-brand-slate-900">
                    Procedures & Care Included
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.treatments.map((t: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.benefits && service.benefits.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-base font-bold font-heading text-brand-slate-900">
                    Benefits & Approach at Matruka
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.benefits.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 bg-brand-teal-50/50 rounded-xl text-xs sm:text-sm text-brand-teal-900">
                        <Sparkles className="w-4 h-4 text-brand-gold-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Consultation Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-brand-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-xl font-bold font-heading">Consultation Info</h3>
              <p className="text-xs text-brand-teal-100 leading-relaxed">
                Consult with Dr. Kairavi Yagnik & Dr. Rut Shah for this speciality during official OPD hours.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-brand-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">OPD Timings:</p>
                    <p className="text-brand-teal-100">10 AM - 1 PM & 5 PM - 7 PM (Mon - Sat)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-brand-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Clinic Helpline:</p>
                    <a href="tel:7984882273" className="font-bold text-white hover:text-brand-gold-300">
                      7984882273
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-teal-600">
                <a
                  href="tel:7984882273"
                  className="w-full flex items-center justify-center gap-2 bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-slate-900 font-bold py-3 rounded-xl text-xs sm:text-sm shadow transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call to Inquire</span>
                </a>
              </div>
            </div>

            {/* Related Services */}
            {related && related.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-brand-slate-900 text-sm font-heading">
                  Related Specialities
                </h4>
                <div className="divide-y divide-slate-100">
                  {related.map((rel: any) => (
                    <Link
                      key={rel._id}
                      href={`/services/${rel.slug}`}
                      className="py-2.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:text-brand-teal-600 transition"
                    >
                      <span className="truncate max-w-[15rem]">{rel.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-teal-600" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


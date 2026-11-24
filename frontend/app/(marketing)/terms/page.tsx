'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, AlertCircle, Clock, MapPin } from 'lucide-react';
import api from '@/lib/api';

export default function TermsPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await api.get('/pages/terms', {
          validateStatus: (status) => status < 500,
        });
        if (res.status === 200 && res.data?.success && res.data?.data) {
          setPageData(res.data.data);
        }
      } catch {
        // Silently fallback to built-in default terms without throwing AxiosError
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner with Matruka Signature Teal Gradient */}
      <section className="bg-gradient-to-r from-[#0496AC] via-[#037A8C] to-[#025E6C] text-white py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#F7CE6E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <FileText className="w-4 h-4 text-[#F7CE6E]" />
            <span>Legal Notice &amp; Terms</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading mb-3 tracking-tight">
            {pageData?.heroTitle || 'Terms and Conditions'}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {pageData?.heroSubtitle ||
              'Important website terms of use, informational guidelines, and clinical consultation disclaimers.'}
          </p>
        </div>
      </section>

      {/* Content Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0496AC] hover:text-[#037A8C] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Disclaimer Callout */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl mb-8 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 text-sm sm:text-base">Medical Disclaimer</h3>
            <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
              The content provided on this website is for informational and educational awareness only. It is not
              intended as a substitute for professional clinical medical advice, formal diagnosis, or individualized
              treatment plans. Always seek the advice of our qualified obstetricians and gynaecologists in person.
            </p>
          </div>
        </div>

        <article className="prose prose-teal max-w-none text-slate-700 leading-relaxed">
          {pageData?.content ? (
            <div className="whitespace-pre-line text-base text-slate-700">
              {pageData.content}
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">1. Website Scope</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Matruka operates this website to provide transparent details regarding clinic infrastructure,
                  qualified consultants Dr. Kairavi Yagnik and Dr. Rut Shah, medical specialities, and clinic hours.
                  No clinical relationship is formed solely by browsing this website.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">2. In-Person OPD Consultations</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  To receive medical consultations, prescriptions, examinations, or ultrasound diagnostics,
                  patients must visit our clinic during regular OPD consultation hours:
                </p>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-3 space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <p className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-[#0496AC] shrink-0" />
                    <span>Morning OPD: 10:00 AM - 1:00 PM (Monday to Saturday)</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-[#0496AC] shrink-0" />
                    <span>Evening OPD: 5:00 PM - 7:00 PM (Monday to Saturday)</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-[#0496AC] shrink-0" />
                    <span>Solaris Cure, VIP Road, Surat - 395007</span>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">3. Acute Obstetric &amp; Gynecologic Emergencies</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  In situations of sudden heavy vaginal bleeding, acute lower abdominal agony, reduced fetal movement,
                  or spontaneous rupture of membranes, directly call our emergency care helpline:
                  <strong className="text-[#0496AC] ml-1.5 font-bold">+91 79848 82273</strong>.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">4. Intellectual Property</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  All website content, clinical photography, doctor profiles, and graphics belong exclusively to
                  Matruka Women’s Hospital. Unauthorized duplication or commercial use without prior written consent is strictly prohibited.
                </p>
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

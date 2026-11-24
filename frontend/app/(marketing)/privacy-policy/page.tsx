'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Phone, Clock, MapPin } from 'lucide-react';
import api from '@/lib/api';

export default function PrivacyPolicyPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await api.get('/pages/privacy-policy', {
          validateStatus: (status) => status < 500,
        });
        if (res.status === 200 && res.data?.success && res.data?.data) {
          setPageData(res.data.data);
        }
      } catch {
        // Silently fallback to built-in default privacy policy without throwing AxiosError
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
            <ShieldCheck className="w-4 h-4 text-[#F7CE6E]" />
            <span>Legal &amp; Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading mb-3 tracking-tight">
            {pageData?.heroTitle || 'Privacy Policy'}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {pageData?.heroSubtitle ||
              'Your privacy, trust, and patient confidentiality are of paramount importance to Matruka — Complete Care for Her.'}
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

        <article className="prose prose-teal max-w-none text-slate-700 leading-relaxed">
          {pageData?.content ? (
            <div className="whitespace-pre-line text-base text-slate-700">
              {pageData.content}
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">
                  1. Informational Purpose &amp; Online Requests
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  This website provides public informational and educational guidance regarding the clinical services,
                  doctors, facilities, and visiting guidelines of Matruka — Complete Care for Her. The website also
                  allows users to submit basic appointment requests (such as name, contact number, preferred date/time,
                  and concern summary) to help with consultation scheduling. We do not collect payment information
                  through this website and request that sensitive diagnostic records only be shared in person during
                  your clinical visit.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">
                  2. Patient Confidentiality
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  All personal data submitted through contact forms or consultation booking modules is strictly
                  confidential and accessed solely by our clinic administration for scheduling and care coordination. We
                  never sell, rent, or trade your contact details with external commercial third parties.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">
                  3. External Links &amp; Communication
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Our website includes convenient shortcuts to WhatsApp, direct calling links, and Google Maps
                  directions. When interacting with these external services, their respective privacy policies apply.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 font-heading">
                  4. Contact Information
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  For questions regarding our privacy practices or data inquiries, contact us directly:
                </p>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-3 space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <p className="flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-[#0496AC] shrink-0" />
                    <span>Solaris Cure, Beside Ratnajyoti Apartment, VIP Road, Surat - 395007</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Phone className="w-4 h-4 text-[#0496AC] shrink-0" />
                    <span>Phone: +91 79848 82273</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-[#0496AC] shrink-0" />
                    <span>OPD Hours: 10:00 AM - 1:00 PM &amp; 5:00 PM - 7:00 PM</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Phone, AlertCircle, Clock, MapPin } from 'lucide-react';
import api from '@/lib/api';

export default function TermsPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await api.get('/public/pages/terms');
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load terms from API:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-matruka-teal to-matruka-tealDark text-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4 text-matruka-gold" />
            Legal Notice
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif mb-4">
            {pageData?.heroTitle || 'Terms and Conditions'}
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto">
            {pageData?.heroSubtitle ||
              'Important website terms of use, informational guidelines, and clinical consultation disclaimers.'}
          </p>
        </div>
      </section>

      {/* Content Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-matruka-teal hover:text-matruka-tealDark transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Disclaimer Callout */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl mb-8 flex items-start gap-3">
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

        <article className="prose prose-teal max-w-none text-matruka-text leading-relaxed">
          {pageData?.content ? (
            <div className="whitespace-pre-line text-base text-matruka-text/90">
              {pageData.content}
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">1. Website Scope</h2>
                <p>
                  Matruka operates this website to provide transparent details regarding clinic infrastructure,
                  qualified consultants Dr. Kairavi Yagnik and Dr. Rut Shah, medical specialities, and clinic hours.
                  No clinical relationship is formed solely by browsing this website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">2. In-Person OPD Consultations</h2>
                <p>
                  To receive medical consultations, prescriptions, examinations, or ultrasound diagnostics,
                  patients must visit our clinic during regular OPD consultation hours:
                </p>
                <div className="bg-matruka-lightAqua p-5 rounded-2xl border border-matruka-teal/15 mt-3 space-y-2">
                  <p className="flex items-center gap-2 font-medium text-matruka-tealDark">
                    <Clock className="w-4 h-4 text-matruka-teal" />
                    Morning OPD: 10:00 AM - 1:00 PM (Monday to Saturday)
                  </p>
                  <p className="flex items-center gap-2 font-medium text-matruka-tealDark">
                    <Clock className="w-4 h-4 text-matruka-teal" />
                    Evening OPD: 5:00 PM - 7:00 PM (Monday to Saturday)
                  </p>
                  <p className="flex items-center gap-2 font-medium text-matruka-tealDark">
                    <MapPin className="w-4 h-4 text-matruka-teal" />
                    Address: 303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">3. Acute Obstetric & Gynecologic Emergencies</h2>
                <p>
                  In case of acute medical emergencies, urgent labor pains, heavy bleeding, or severe abdominal pain,
                  patients should proceed immediately to the hospital casualty or call our emergency line at{' '}
                  <strong className="text-matruka-tealDark">+91 79848 82273</strong>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">4. Intellectual Property</h2>
                <p>
                  All clinical articles, photographs, brand logos, graphic banners, and educational materials
                  published on this website are the property of Matruka — Complete Care for Her.
                </p>
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}


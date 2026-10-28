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
        const res = await api.get('/public/pages/privacy-policy');
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load privacy policy from API:', err);
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
            <ShieldCheck className="w-4 h-4 text-matruka-gold" />
            Legal & Privacy
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif mb-4">
            {pageData?.heroTitle || 'Privacy Policy'}
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto">
            {pageData?.heroSubtitle ||
              'Your privacy, trust, and confidentiality are of paramount importance to Matruka — Complete Care for Her.'}
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

        <article className="prose prose-teal max-w-none text-matruka-text leading-relaxed">
          {pageData?.content ? (
            <div className="whitespace-pre-line text-base text-matruka-text/90">
              {pageData.content}
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">1. Informational Purpose</h2>
                <p>
                  This website is created solely for public informational and educational guidance regarding the
                  clinical services, doctors, facilities, and visiting guidelines of Matruka — Complete Care for Her.
                  We do not collect personal health records, payment information, or online appointment bookings
                  through this website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">2. Patient Confidentiality</h2>
                <p>
                  Any clinical or medical consultation initiated in person at our clinic, or via phone call and
                  WhatsApp, is handled with complete doctor-patient confidentiality adhering strictly to Indian
                  healthcare guidelines, ethical clinical protocols, and statutory patient data protection standards.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">3. External Links & Communication</h2>
                <p>
                  Direct phone dialers, WhatsApp contact buttons, and Google Maps directions provide shortcuts for
                  patient convenience. When utilizing third-party telecommunication services, respective carrier
                  and platform privacy policies apply.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-matruka-tealDark mb-3">4. Contact Information</h2>
                <p>
                  For questions regarding our privacy practices or clinic services, please visit or call us directly:
                </p>
                <div className="bg-matruka-lightAqua p-5 rounded-2xl border border-matruka-teal/15 mt-3 space-y-2">
                  <p className="flex items-center gap-2 font-medium text-matruka-tealDark">
                    <MapPin className="w-4 h-4 text-matruka-teal" />
                    303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007
                  </p>
                  <p className="flex items-center gap-2 font-medium text-matruka-tealDark">
                    <Phone className="w-4 h-4 text-matruka-teal" />
                    Direct Phone: +91 79848 82273
                  </p>
                  <p className="flex items-center gap-2 font-medium text-matruka-tealDark">
                    <Clock className="w-4 h-4 text-matruka-teal" />
                    OPD Hours: 10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)
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


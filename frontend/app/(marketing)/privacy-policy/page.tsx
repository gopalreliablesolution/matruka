import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, ArrowLeft, Phone, Clock, MapPin } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Privacy Policy | MatruKa — Complete Care for Her',
  description:
    'Patient confidentiality, data privacy, and online inquiry handling guidelines at MatruKa Women’s Hospital in Surat.',
};

async function getPrivacyPolicyData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/pages/privacy-policy`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data) {
        return data.data;
      }
    }
  } catch {
    // Graceful fallback to static clinic defaults
  }
  return null;
}

function renderFormattedContent(content: string) {
  if (!content || !content.trim()) return null;

  // HTML format support
  if (content.includes('<') && content.includes('>')) {
    return (
      <div
        className="prose prose-teal max-w-none text-slate-700 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Markdown parsing (sections separated by double linebreaks)
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-slate-700">
      {paragraphs.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading detection (#, ##, ###)
        if (trimmed.startsWith('#')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-6 mb-2 font-heading">
              {title}
            </h2>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={idx} className="list-disc list-inside space-y-1.5 text-slate-600 text-sm sm:text-base">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{item.replace(/^[-*]\s*/, '')}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default async function PrivacyPolicyPage() {
  const pageData = await getPrivacyPolicyData();

  // Check if content is the legacy 2-line placeholder or genuinely custom
  const isLegacyPlaceholder =
    pageData?.content &&
    pageData.content.includes('purely informational') &&
    !pageData.content.includes('Patient Confidentiality');

  const hasCustomContent = pageData?.content && pageData.content.trim().length > 100 && !isLegacyPlaceholder;

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
          {hasCustomContent ? (
            renderFormattedContent(pageData.content)
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
                    <span>OPD Hours: 10:00 AM - 1:00 PM &amp; 5:00 PM - 7:00 PM (Monday to Saturday)</span>
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

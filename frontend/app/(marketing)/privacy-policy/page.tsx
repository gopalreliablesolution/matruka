import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Privacy Policy | MatruKa — Complete Care for Her',
  description:
    'Patient confidentiality, data privacy, and online inquiry handling guidelines at MatruKa Women’s Hospital in Surat.',
};

const DEFAULT_PRIVACY_CONTENT = `### 1. Informational Purpose & Online Requests
This website provides public informational and educational guidance regarding the clinical services, doctors, facilities, and visiting guidelines of Matruka — Complete Care for Her. The website also allows users to submit basic appointment requests (such as name, contact number, preferred date/time, and concern summary) to help with consultation scheduling. We do not collect payment information through this website and request that sensitive diagnostic records only be shared in person during your clinical visit.

### 2. Patient Confidentiality
All personal data submitted through contact forms or consultation booking modules is strictly confidential and accessed solely by our clinic administration for scheduling and care coordination. We never sell, rent, or trade your contact details with external commercial third parties.

### 3. External Links & Communication
Our website includes convenient shortcuts to WhatsApp, direct calling links, and Google Maps directions. When interacting with these external services, their respective privacy policies apply.

### 4. Contact Information
For questions regarding our privacy practices or data inquiries, contact us directly:
- Address: Solaris Cure, Beside Ratnajyoti Apartment, VIP Road, Surat - 395007
- Phone: +91 79848 82273
- OPD Hours: 10:00 AM - 1:00 PM & 5:00 PM - 7:00 PM (Monday to Saturday)`;

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
        className="prose prose-teal max-w-none text-slate-600 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Split line by line to separate headings from light paragraph text
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let currentList: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-4">
            {text}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-3 text-slate-600 text-sm sm:text-base font-normal">
          {currentList.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Detect markdown heading (###, ##, #) or clean numbered heading (e.g. "1. Heading Title")
    const isMarkdownHeading = /^#{1,4}\s+/.test(line);
    const isNumberedHeading = /^\d+\.\s+[A-Za-z][^.!?]{2,80}$/.test(line);

    if (isMarkdownHeading || isNumberedHeading) {
      flushParagraph();
      flushList();
      const headingText = isMarkdownHeading ? line.replace(/^#{1,4}\s+/, '') : line;
      elements.push(
        <h2
          key={`h-${elements.length}`}
          className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-8 mb-3 first:mt-0"
        >
          {headingText}
        </h2>
      );
      continue;
    }

    // Detect bullet points (- item or * item)
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      currentList.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    // Regular light body text
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return <div className="space-y-2">{elements}</div>;
}

export default async function PrivacyPolicyPage() {
  const pageData = await getPrivacyPolicyData();
  const content = (pageData?.content && pageData.content.trim()) || DEFAULT_PRIVACY_CONTENT;
  const heroSubtitle = pageData?.heroSubtitle?.trim();

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
          {heroSubtitle ? (
            <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          ) : null}
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

        <article className="max-w-none leading-relaxed">
          {renderFormattedContent(content)}
        </article>
      </section>
    </div>
  );
}

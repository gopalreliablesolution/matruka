import React from 'react';
import { HelpCircle, ChevronDown, Phone } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

async function getFaqsData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/faqs`, {
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

export default async function FAQsPage() {
  const faqs = await getFaqsData();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Help & Information
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Find clear answers regarding clinic OPD timings, delivery options, high-risk pregnancy protocols, and laparoscopic surgery recovery.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {faqs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm bg-slate-50 rounded-3xl border border-slate-200">
            No FAQs published yet.
          </div>
        ) : (
          faqs.map((faq: any) => (
            <div
              key={faq._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2 hover:border-brand-teal-300 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-brand-teal-50 text-brand-teal-700">
                  {faq.category}
                </span>
                <h2 className="font-bold text-brand-slate-900 text-base font-heading">
                  {faq.question}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-brand-teal-400">
                {faq.answer}
              </p>
            </div>
          ))
        )}

        <div className="p-8 bg-brand-teal-50 rounded-3xl border border-brand-teal-100 text-center space-y-3 mt-8">
          <h3 className="font-bold text-brand-teal-900 text-base font-heading">
            Have a question not addressed here?
          </h3>
          <p className="text-xs text-brand-teal-700 max-w-md mx-auto">
            Please feel free to call our clinic reception during OPD hours (10 AM - 1 PM & 5 PM - 7 PM).
          </p>
          <a
            href="tel:7984882273"
            className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition"
          >
            <Phone className="w-4 h-4" />
            <span>Call Clinic: 7984882273</span>
          </a>
        </div>
      </section>
    </div>
  );
}



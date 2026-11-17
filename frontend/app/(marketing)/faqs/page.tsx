import React from 'react';
import { BACKEND_URL } from '@/lib/api';
import FAQSection from '@/components/FAQSection';

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
    <div className="py-6 sm:py-10">
      {faqs && faqs.length > 0 ? (
        <FAQSection initialFaqs={faqs} showViewAll={false} />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-200">
          No FAQs published yet.
        </div>
      )}
    </div>
  );
}

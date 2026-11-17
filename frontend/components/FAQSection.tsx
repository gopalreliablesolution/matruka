'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';

export interface FAQItemData {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
}

interface FAQSectionProps {
  initialFaqs?: FAQItemData[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function FAQSection({
  initialFaqs = [],
  title = 'Frequently Asked Questions',
  subtitle,
  showViewAll = true,
}: FAQSectionProps) {
  const [openFAQId, setOpenFAQId] = useState<string | number | null>(
    initialFaqs.length > 0 ? initialFaqs[0]._id || 0 : null
  );

  const handleToggle = (id: string | number) => {
    setOpenFAQId((prev) => (prev === id ? null : id));
  };

  if (!initialFaqs || initialFaqs.length === 0) return null;

  return (
    <section id="faq" className="w-full bg-white py-6 sm:py-8 lg:py-10 relative overflow-hidden">
      {/* Subtle organic background curve */}
      <div
        className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#0496AC]/[0.03] blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Clean Jogi-Style Header - Only the clean title */}
        <div className="text-center mb-5 sm:mb-6 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Clean Jogi-Style FAQ Accordion List (No category tags) */}
        <div className="flex flex-col gap-3">
          {initialFaqs.map((faq, index) => {
            const id = faq._id || index;
            const isOpen = openFAQId === id;

            return (
              <div
                key={id}
                className={`rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.006] ${
                  isOpen
                    ? 'bg-[#0496AC]/[0.10] shadow-xs'
                    : 'bg-[#0496AC]/[0.045] hover:bg-[#0496AC]/[0.07]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(id)}
                  className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 cursor-pointer text-left group gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-[#1A2C30] group-hover:text-[#0496AC] transition-colors font-heading leading-snug">
                    {faq.question}
                  </span>

                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#0496AC] text-white rotate-180 shadow-xs'
                        : 'bg-white/80 text-slate-600 group-hover:text-[#0496AC] group-hover:bg-white'
                    }`}
                  >
                    <ChevronDown size={18} className="transition-transform" />
                  </div>
                </button>

                {/* Animated Accordion Body */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-5 pt-1">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-l-2 border-[#0496AC]/40 pl-3">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean "View All" Button */}
        {showViewAll && (
          <div className="text-center mt-8 sm:mt-10">
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#0496AC] hover:bg-[#037B8D] px-6 py-2.5 rounded-full shadow-xs hover:shadow-sm transition-all"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

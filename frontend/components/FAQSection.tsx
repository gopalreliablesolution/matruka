'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Phone, HelpCircle } from 'lucide-react';

export interface FAQItemData {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
}

interface FAQSectionProps {
  initialFaqs?: FAQItemData[];
  badgeText?: string;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function FAQSection({
  initialFaqs = [],
  badgeText = 'PATIENT GUIDANCE & FAQS',
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
    <section id="faq" className="w-full bg-gradient-to-b from-white via-[#F4F8F9]/50 to-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle organic background curve */}
      <div
        className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#0496AC]/[0.04] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-emerald-400/[0.03] blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 max-w-full px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase bg-[#0496AC]/10 text-[#0496AC] border border-[#0496AC]/20 mb-3 leading-snug">
            <HelpCircle size={12} className="shrink-0" />
            <span>{badgeText}</span>
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-[#1A2C30] mt-2 leading-snug">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          ) : (
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Find transparent answers regarding OPD consultations, pregnancy care journeys, and minimally invasive laparoscopic surgeries.
            </p>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {initialFaqs.map((faq, index) => {
            const id = faq._id || index;
            const isOpen = openFAQId === id;
            const itemNumber = String(index + 1).padStart(2, '0');

            return (
              <div
                key={id}
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-2 border-[#0496AC]/40 shadow-[0_8px_30px_rgba(4,150,172,0.08)] ring-4 ring-[#0496AC]/5'
                    : 'bg-white/90 hover:bg-white border border-slate-200/90 hover:border-[#0496AC]/40 shadow-xs hover:shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer text-left group gap-4"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                        isOpen
                          ? 'bg-[#0496AC] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-[#0496AC]/10 group-hover:text-[#0496AC]'
                      }`}
                    >
                      {itemNumber}
                    </span>
                    <span
                      className={`text-sm sm:text-base font-bold transition-colors font-heading leading-snug ${
                        isOpen ? 'text-[#0496AC]' : 'text-[#1A2C30] group-hover:text-[#0496AC]'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#0496AC] text-white rotate-180 shadow-xs'
                        : 'bg-slate-100 text-slate-500 group-hover:text-[#0496AC] group-hover:bg-[#0496AC]/10'
                    }`}
                  >
                    <ChevronDown size={17} className="transition-transform" />
                  </div>
                </button>

                {/* Animated Accordion Body */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 pt-1">
                      <div className="rounded-xl border-l-3 border-[#0496AC] bg-[#0496AC]/[0.04] p-4 sm:p-5 text-sm sm:text-[0.9375rem] text-slate-700 leading-relaxed font-sans">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Patient Helpdesk Banner */}
        <div className="mt-10 sm:mt-12 rounded-2xl bg-gradient-to-r from-[#047A8C] via-[#0496AC] to-[#037A8C] p-6 sm:p-8 text-white shadow-[0_16px_40px_rgba(4,150,172,0.28)] border border-teal-300/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 text-center sm:text-left">
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[#F7CE6E] border border-white/20">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                Still have questions regarding your consultation?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-teal-50">
                Our patient care desk is available Monday through Saturday to assist you with appointment bookings and pre-visit guidelines.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:+917984882273"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-teal-50 px-5 py-3 text-xs sm:text-sm font-bold text-brand-teal-800 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Phone size={15} className="text-brand-teal-700 shrink-0" />
              <span>Call: 7984882273</span>
            </a>
            {showViewAll && (
              <Link
                href="/faqs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/15 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/25 transition-all border border-white/25 whitespace-nowrap"
              >
                <span>All FAQs</span>
                <ArrowRight size={14} className="shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

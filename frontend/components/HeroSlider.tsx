'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';

export interface BannerSlide {
  _id?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  desktopImage?: string;
  mobileImage?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface HeroSliderProps {
  banners: BannerSlide[];
  phone: string;
  whatsappNumber: string;
  trustBadge1?: string;
  trustBadge2?: string;
  ratingScore?: string;
  ratingText?: string;
}

const DEFAULT_BANNER: BannerSlide = {
  title: 'Nurturing Motherhood With Expertise & Love',
  subtitle:
    'Comprehensive maternity, high-risk pregnancy, and advanced gynaecological laparoscopic care led by Dr. Kairavi Yagnik & Dr. Rut Shah in Surat.',
  badgeText: 'Complete Care for Her',
  desktopImage: '/images/hero/serene-maternity-moment-at-home.png',
};

export default function HeroSlider({
  banners,
  phone,
  whatsappNumber,
  trustBadge1 = 'FOGSI Ultrasound Certified',
  trustBadge2 = 'Laparoscopic Fellow Surgeons',
}: HeroSliderProps) {
  const activeSlides =
    banners && banners.length > 0
      ? banners.filter((b) => b.isActive !== false)
      : [DEFAULT_BANNER];

  const slides = activeSlides.length > 0 ? activeSlides : [DEFAULT_BANNER];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Smooth auto-cycle between highlights (pauses when user hovers or interacts)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  const current = slides[currentIndex] || DEFAULT_BANNER;
  const fallbackImage = '/images/hero/serene-maternity-moment-at-home.png';
  const heroImageSrc = resolveImageUrl(current.desktopImage) || fallbackImage;

  return (
    <section
      className="relative bg-gradient-to-b from-[#F0FBFB]/80 via-[#F7FBFC] to-white overflow-hidden pt-4 pb-8 sm:pt-5 sm:pb-10 lg:pt-6 lg:pb-12 border-b border-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero showcase"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-brand-teal-500/[0.06] rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute -bottom-24 left-10 w-[420px] h-[420px] bg-amber-400/[0.05] rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Interactive Topic / Feature Navigator Tabs (Replaces traditional carousel arrows) */}
        {total > 1 && (
          <div className="mb-3 sm:mb-4 flex items-center justify-start lg:justify-start gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal-600" />
              <span>Highlights:</span>
            </span>
            {slides.map((slide, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={slide._id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`group relative flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-brand-teal-600 text-white shadow-sm ring-2 ring-brand-teal-400/30'
                      : 'bg-white/90 hover:bg-brand-teal-50 text-slate-600 hover:text-brand-teal-700 border border-slate-200/90'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-amber-300' : 'bg-slate-300 group-hover:bg-brand-teal-500'
                    }`}
                  />
                  <span className="truncate max-w-[180px]">
                    {slide.badgeText || slide.title || `Speciality ${idx + 1}`}
                  </span>
                  {isActive && !isPaused && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center min-h-[360px] sm:min-h-[400px] lg:min-h-[440px]">
          {/* Left: Dynamic Content Update Section */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 text-left">
            {/* Live Pill Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-teal-50 border border-brand-teal-200/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal-600" />
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-brand-teal-700">
                  {current.badgeText || 'MATRUKA — COMPLETE CARE FOR HER'}
                </span>
              </div>

              {total > 1 && (
                <span className="text-[11px] font-medium text-slate-400">
                  Topic {currentIndex + 1} of {total}
                </span>
              )}
            </div>

            {/* Main Headline (Dynamic) */}
            <h1
              key={`title-${currentIndex}`}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 leading-snug transition-all duration-300"
            >
              {current.title}
            </h1>

            {/* Subtitle / Paragraph (Dynamic) */}
            <p
              key={`sub-${currentIndex}`}
              className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed transition-all duration-300"
            >
              {current.subtitle ||
                'Comprehensive maternity, personalized antenatal care, painless delivery, and advanced gynaecological laparoscopy led by expert surgeons in Surat.'}
            </p>

            {/* Action Buttons (Dynamic) */}
            <div className="pt-0.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3">
              <a
                href={current.primaryBtnLink || `tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>{current.primaryBtnText || `Call Clinic: ${phone}`}</span>
              </a>

              <a
                href={
                  current.secondaryBtnLink ||
                  `https://wa.me/${whatsappNumber}?text=Hello%20MatruKa%20Team%2C%20I%20would%20like%20information%20about%20your%20services.`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50/80 text-emerald-800 font-medium px-5 py-2.5 rounded-xl border border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{current.secondaryBtnText || 'WhatsApp'}</span>
              </a>
            </div>

            {/* Trust Indicator Micro-features */}
            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-5 sm:gap-7 flex-wrap text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal-50 text-brand-teal-600">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                </div>
                <span>{trustBadge1}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                </div>
                <span>{trustBadge2}</span>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Image Update Section with Mini Previews */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center justify-center lg:justify-end mt-1 lg:mt-0 relative">
            {/* Multi-layer Ambient Lighting */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal-300/30 via-brand-teal-100/20 to-amber-200/20 rounded-3xl blur-2xl transform scale-95" />

            <div className="relative w-full flex justify-center lg:justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={heroImageSrc + currentIndex}
                src={heroImageSrc}
                alt={current.title || 'MatruKa Maternity & Gynaecology Care Surat'}
                className="relative z-10 h-[260px] sm:h-[340px] lg:h-[400px] xl:h-[440px] w-auto max-w-full object-contain drop-shadow-[0_16px_30px_rgba(4,150,172,0.14)] transition-opacity duration-500"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>

            {/* Mini Topic Switcher Previews (Replaces slider arrows with interactive visual cards) */}
            {total > 1 && (
              <div className="mt-3 sm:mt-4 w-full flex items-center justify-center lg:justify-end gap-2.5 z-20 flex-wrap">
                {slides.map((slide, idx) => {
                  const isActive = currentIndex === idx;
                  const thumbImg = resolveImageUrl(slide.desktopImage) || fallbackImage;
                  return (
                    <button
                      key={slide._id || idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-white shadow-[0_4px_16px_rgba(4,150,172,0.22)] ring-2 ring-brand-teal-500 border border-brand-teal-200 scale-102'
                          : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 hover:border-brand-teal-200 opacity-70 hover:opacity-100'
                      }`}
                      title={slide.title}
                    >
                      <img
                        src={thumbImg}
                        alt={slide.title}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      <div className="hidden sm:block max-w-[120px] truncate">
                        <p className="text-[10px] font-bold text-brand-slate-900 truncate">
                          {slide.badgeText || `Speciality ${idx + 1}`}
                        </p>
                        <p className="text-[9px] text-slate-500 truncate">
                          {slide.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

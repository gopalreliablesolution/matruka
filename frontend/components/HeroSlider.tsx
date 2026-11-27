'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';

export interface BannerSlide {
  _id?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  desktopImage?: string;
  mobileImage?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  showContent?: boolean;
  bannerLinkUrl?: string;
  openInNewTab?: boolean;
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
  showContent: true,
};

function parseSlideMeta(b: BannerSlide): BannerSlide {
  let showContent = b.showContent;
  let bannerLinkUrl = b.bannerLinkUrl || '';
  let openInNewTab = Boolean(b.openInNewTab);
  let mobileImage = b.mobileImage || '';

  if (mobileImage && typeof mobileImage === 'string' && mobileImage.startsWith('__META__:')) {
    try {
      const parsed = JSON.parse(mobileImage.substring(9));
      if (parsed.showContent !== undefined) showContent = Boolean(parsed.showContent);
      if (parsed.bannerLinkUrl !== undefined) bannerLinkUrl = parsed.bannerLinkUrl;
      if (parsed.openInNewTab !== undefined) openInNewTab = Boolean(parsed.openInNewTab);
      mobileImage = parsed.realMobileImage || '';
    } catch {}
  }

  if (showContent === undefined) {
    showContent = b.title !== 'Banner Graphic' && b.subtitle !== 'Graphic';
  }

  return {
    ...b,
    showContent: Boolean(showContent),
    bannerLinkUrl,
    openInNewTab,
    mobileImage,
    title: b.title === 'Banner Graphic' && !showContent ? '' : (b.title || ''),
    subtitle: b.subtitle === 'Graphic' && !showContent ? '' : (b.subtitle || ''),
  };
}

export default function HeroSlider({
  banners,
  phone,
  whatsappNumber,
  trustBadge1,
  trustBadge2,
}: HeroSliderProps) {
  const activeSlides = (
    banners && banners.length > 0
      ? banners.filter((b) => b.isActive !== false)
      : [DEFAULT_BANNER]
  ).map(parseSlideMeta);

  const slides = activeSlides.length > 0 ? activeSlides : [DEFAULT_BANNER];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Smooth auto-cycle between slides (pauses when user hovers)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  const current = slides[currentIndex] || DEFAULT_BANNER;
  const fallbackImage = '/images/hero/serene-maternity-moment-at-home.png';
  const heroImageSrc = current.desktopImage
    ? resolveImageUrl(current.desktopImage) || fallbackImage
    : fallbackImage;
  const mobileImageSrc = current.mobileImage
    ? resolveImageUrl(current.mobileImage)
    : null;

  // Check if text content should be shown on this banner
  const isContentEnabled =
    current.showContent !== false &&
    Boolean(current.title?.trim() || current.subtitle?.trim());

  // Dynamic visibility flags
  const hasBadge = Boolean(current.badgeText && current.badgeText.trim());
  const hasSubtitle = Boolean(current.subtitle && current.subtitle.trim());
  const hasPrimaryBtn = Boolean(current.primaryBtnText && current.primaryBtnText.trim());
  const hasSecondaryBtn = Boolean(current.secondaryBtnText && current.secondaryBtnText.trim());
  const hasAnyBtn = hasPrimaryBtn || hasSecondaryBtn;
  const hasTrustBadges = Boolean(trustBadge1?.trim()) || Boolean(trustBadge2?.trim());

  const hasBannerLink = Boolean(current.bannerLinkUrl && current.bannerLinkUrl.trim());

  return (
    <section
      className="relative bg-gradient-to-b from-[#F0FBFB]/80 via-[#F7FBFC] to-white overflow-hidden pt-6 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-14 border-b border-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero showcase"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-brand-teal-500/[0.06] rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute -bottom-24 left-10 w-[420px] h-[420px] bg-amber-400/[0.05] rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Slider Navigation Arrows (Shown ONLY if multiple slides exist) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#0496AC] text-slate-700 hover:text-white shadow-[0_4px_18px_rgba(4,150,172,0.22)] border border-slate-200/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#0496AC] text-slate-700 hover:text-white shadow-[0_4px_18px_rgba(4,150,172,0.22)] border border-slate-200/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Fixed-height stage prevents page from jumping up/down when slides auto-switch */}
        <div className={total > 1 ? 'h-[520px] sm:h-[540px] lg:h-[440px] flex items-center' : ''}>
        {/* CASE 1: IMAGE-ONLY BANNER (No Text / Graphics Only) */}
        {!isContentEnabled ? (
          <div className="w-full">
            {hasBannerLink ? (
              <a
                href={current.bannerLinkUrl}
                target={current.openInNewTab ? '_blank' : undefined}
                rel={current.openInNewTab ? 'noopener noreferrer' : undefined}
                className="block w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-slate-100 bg-white"
              >
                <picture className="w-full block">
                  {mobileImageSrc && (
                    <source media="(max-width: 639px)" srcSet={mobileImageSrc} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={heroImageSrc + currentIndex}
                    src={heroImageSrc}
                    alt={current.title || 'Matruka Hospital Banner'}
                    className={`w-full ${total > 1 ? 'h-[480px] sm:h-[500px] lg:h-[420px]' : 'h-[180px] sm:h-[260px] md:h-[320px] lg:h-[360px] xl:h-[380px]'} object-cover object-center group-hover:scale-[1.01] transition-transform duration-500`}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </picture>
              </a>
            ) : (
              <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-white">
                <picture className="w-full block">
                  {mobileImageSrc && (
                    <source media="(max-width: 639px)" srcSet={mobileImageSrc} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={heroImageSrc + currentIndex}
                    src={heroImageSrc}
                    alt={current.title || 'Matruka Hospital Banner'}
                    className={`w-full ${total > 1 ? 'h-[480px] sm:h-[500px] lg:h-[420px]' : 'h-[180px] sm:h-[260px] md:h-[320px] lg:h-[360px] xl:h-[380px]'} object-cover object-center`}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </picture>
              </div>
            )}
          </div>
        ) : (
          /* CASE 2: SPLIT LAYOUT WITH TEXT CONTENT + GRAPHIC */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left: Dynamic Content Update Section */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 text-left">
              {/* Live Pill Badge */}
              {hasBadge && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full px-2.5 sm:px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-200/80">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal-600" />
                    </span>
                    <span className="text-xs font-semibold tracking-wide sm:tracking-wider uppercase text-brand-teal-700 leading-snug">
                      {current.badgeText}
                    </span>
                  </div>
                </div>
              )}

              {/* Main Headline */}
              {current.title && (
                <h1
                  key={`title-${currentIndex}`}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 leading-snug line-clamp-3 transition-all duration-300"
                >
                  {current.title}
                </h1>
              )}

              {/* Subtitle / Paragraph */}
              {hasSubtitle && (
                <p
                  key={`sub-${currentIndex}`}
                  className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed line-clamp-3 transition-all duration-300"
                >
                  {current.subtitle}
                </p>
              )}

              {/* Action Buttons */}
              {hasAnyBtn && (
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3">
                  {hasPrimaryBtn && (
                    <a
                      href={current.primaryBtnLink || `tel:${phone}`}
                      className="inline-flex items-center justify-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm"
                    >
                      <PhoneCall className="w-4 h-4 shrink-0" />
                      <span>{current.primaryBtnText}</span>
                    </a>
                  )}

                  {hasSecondaryBtn && (
                    <a
                      href={
                        current.secondaryBtnLink ||
                        `https://wa.me/${whatsappNumber}?text=Hello%20Matruka%20Team%2C%20I%20would%20like%20information%20about%20your%20services.`
                      }
                      target={current.secondaryBtnLink?.startsWith('http') ? '_blank' : undefined}
                      rel={current.secondaryBtnLink?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50/80 text-emerald-800 font-medium px-5 py-2.5 rounded-xl border border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{current.secondaryBtnText}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Trust Indicator Micro-features */}
              {hasTrustBadges && (
                <div className="pt-3 border-t border-slate-200/70 flex items-center gap-5 sm:gap-7 flex-wrap text-xs text-slate-600 font-medium">
                  {trustBadge1 && trustBadge1.trim() && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal-50 text-brand-teal-600">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <span>{trustBadge1}</span>
                    </div>
                  )}
                  {trustBadge2 && trustBadge2.trim() && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <span>{trustBadge2}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Dynamic Slide Image Section */}
            <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center justify-center lg:justify-end mt-1 lg:mt-0 relative">
              {/* Multi-layer Ambient Lighting */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal-300/30 via-brand-teal-100/20 to-amber-200/20 rounded-3xl blur-2xl transform scale-95" />

              <div className="relative w-full flex justify-center lg:justify-end">
                {hasBannerLink ? (
                  <a
                    href={current.bannerLinkUrl}
                    target={current.openInNewTab ? '_blank' : undefined}
                    rel={current.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="block group cursor-pointer"
                    title={current.title || 'Open Banner Link'}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={heroImageSrc + currentIndex}
                      src={heroImageSrc}
                      alt={current.title || 'Matruka Maternity & Gynaecology Care Surat'}
                      className="relative z-10 h-[220px] sm:h-[280px] lg:h-[390px] xl:h-[410px] w-auto max-w-full object-contain drop-shadow-[0_16px_30px_rgba(4,150,172,0.14)] group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </a>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={heroImageSrc + currentIndex}
                    src={heroImageSrc}
                    alt={current.title || 'Matruka Maternity & Gynaecology Care Surat'}
                    className="relative z-10 h-[220px] sm:h-[280px] lg:h-[390px] xl:h-[410px] w-auto max-w-full object-contain drop-shadow-[0_16px_30px_rgba(4,150,172,0.14)] transition-opacity duration-500"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Bottom Dot Indicators (Shown ONLY if multiple slides exist) */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 sm:pt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 h-2.5 bg-[#0496AC] shadow-xs'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

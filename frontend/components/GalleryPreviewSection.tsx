'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Camera, ArrowRight, ZoomIn } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import ScrollReveal from './ScrollReveal';
import GalleryLightbox from './GalleryLightbox';

export interface GalleryItemData {
  _id?: string;
  title?: string;
  imageUrl: string;
  category?: string;
  caption?: string;
  altText?: string;
}

interface GalleryPreviewSectionProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  btnText?: string;
  btnLink?: string;
  items?: GalleryItemData[];
}

const DEFAULT_GALLERY_ITEMS: GalleryItemData[] = [
  {
    title: 'Consultation & Examination Chamber',
    category: 'Consultation Suites',
    imageUrl: '/images/gallery/consultation-chamber.jpg',
    caption: 'Private, comfortable consulting space for detailed doctor discussions.',
  },
  {
    title: 'FOGSI High-Resolution Ultrasound Suite',
    category: 'Diagnostics',
    imageUrl: '/images/gallery/ultrasound-suite.jpg',
    caption: 'Advanced pelvic and 3D/4D obstetric sonography machine.',
  },
  {
    title: 'Sterile Modular Laparoscopic OT',
    category: 'Operation Theatre',
    imageUrl: '/images/gallery/modular-ot.jpg',
    caption: 'HEPA air filtration and world-class endoscopic surgical towers.',
  },
  {
    title: 'Private Recovery & Maternity Room',
    category: 'Patient Rooms',
    imageUrl: '/images/gallery/maternity-suite.jpg',
    caption: 'Hygienic, peaceful post-delivery care for mother and family.',
  },
];

/**
 * Individual Gallery Card with robust image loading & error handling.
 * If image is missing, empty, invalid, or fails to load, the image container
 * is completely removed from DOM, rendering a clean, properly-sized text card.
 */
function GalleryPreviewCard({
  item,
  index,
  onOpenLightbox,
}: {
  item: GalleryItemData;
  index: number;
  onOpenLightbox: (index: number) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const rawUrl = item.imageUrl ? item.imageUrl.trim() : '';
  const isValidUrl = Boolean(
    rawUrl &&
      rawUrl !== '' &&
      rawUrl !== 'undefined' &&
      rawUrl !== 'null' &&
      rawUrl !== 'placeholder' &&
      !rawUrl.endsWith('/')
  );

  useEffect(() => {
    if (!isValidUrl) {
      setImgFailed(true);
      return;
    }
    // Check if the browser already finished or errored before hydration
    if (imgRef.current) {
      if (imgRef.current.complete) {
        if (imgRef.current.naturalWidth === 0) {
          setImgFailed(true);
        } else {
          setImgLoaded(true);
        }
      }
    }
  }, [isValidUrl, rawUrl]);

  const hasImage = isValidUrl && !imgFailed;
  const hasText = Boolean(item.title?.trim() || item.caption?.trim());
  const hasCategory = Boolean(item.category && item.category !== 'None' && item.category.trim() !== '');

  // CASE 1: NO IMAGE (Or Image Failed to Load)
  // Completely remove image section — render a clean, balanced card
  if (!hasImage) {
    return (
      <div className="group rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-brand-teal-300 hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between h-full min-h-[160px]">
        <div>
          {hasCategory && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200/80 px-2.5 py-1 rounded-md mb-2.5">
              {item.category}
            </span>
          )}
          {item.title && (
            <h3 className="font-bold text-brand-slate-900 text-sm sm:text-base font-heading group-hover:text-brand-teal-700 transition-colors line-clamp-2">
              {item.title}
            </h3>
          )}
          {item.caption && (
            <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    );
  }

  // CASE 2: VALID IMAGE
  return (
    <div
      onClick={() => onOpenLightbox(index)}
      className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full min-h-[260px]"
    >
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          hasText ? 'aspect-[16/10]' : 'flex-1 w-full h-full min-h-[260px]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={resolveImageUrl(rawUrl)}
          alt={item.altText || item.title || 'Hospital Gallery Photo'}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dark hover overlay with zoom icon */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/20 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>View Photo</span>
          </span>
        </div>

        {hasCategory && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs z-10">
            {item.category}
          </span>
        )}
      </div>

      {hasText && (
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {item.title && (
              <h3 className="font-bold text-brand-slate-900 text-sm group-hover:text-brand-teal-700 transition-colors">
                {item.title}
              </h3>
            )}
            {item.caption && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {item.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPreviewSection({
  badgeText = 'INSIDE MATRUKA CLINIC',
  title = 'Modern Clinical Infrastructure & Care Environment',
  subtitle = 'Take a visual walkthrough of our specialized women’s hospital, modular surgical theatres, and comfortable recovery suites at Solaris Cure, VIP Road Surat.',
  btnText = 'Explore Complete Hospital Tour',
  btnLink = '/gallery',
  items = [],
}: GalleryPreviewSectionProps) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_GALLERY_ITEMS;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    displayItems.forEach((item) => {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [displayItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return displayItems;
    return displayItems.filter((item) => (item.category || '').trim() === selectedCategory);
  }, [displayItems, selectedCategory]);

  return (
    <section className="py-14 sm:py-20 bg-slate-50/70 border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-brand-teal-100 leading-snug">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-600 shrink-0" />
              <span>{badgeText}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>

            {/* Category Tabs Section Below Content */}
            {categories.length > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap pt-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs sm:text-sm px-4 py-1.5 rounded-full font-medium transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <ScrollReveal key={item._id || idx} animation="fade-up" delay={(idx % 3) * 100} duration={500}>
              <GalleryPreviewCard
                item={item}
                index={idx}
                onOpenLightbox={(i) => setLightboxIndex(i)}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-4">
          <Link
            href={btnLink}
            className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{btnText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          isOpen={lightboxIndex !== null}
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1))
          }
          onNext={() =>
            setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0))
          }
        />
      )}
    </section>
  );
}

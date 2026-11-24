'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import ScrollReveal from './ScrollReveal';

export interface GalleryItemData {
  _id?: string;
  title: string;
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

export default function GalleryPreviewSection({
  badgeText = 'INSIDE MATRUKA CLINIC',
  title = 'Modern Clinical Infrastructure & Care Environment',
  subtitle = 'Take a visual walkthrough of our specialized women’s hospital, modular surgical theatres, and comfortable recovery suites at Solaris Cure, VIP Road Surat.',
  btnText = 'Explore Complete Hospital Tour',
  btnLink = '/gallery',
  items = [],
}: GalleryPreviewSectionProps) {
  const displayItems = items && items.length > 0 ? items.slice(0, 6) : DEFAULT_GALLERY_ITEMS;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    ...Array.from(new Set(displayItems.map((item) => item.category || 'Facilities'))),
  ];

  const filteredItems =
    selectedCategory === 'All'
      ? displayItems
      : displayItems.filter((item) => (item.category || 'Facilities') === selectedCategory);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50/70 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
              <Camera className="w-3.5 h-3.5 text-brand-teal-600" />
              <span>{badgeText}</span>
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={(idx % 3) * 100} duration={500}>
              <div className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/banners/serene-maternity-moment-at-home.png';
                    }}
                  />
                  {item.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-brand-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-slate-900 text-sm group-hover:text-brand-teal-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Button */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="text-center mt-10 sm:mt-12">
            <Link
              href={btnLink}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal-700 hover:text-brand-teal-800 group bg-white hover:bg-brand-teal-50 px-6 py-3 rounded-xl border border-brand-teal-200 transition shadow-xs"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

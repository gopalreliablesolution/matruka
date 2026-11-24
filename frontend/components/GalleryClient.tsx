'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Camera, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import GalleryLightbox from './GalleryLightbox';

export interface GalleryItemData {
  _id?: string;
  title?: string;
  imageUrl: string;
  category?: string;
  caption?: string;
  altText?: string;
}

interface GalleryClientProps {
  items: GalleryItemData[];
}

/**
 * Individual Gallery Client Card with image validation & error fallback.
 * If image is missing, empty, or fails to load, the image section is completely
 * omitted so no broken icon or grey empty placeholder is ever shown.
 */
function GalleryClientCard({
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

  // CASE 1: NO IMAGE (Or Image Failed)
  // Clean text card — NO image container, NO grey box, NO broken icon!
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
      className="group rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full min-h-[260px]"
    >
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          hasText ? 'h-52 w-full' : 'flex-1 w-full h-full min-h-[260px]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={resolveImageUrl(rawUrl)}
          alt={item.altText || item.title || 'Hospital Gallery'}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dark hover overlay with Zoom icon */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/60 px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/20 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>View Photo</span>
          </span>
        </div>

        {/* Category Badge on photo */}
        {hasCategory && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-black/65 text-white px-2.5 py-1 rounded-md backdrop-blur-xs z-10 border border-white/10">
            {item.category}
          </span>
        )}
      </div>

      {hasText && (
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {item.title && (
              <h3 className="font-bold text-brand-slate-900 text-sm group-hover:text-brand-teal-700 transition-colors line-clamp-2">
                {item.title}
              </h3>
            )}
            {item.caption && (
              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {item.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryClient({ items = [] }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  // Compute category count
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    items.forEach((item) => {
      const cat = item.category?.trim() || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter((item) => (item.category || '').trim() === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap px-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-teal-600 text-white shadow-md shadow-brand-teal-600/20 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of Photos */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto">
          <ImageIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700">No photographs in this category yet</p>
          <p className="text-xs text-slate-400 mt-1">Please select another category or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredItems.map((item, index) => (
            <GalleryClientCard
              key={item._id || index}
              item={item}
              index={index}
              onOpenLightbox={(i) => setLightboxIndex(i)}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}

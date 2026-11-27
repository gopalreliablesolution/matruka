'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';

export interface LightboxItem {
  _id?: string;
  title?: string;
  caption?: string;
  category?: string;
  imageUrl: string;
  altText?: string;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  currentIndex: number;
  items: LightboxItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function GalleryLightbox({
  isOpen,
  currentIndex,
  items,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const currentItem = items[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentItem) return null;

  const hasCaption = Boolean(currentItem.title?.trim() || currentItem.caption?.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-8 py-4 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-white">
          <span className="text-xs sm:text-sm font-semibold tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/15">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.category && (
            <span className="text-xs sm:text-xs font-medium text-brand-teal-300 bg-brand-teal-950/80 px-2.5 py-0.5 rounded-full border border-brand-teal-800/60 uppercase tracking-wider">
              {currentItem.category}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105 cursor-pointer border border-white/15"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Display */}
      <div
        className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden"
        onClick={onClose}
      >
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-brand-teal-300 transition-all duration-200 border border-white/20 backdrop-blur-xs cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* The Enlarge Photo */}
        <div
          className="relative max-w-full max-h-[82vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentItem.imageUrl}
            src={resolveImageUrl(currentItem.imageUrl, '/icon.png')}
            alt={currentItem.altText || currentItem.title || 'Hospital Gallery Photo'}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl transition-all duration-300 animate-in zoom-in-95"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/icon.png';
            }}
          />
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-brand-teal-300 transition-all duration-200 border border-white/20 backdrop-blur-xs cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>

      {/* Bottom Info Bar (Only rendered if there's text or category info) */}
      {hasCaption ? (
        <div
          className="w-full px-4 sm:px-8 py-4 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-2xl mx-auto space-y-1">
            {currentItem.title && (
              <h3 className="text-white font-bold text-sm sm:text-base font-heading">
                {currentItem.title}
              </h3>
            )}
            {currentItem.caption && (
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                {currentItem.caption}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );
}

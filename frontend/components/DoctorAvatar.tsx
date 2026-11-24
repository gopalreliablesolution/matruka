'use client';

import React, { useState, useEffect, useRef } from 'react';
import { resolveImageUrl } from '@/lib/api';

/**
 * Extracts the doctor's primary initial (ignoring titles like Dr., Dr, Prof., etc.)
 * Examples:
 *  "Dr. Kairavi Yagnik" -> "K"
 *  "Dr. Rut Shah" -> "R"
 *  "Dr Kairavi" -> "K"
 *  "Kairavi" -> "K"
 */
export function getDoctorInitial(name?: string): string {
  if (!name || typeof name !== 'string') return 'D';
  const clean = name.trim().replace(/^(dr\.|dr|doctor|prof\.|prof)\s+/i, '').trim();
  if (clean.length > 0) {
    return clean[0].toUpperCase();
  }
  return name.trim()[0]?.toUpperCase() || 'D';
}

interface DoctorAvatarProps {
  name: string;
  profileImage?: string | null;
  className?: string;
  textSize?: string;
  showBadge?: boolean;
}

export default function DoctorAvatar({
  name,
  profileImage,
  className = 'w-20 h-20 sm:w-22 sm:h-22 rounded-2xl',
  textSize = 'text-2xl sm:text-3xl',
  showBadge = true,
}: DoctorAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const rawUrl = profileImage ? profileImage.trim() : '';
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
      setImgError(true);
      return;
    }
    // Check if the browser image already errored before hydration
    if (imgRef.current) {
      if (imgRef.current.complete) {
        if (imgRef.current.naturalWidth === 0) {
          setImgError(true);
        } else {
          setImgLoaded(true);
        }
      }
    }
  }, [isValidUrl, rawUrl]);

  const hasImage = isValidUrl && !imgError;
  const initial = getDoctorInitial(name);

  return (
    <div className={`relative shrink-0 ${className}`}>
      {hasImage ? (
        <div className={`relative overflow-hidden w-full h-full ${className}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={resolveImageUrl(rawUrl)}
            alt={name || 'Doctor Profile'}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover ring-4 ring-teal-50 border-2 border-brand-teal-300/80 shadow-xs transition-opacity duration-300 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      ) : (
        /* Fallback: Name First Letter (MatruKa Teal Gradient Avatar) */
        <div
          className={`w-full h-full bg-gradient-to-br from-[#0496AC] via-[#037A8C] to-[#025E6C] text-white ring-4 ring-teal-50 border-2 border-brand-teal-300/80 shadow-xs flex items-center justify-center font-bold font-heading select-none ${textSize} ${className}`}
          title={name}
        >
          <span>{initial}</span>
        </div>
      )}

      {/* Online / Available Green Badge */}
      {showBadge && (
        <span
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-2xs z-10"
          title="Available for consultation"
        />
      )}
    </div>
  );
}

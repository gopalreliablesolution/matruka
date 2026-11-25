'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackClassName?: string;
}

export default function SafeImage({
  src,
  fallbackSrc = '/logo.png',
  alt = '',
  className = '',
  fallbackClassName,
  onError,
  ...props
}: SafeImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const isInitialFallback = !src || src === fallbackSrc || src === '/icon.png';
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [isFallback, setIsFallback] = useState(isInitialFallback);

  useEffect(() => {
    const isFb = !src || src === fallbackSrc || src === '/icon.png';
    setCurrentSrc(src || fallbackSrc);
    setIsFallback(isFb);
  }, [src, fallbackSrc]);

  // Catch images that already failed to load during SSR before React hydrated
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0 && !isFallback) {
      setIsFallback(true);
      setCurrentSrc(fallbackSrc);
    }
  }, [currentSrc, fallbackSrc, isFallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!isFallback) {
      setIsFallback(true);
      setCurrentSrc(fallbackSrc);
    }
    onError?.(e);
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      {...props}
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={isFallback && fallbackClassName ? fallbackClassName : className}
      onError={handleError}
    />
  );
}

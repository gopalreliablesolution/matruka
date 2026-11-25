'use client';

import React, { useState, useEffect } from 'react';

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
  const isInitialFallback = !src || src === fallbackSrc || src === '/icon.png';
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [isFallback, setIsFallback] = useState(isInitialFallback);

  useEffect(() => {
    const isFb = !src || src === fallbackSrc || src === '/icon.png';
    setCurrentSrc(src || fallbackSrc);
    setIsFallback(isFb);
  }, [src, fallbackSrc]);

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
      {...props}
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={isFallback && fallbackClassName ? fallbackClassName : className}
      onError={handleError}
    />
  );
}

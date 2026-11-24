'use client';

import React, { useEffect, useState } from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function HeroImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/hero/serene-maternity-moment-at-home.png',
}: HeroImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else if (imgSrc !== '/images/brand/matruka-logo.png') {
          setImgSrc('/images/brand/matruka-logo.png');
        }
      }}
    />
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Check if IntersectionObserver is supported
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        {
          threshold,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    } else {
      // Fallback for older environments
      setIsVisible(true);
    }
  }, [threshold]);

  const getAnimationStyles = (): { initial: string; active: string } => {
    switch (animation) {
      case 'fade-up':
        return {
          initial: 'opacity-0 translate-y-8',
          active: 'opacity-100 translate-y-0',
        };
      case 'fade-down':
        return {
          initial: 'opacity-0 -translate-y-8',
          active: 'opacity-100 translate-y-0',
        };
      case 'fade-left':
        return {
          initial: 'opacity-0 translate-x-8',
          active: 'opacity-100 translate-x-0',
        };
      case 'fade-right':
        return {
          initial: 'opacity-0 -translate-x-8',
          active: 'opacity-100 translate-x-0',
        };
      case 'zoom-in':
        return {
          initial: 'opacity-0 scale-95',
          active: 'opacity-100 scale-100',
        };
      case 'fade':
      default:
        return {
          initial: 'opacity-0',
          active: 'opacity-100',
        };
    }
  };

  const { initial, active } = getAnimationStyles();

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${isVisible ? active : initial} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

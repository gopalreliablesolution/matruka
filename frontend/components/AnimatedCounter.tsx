'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  className = '',
  duration = 1500,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Extract number and suffix/prefix (e.g. "10+" -> num: 10, suffix: "+", "100%" -> num: 100, suffix: "%")
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    if (!match) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.unobserve(entry.target);

          const prefix = match[1] || '';
          const targetNum = parseFloat(match[2]);
          const suffix = match[3] || '';
          const isDecimal = match[2].includes('.');
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic easing
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = easeOutProgress * targetNum;

            const formattedNum = isDecimal
              ? currentNum.toFixed(1)
              : Math.floor(currentNum).toString();

            setDisplayValue(`${prefix}${formattedNum}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [value, duration, hasAnimated, match]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  aboveActions?: boolean;
}

export default function ScrollToTopButton({ aboveActions = false }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setVisible(y > 260);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-[#0496AC] text-[#0496AC] hover:text-white border border-[#0496AC]/30 shadow-[0_6px_20px_rgba(4,150,172,0.22)] backdrop-blur-xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
        aboveActions
          ? 'bottom-[4.5rem] right-3 sm:bottom-[4.75rem] sm:right-6'
          : 'bottom-4 right-3 sm:bottom-6 sm:right-6'
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.4} />
    </button>
  );
}

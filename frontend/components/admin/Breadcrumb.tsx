'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#637C85]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content = (
            <>
              {index === 0 && <Home size={13} className="shrink-0" />}
              <span>{item.label}</span>
            </>
          );

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index === 0 && !isLast ? (
                <Link
                  href={item.href || '/admin'}
                  className="inline-flex items-center gap-1.5 rounded text-[#637C85] transition hover:text-primary"
                >
                  {content}
                </Link>
              ) : index > 0 && item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded text-[#637C85] transition hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={
                    isLast
                      ? 'inline-flex items-center gap-1.5 font-semibold text-[#344B53]'
                      : 'text-[#637C85]'
                  }
                >
                  {content}
                </span>
              )}

              {!isLast && (
                <ChevronRight size={12} className="text-[#B2C3C9]" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

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
    <nav className="flex text-sm text-gray-500 font-medium mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="inline-flex items-center">
              {isFirst && !item.href && <Home size={14} className="mr-1 text-gray-400" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center text-gray-500 hover:text-primary transition-colors"
                >
                  {isFirst && <Home size={14} className="mr-1 text-gray-400" />}
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold">{item.label}</span>
              )}
              {!isLast && <ChevronRight size={14} className="mx-1 text-gray-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


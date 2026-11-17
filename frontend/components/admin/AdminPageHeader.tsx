'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import Breadcrumb, { BreadcrumbItem } from '@/components/admin/Breadcrumb';

interface AdminPageHeaderProps {
  title: string;
  description?: React.ReactNode;
  eyebrow?: string;
  icon?: LucideIcon;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  breadcrumb,
  actions,
}: AdminPageHeaderProps) {
  const normalizedBreadcrumb =
    breadcrumb &&
    breadcrumb.length === 1 &&
    breadcrumb[0].label.toLowerCase() !== 'dashboard'
      ? [{ label: 'Dashboard', href: '/admin' }, ...breadcrumb]
      : breadcrumb;

  return (
    <header className="mb-1">
      {normalizedBreadcrumb && <Breadcrumb items={normalizedBreadcrumb} />}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-2.5">
            {Icon && (
              <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-primary-light/20 text-primary sm:inline-flex">
                <Icon size={18} />
              </span>
            )}
            <h1 className="admin-page-title">{title}</h1>
          </div>
          {description && <p className="admin-page-description">{description}</p>}
        </div>

        {actions && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

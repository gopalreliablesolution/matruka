'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function AdminHeader({
  onToggleSidebar,
  title,
}: {
  onToggleSidebar: () => void;
  title?: string;
}) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-brand-slate-600 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && <h1 className="text-lg font-bold text-brand-slate-900 font-heading">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-teal-200 text-brand-teal-700 hover:bg-brand-teal-50 text-xs font-semibold transition"
        >
          <span>Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-brand-teal-100 text-brand-teal-800 flex items-center justify-center font-bold text-xs">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-brand-slate-800">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-brand-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}


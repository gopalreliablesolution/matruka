'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  ExternalLink,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  onToggleSidebar,
  title = 'Dashboard',
  subtitle = 'MatruKa CMS control center',
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const initials =
    user?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'A';

  return (
    <header className="sticky top-0 z-40 border-b border-[#DDE6E8] bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDE6E8] bg-white text-[#344B53] shadow-sm transition hover:border-primary/30 hover:bg-primary-light/25 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-bold text-[#1A2C30] sm:text-base">
                {title}
              </h2>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 sm:block" />
            </div>
            <p className="hidden truncate text-[11px] font-medium text-[#637C85] sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-2 rounded-lg border border-[#DDE6E8] bg-white px-3 text-xs font-semibold text-[#344B53] shadow-sm transition hover:border-primary/30 hover:bg-primary-light/20 hover:text-primary md:inline-flex"
          >
            <ExternalLink size={14} />
            View live site
          </Link>

          <div className="hidden h-7 w-px bg-[#E3EAEC] md:block" />

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl p-1.5 pr-1.5 text-left transition hover:bg-[#F2F7F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:pr-2"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm ring-2 ring-primary/10">
                {initials}
              </span>
              <span className="hidden min-w-0 md:block">
                <span className="block max-w-36 truncate text-xs font-bold text-[#1A2C30]">
                  {user?.name || 'Administrator'}
                </span>
                <span className="block text-[10px] font-medium capitalize text-[#637C85]">
                  {user?.role?.replace('_', ' ') || 'Super Admin'}
                </span>
              </span>
              <ChevronDown
                size={14}
                className={`hidden text-[#637C85] transition-transform md:block ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-xl border border-[#DDE6E8] bg-white shadow-[0_18px_45px_rgba(19,52,58,0.16)]"
              >
                <div className="border-b border-[#E7EDEF] px-4 py-3.5">
                  <p className="truncate text-sm font-bold text-[#1A2C30]">
                    {user?.name || 'Administrator'}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#637C85]">
                    {user?.email || 'admin@matruka.in'}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-light/25 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-primary-dark">
                    <ShieldCheck size={11} />
                    {user?.role?.replace('_', ' ') || 'Super Admin'}
                  </span>
                </div>

                <div className="p-1.5">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#637C85]">
                    <UserRound size={15} />
                    <span>Secure administrator session</span>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#344B53] transition hover:bg-[#F2F7F8] hover:text-primary"
                  >
                    <ExternalLink size={15} />
                    Open live website
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

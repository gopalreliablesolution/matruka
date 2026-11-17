'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { menuItems } from '@/lib/admin/menuConfig';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const visibleMenuItems = useMemo(
    () =>
      menuItems
        .filter(
          (item) => !item.superAdminOnly || user?.role === 'super_admin'
        )
        .map((item) => ({
          ...item,
          subLinks: item.subLinks?.filter(
            (link) => !link.superAdminOnly || user?.role === 'super_admin'
          ),
        }))
        .filter(
          (item) => !item.subLinks || item.subLinks.length > 0
        ),
    [user?.role]
  );

  // Auto-expand the group that owns the current route.
  useEffect(() => {
    visibleMenuItems.forEach((item) => {
      if (
        item.subLinks?.some(
          (link) => pathname === link.href || pathname.startsWith(`${link.href}/`)
        )
      ) {
        setOpenMenus((previous) =>
          previous.includes(item.name) ? previous : [...previous, item.name]
        );
      }
    });
  }, [pathname, visibleMenuItems]);

  // Prevent the page behind the mobile drawer from scrolling.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const toggleMenu = (name: string) => {
    setOpenMenus((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name]
    );
  };

  const closeMobileSidebar = () => {
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[998] bg-[#0B2227]/55 backdrop-blur-[2px] lg:hidden"
          onClick={closeMobileSidebar}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[999] flex h-screen w-64 flex-col border-r border-white/10 bg-primary text-white shadow-[8px_0_30px_rgba(6,106,116,0.16)] transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/admin"
            onClick={closeMobileSidebar}
            className="flex items-center gap-2"
            aria-label="MatruKa admin dashboard"
          >
            <Image
              src="/logo-white.png"
              alt="MatruKa - Complete Care for Her"
              width={140}
              height={38}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="custom-sidebar-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/[0.45]">
            Workspace
          </p>

          {visibleMenuItems.map((item) => {
            const Icon = item.icon;

            if (!item.subLinks) {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  onClick={closeMobileSidebar}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-white/[0.72] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.3 : 2}
                    className={isActive ? 'text-primary' : 'text-white/[0.65] group-hover:text-white'}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            }

            const isOpen = openMenus.includes(item.name);
            const hasActiveChild = item.subLinks.some(
              (link) =>
                pathname === link.href || pathname.startsWith(`${link.href}/`)
            );

            return (
              <div key={item.name} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleMenu(item.name)}
                  aria-expanded={isOpen}
                  className={`group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                    hasActiveChild || isOpen
                      ? 'bg-white/10 text-white'
                      : 'text-white/[0.72] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={19}
                      strokeWidth={hasActiveChild ? 2.2 : 2}
                      className={
                        hasActiveChild || isOpen
                          ? 'text-white'
                          : 'text-white/[0.65] group-hover:text-white'
                      }
                    />
                    {item.name}
                  </span>
                  {isOpen ? (
                    <ChevronDown size={15} className="text-white/60" />
                  ) : (
                    <ChevronRight size={15} className="text-white/50" />
                  )}
                </button>

                {isOpen && (
                  <div className="ml-3 space-y-0.5 border-l border-white/[0.15] py-1 pl-3">
                    {item.subLinks.map((subLink) => {
                      const isSubActive =
                        pathname === subLink.href ||
                        pathname.startsWith(`${subLink.href}/`);

                      return (
                        <Link
                          key={subLink.name}
                          href={subLink.href}
                          onClick={closeMobileSidebar}
                          aria-current={isSubActive ? 'page' : undefined}
                          className={`block rounded-md px-3 py-2 text-[13px] transition-all ${
                            isSubActive
                              ? 'bg-white/[0.15] font-semibold text-white shadow-sm'
                              : 'text-white/[0.62] hover:bg-white/[0.08] hover:text-white'
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 bg-black/10 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-red-200 transition hover:bg-red-500/20 hover:text-white"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

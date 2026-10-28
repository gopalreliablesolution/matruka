'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { menuItems, type SidebarItem, type SubLink } from '@/lib/admin/menuConfig';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isSuperAdmin } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([
    'Doctors & Team',
    'Clinical Services',
    'Content Management',
    'Website & CMS',
  ]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-expand menu when navigating to any child route
  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.subLinks?.some(
          (link) => pathname === link.href || pathname.startsWith(link.href + '/')
        )
      ) {
        setOpenMenus((prev) =>
          prev.includes(item.name) ? prev : [...prev, item.name]
        );
      }
    });
  }, [pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-[999] p-2.5 bg-primary text-white rounded-xl lg:hidden shadow-lg hover:bg-primary-dark transition-colors"
        aria-label="Toggle Menu"
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`h-screen w-64 bg-primary text-white flex flex-col fixed left-0 top-0 shadow-2xl z-[1000] transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-white/10 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Top Brand Logo Header */}
        <div className="p-3.5 flex items-center justify-center border-b border-white/10 shrink-0 h-[5.25rem] bg-black/10">
          <Link
            href="/admin"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center justify-center w-full"
          >
            <div className="bg-white rounded-xl px-3.5 py-2 shadow-sm flex items-center justify-center w-full max-w-[14.5rem]">
              <Image
                src="/logo.png"
                alt="Matruka - Complete Care for Her"
                width={190}
                height={52}
                className="max-h-11 w-auto object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // Direct link without sublinks (e.g. Dashboard)
            if (!item.subLinks) {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm ${isActive
                      ? 'bg-white/15 text-white shadow-md backdrop-blur-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon
                    size={19}
                    className={
                      isActive
                        ? 'text-accent'
                        : 'text-white/70 group-hover:text-white'
                    }
                  />
                  <span>{item.name}</span>
                </Link>
              );
            }

            // Collapsible Menu Group
            const isOpen = openMenus.includes(item.name);
            const hasActiveChild = item.subLinks.some(
              (link) => pathname === link.href || pathname.startsWith(link.href + '/')
            );

            return (
              <div key={item.name} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleMenu(item.name)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm ${hasActiveChild || isOpen
                      ? 'text-white bg-white/10'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={19}
                      className={
                        hasActiveChild || isOpen
                          ? 'text-accent'
                          : 'text-white/70 group-hover:text-white'
                      }
                    />
                    <span className="text-left">{item.name}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown size={16} className="text-white/70" />
                  ) : (
                    <ChevronRight size={16} className="text-white/70" />
                  )}
                </button>

                {isOpen && (
                  <div className="pl-4 ml-3 border-l border-white/15 space-y-1 my-1">
                    {item.subLinks.map((subLink) => {
                      const isSubActive =
                        pathname === subLink.href ||
                        pathname.startsWith(subLink.href + '/');

                      return (
                        <Link
                          key={subLink.name}
                          href={subLink.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`block px-3 py-1.5 rounded-lg text-xs sm:text-[13px] transition-colors ${isSubActive
                              ? 'text-white bg-white/15 font-semibold shadow-sm'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
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

        {/* Footer / Logout */}
        <div className="p-3.5 border-t border-white/10 shrink-0 bg-black/20 space-y-2">
          <div className="flex items-center justify-between px-2 py-1 text-xs text-white/80">
            <div className="truncate">
              <p className="font-semibold text-white truncate text-xs">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-accent uppercase font-bold tracking-wider">
                {user?.role?.replace('_', ' ') || 'Super Admin'}
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              title="View Live Website"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ExternalLink size={14} />
            </Link>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2.5 px-3 py-2 w-full text-center font-semibold text-red-200 hover:bg-red-500/20 hover:text-white rounded-xl transition-all duration-200 text-xs border border-red-400/20"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}


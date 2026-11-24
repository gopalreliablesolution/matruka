'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';

export interface MenuItemData {
  _id?: string;
  label: string;
  url: string;
  sortOrder?: number;
  isExternal?: boolean;
  isActive?: boolean;
  parentId?: string | { _id: string; label: string; url: string } | null;
  children?: MenuItemData[];
}

interface NavbarProps {
  settings?: {
    clinicName?: string;
    gujaratiName?: string;
    appointmentPhone?: string;
    opdTimings?: string;
    address?: string;
    logoUrl?: string;
  };
  menus?: MenuItemData[];
  services?: any[];
}

const DEFAULT_SERVICES = [
  { label: 'Personalized Antenatal Care (ANC)', href: '/services/personalized-antenatal-care' },
  { label: 'Normal Delivery & Cesarean Section', href: '/services/normal-delivery-cesarean-section' },
  { label: 'Painless Vaginal Delivery (Epidural)', href: '/services/painless-vaginal-delivery' },
  { label: 'High Risk Pregnancy Management', href: '/services/high-risk-pregnancy-management' },
  { label: 'Gynecological Endoscopic Surgeries', href: '/services/gynecological-endoscopic-surgeries' },
  { label: 'Fertility Evaluation & Workup', href: '/services/fertility-evaluation-workup' },
];

const DEFAULT_MEDIA = [
  { label: 'Photo Gallery', href: '/gallery' },
  { label: 'Video Showcase (YouTube)', href: '/videos' },
];

const DEFAULT_MENUS: MenuItemData[] = [
  { label: 'Home', url: '/', sortOrder: 1 },
  { label: 'About Us', url: '/about', sortOrder: 2 },
  { label: 'Services', url: '/services', sortOrder: 3 },
  { label: 'Doctors', url: '/doctors', sortOrder: 4 },
  { label: 'Facilities', url: '/facilities', sortOrder: 5 },
  { label: 'Media', url: '/media', sortOrder: 6 },
  { label: 'Book Appointment', url: '/book-appointment', sortOrder: 7 },
  { label: 'Contact Us', url: '/contact', sortOrder: 8 },
];

interface DesktopNavItemProps {
  label: string;
  href?: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

function DesktopNavItem({
  label,
  href,
  isActive = false,
  hasDropdown = false,
  expanded = false,
  onClick,
  onMouseEnter,
}: DesktopNavItemProps) {
  const content = (
    <span
      className={`relative flex items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 xl:text-[13px] xl:tracking-wider ${
        isActive || expanded
          ? 'text-[#0496AC]'
          : 'text-[#1A2C30] hover:text-[#0496AC]'
      }`}
    >
      {label}
      {hasDropdown && (
        <ChevronDown
          size={12}
          className={`shrink-0 transition-transform duration-200 ${
            expanded ? 'rotate-180 text-[#0496AC]' : 'text-slate-400'
          }`}
        />
      )}
      {isActive && (
        <span
          className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0496AC] to-[#037A8C] rounded-full shadow-[0_1px_6px_rgba(4,150,172,0.45)]"
          aria-hidden="true"
        />
      )}
    </span>
  );

  if (href && !hasDropdown) {
    return (
      <Link
        href={href}
        className="relative flex h-full items-center px-2.5 lg:px-3.5 transition-colors hover:bg-slate-50/60"
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="relative flex h-full cursor-pointer items-center px-2.5 lg:px-3.5 select-none transition-colors hover:bg-slate-50/60"
      aria-haspopup={hasDropdown ? 'menu' : undefined}
      aria-expanded={hasDropdown ? expanded : undefined}
    >
      {content}
    </button>
  );
}

export default function Navbar({ settings, menus, services }: NavbarProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [openMobileAccordions, setOpenMobileAccordions] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navContainerRef = useRef<HTMLDivElement>(null);

  const phone = settings?.appointmentPhone || '7984882273';
  const navLogo = (settings?.logoUrl && settings.logoUrl.trim()) ? resolveImageUrl(settings.logoUrl) : '/logo.png';

  const getParentIdStr = (item: MenuItemData): string | null => {
    if (!item.parentId) return null;
    if (typeof item.parentId === 'object' && item.parentId !== null) {
      return item.parentId._id;
    }
    return String(item.parentId);
  };

  // Build the hierarchical menu tree
  const processedMenus = useMemo(() => {
    const rawItems: MenuItemData[] =
      menus && menus.length > 0 ? menus : DEFAULT_MENUS;

    const activeItems = rawItems.filter((m) => m.isActive !== false);

    // Filter top-level items
    const topLevels = activeItems
      .filter((m) => !getParentIdStr(m))
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Attach children to each top-level menu
    const built = topLevels.map((parent) => {
      const parentId = parent._id;
      let children = activeItems
        .filter((child) => parentId && getParentIdStr(child) === parentId)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      // Fallback for default Services if no database children exist yet
      const labelLower = parent.label.trim().toLowerCase();
      if (
        children.length === 0 &&
        (parent.url === '/services' || labelLower === 'services' || labelLower === 'specialities')
      ) {
        if (services && services.length > 0) {
          children = services.map((s: any, idx: number) => ({
            label: s.name,
            url: `/services/${s.slug}`,
            sortOrder: s.sortOrder ?? idx + 1,
          }));
        } else {
          children = DEFAULT_SERVICES.map((s, idx) => ({
            label: s.label,
            url: s.href,
            sortOrder: idx + 1,
          }));
        }
      }

      // Fallback for default Media if no database children exist yet
      if (
        children.length === 0 &&
        (parent.url === '/media' || labelLower === 'media')
      ) {
        children = DEFAULT_MEDIA.map((m, idx) => ({
          label: m.label,
          url: m.href,
          sortOrder: idx + 1,
        }));
      }

      return {
        ...parent,
        children,
      };
    });

    // Ensure Book Appointment is always available in header (without breaking dynamic menus)
    const hasBookAppointment = built.some(
      (item) => item.url === '/book-appointment' || item.label.trim().toLowerCase() === 'book appointment'
    );
    if (!hasBookAppointment) {
      const contactIdx = built.findIndex((item) => ['contact', 'contact us'].includes(item.label.trim().toLowerCase()) || item.url === '/contact');
      const bookItem = {
        label: 'Book Appointment',
        url: '/book-appointment',
        sortOrder: contactIdx >= 0 ? (built[contactIdx].sortOrder || contactIdx + 1) : (built.length + 1),
        children: [] as MenuItemData[],
      };
      if (contactIdx >= 0) {
        built.splice(contactIdx, 0, bookItem);
      } else {
        built.push(bookItem);
      }
    }

    return built;
  }, [menus, services]);

  // Keep desktop header clean: show primary items and group the rest under "More"
  const { primaryMenus, moreMenus } = useMemo(() => {
    const priority = ['home', 'about us', 'about', 'services', 'specialities', 'doctors', 'facilities', 'media', 'book appointment', 'book consultation', 'gallery', 'blog', 'blogs', 'testimonials', 'faqs', 'contact us', 'contact'];
    const scored = processedMenus.map((item, idx) => {
      const key = item.label.trim().toLowerCase();
      const p = priority.indexOf(key);
      return { item, idx, score: p === -1 ? 100 + idx : p };
    });
    const ordered = [...scored].sort((a, b) => a.score - b.score || a.idx - b.idx).map((s) => s.item);

    // If contact exists, prefer keeping it visible as primary CTA target; otherwise cap at 6
    const contactIndex = ordered.findIndex((i) => ['contact', 'contact us'].includes(i.label.trim().toLowerCase()));
    let primaryCount = ordered.length <= 7 ? ordered.length : 6;
    if (contactIndex >= 6 && ordered.length > 7) {
      // include contact by swapping into last primary slot
      const copy = [...ordered];
      const [contactItem] = copy.splice(contactIndex, 1);
      copy.splice(5, 0, contactItem);
      return { primaryMenus: copy.slice(0, 6), moreMenus: copy.slice(6) };
    }
    return { primaryMenus: ordered.slice(0, primaryCount), moreMenus: ordered.slice(primaryCount) };
  }, [processedMenus]);

  const isPathActive = (href: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setActiveDropdownId(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdownId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdownId(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  const toggleMobileAccordion = (id: string) => {
    setOpenMobileAccordions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(4,150,172,0.06)] transition-all">
        <div className="relative z-50 flex h-[4.5rem] w-full items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8 xl:px-12">
          {/* Logo */}
          <Link
            href="/"
            translate="no"
            className="notranslate relative h-[3.25rem] w-[8.125rem] shrink-0 transition-transform duration-200 hover:scale-[1.02] lg:h-[3.25rem] lg:w-[9.75rem]"
            aria-label="MatruKa home"
          >
            <Image
              src={navLogo}
              alt="MatruKa - Complete Care for Her"
              fill
              sizes="(max-width: 1024px) 130px, 150px"
              priority
              unoptimized
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
          </Link>

          {/* Mobile actions */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <a
              href={`tel:+91${phone}`}
              translate="no"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#0496AC] to-[#037A8C] text-white shadow-[0_2px_10px_rgba(4,150,172,0.35)] transition-all active:scale-95"
              aria-label={`Call MatruKa clinic on +91 ${phone}`}
            >
              <Phone size={17} className="text-white" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50 text-[#1A2C30] transition-colors hover:bg-slate-100 cursor-pointer"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop navigation */}
          <nav
            ref={navContainerRef}
            className="hidden h-full flex-1 items-center justify-center lg:flex"
            aria-label="Main navigation"
          >
            <div className="flex h-full items-center gap-1 xl:gap-2">
              {[...primaryMenus, ...(moreMenus.length ? [{ _id: '__more__', label: 'More', url: '#', children: moreMenus }] : [])].map((item: any) => {
                const itemId = item._id || item.url || item.label;
                const isMore = item._id === '__more__';
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isDropdownOpen = activeDropdownId === itemId;

                const isChildActive = hasChildren
                  ? item.children!.some((c: any) => isPathActive(c.url))
                  : false;
                const isParentActive = !isMore && (isPathActive(item.url) || isChildActive);

                if (hasChildren) {
                  return (
                    <div
                      key={itemId}
                      className="relative flex h-full items-center"
                      onMouseEnter={() => setActiveDropdownId(itemId)}
                      onMouseLeave={() => setActiveDropdownId(null)}
                    >
                      <DesktopNavItem
                        label={item.label.toUpperCase()}
                        hasDropdown
                        isActive={isParentActive || isChildActive}
                        expanded={isDropdownOpen}
                        onClick={() =>
                          setActiveDropdownId((prev) => (prev === itemId ? null : itemId))
                        }
                      />

                      {isDropdownOpen && (
                        <div
                          role="menu"
                          className={`absolute ${isMore ? 'right-0 left-auto translate-x-0' : 'left-1/2 -translate-x-1/2'} top-[4.75rem] z-[60] flex max-h-[72vh] min-w-[16rem] max-w-[22rem] flex-col gap-1 overflow-y-auto rounded-2xl border border-slate-100/90 bg-white/98 p-2.5 backdrop-blur-md shadow-[0_16px_45px_rgba(4,150,172,0.14)] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150`}
                        >
                          {item.children!.map((child: any) => {
                            const childHasNested = Boolean(child.children && child.children.length > 0);
                            if (childHasNested) {
                              return (
                                <div key={child._id || child.url || child.label} className="px-1 py-1">
                                  <div className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-wider text-[#0496AC]">
                                    {child.label}
                                  </div>
                                  <div className="space-y-0.5">
                                    {child.children.map((nested: any) => {
                                      const isNestedCurrent = isPathActive(nested.url);
                                      return (
                                        <Link
                                          key={nested._id || nested.url}
                                          href={nested.url}
                                          role="menuitem"
                                          onClick={() => setActiveDropdownId(null)}
                                          className={`block rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
                                            isNestedCurrent
                                              ? 'bg-[#0496AC]/10 text-[#0496AC] font-bold'
                                              : 'text-[#1A2C30] hover:bg-slate-50 hover:text-[#0496AC]'
                                          }`}
                                        >
                                          {nested.label}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            }
                            const isChildCurrent = isPathActive(child.url);
                            return (
                              <Link
                                key={child._id || child.url}
                                href={child.url}
                                role="menuitem"
                                onClick={() => setActiveDropdownId(null)}
                                className={`rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                                  isChildCurrent
                                    ? 'bg-[#0496AC]/10 text-[#0496AC] font-bold border-l-2 border-[#0496AC]'
                                    : 'text-[#1A2C30] hover:bg-slate-50 hover:text-[#0496AC] hover:translate-x-0.5'
                                }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <DesktopNavItem
                    key={itemId}
                    label={item.label.toUpperCase()}
                    href={item.url}
                    isActive={isParentActive}
                  />
                );
              })}
            </div>
          </nav>

          {/* Desktop call action */}
          <div className="hidden shrink-0 items-center lg:flex">
            <a
              href={`tel:+91${phone}`}
              translate="no"
              className="notranslate group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#0496AC] via-[#037A8C] to-[#025E6C] px-5 py-2.5 text-white shadow-[0_4px_14px_rgba(4,150,172,0.32)] transition-all duration-300 hover:shadow-[0_6px_22px_rgba(4,150,172,0.45)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-12">
                <Phone size={13} className="text-white" />
              </span>
              <span className="text-xs font-bold tracking-wider font-heading">+91 {phone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={closeMobileMenu}
          aria-label="Close menu backdrop"
        />
      )}

      {/* Mobile slide-out drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-[130] flex w-[85%] max-w-[20rem] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src={navLogo}
              alt="MatruKa"
              width={120}
              height={35}
              unoptimized
              className="h-7 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
          </Link>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-[#1A2C30] transition-colors hover:bg-gray-100 cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation links">
            {processedMenus.map((item) => {
              const itemId = item._id || item.url || item.label;
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isOpen = openMobileAccordions.includes(itemId);

              const isChildActive = hasChildren
                ? item.children!.some((c) => isPathActive(c.url))
                : false;
              const isParentActive = isPathActive(item.url) || isChildActive;

              if (hasChildren) {
                return (
                  <div key={itemId} className="rounded-lg border border-transparent">
                    <button
                      type="button"
                      onClick={() => toggleMobileAccordion(itemId)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-bold transition-colors ${
                        isParentActive
                          ? 'bg-[#0496AC]/5 text-[#0496AC]'
                          : 'text-[#1A2C30] hover:bg-gray-50'
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{item.label.toUpperCase()}</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-300 text-slate-400 ${
                          isOpen ? 'rotate-180 text-[#0496AC]' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-[30rem] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="mt-1 flex flex-col rounded-lg bg-gray-50/80 px-2 py-2 space-y-1">
                        {item.children!.map((child) => {
                          const isChildCurrent = isPathActive(child.url);
                          return (
                            <Link
                              key={child._id || child.url}
                              href={child.url}
                              onClick={closeMobileMenu}
                              className={`rounded-md px-3.5 py-2 text-xs font-semibold uppercase leading-relaxed transition-colors ${
                                isChildCurrent
                                  ? 'bg-[#0496AC]/10 text-[#0496AC] font-bold'
                                  : 'text-[#1A2C30] hover:bg-white hover:text-[#0496AC]'
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={itemId}
                  href={item.url}
                  onClick={closeMobileMenu}
                  className={`rounded-lg px-4 py-3 text-sm font-bold transition-colors ${
                    isParentActive
                      ? 'bg-[#0496AC]/5 text-[#0496AC]'
                      : 'text-[#1A2C30] hover:bg-gray-50'
                  }`}
                >
                  {item.label.toUpperCase()}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <a
            href={`tel:+91${phone}`}
            translate="no"
            className="notranslate flex w-full items-center justify-center gap-3 rounded-xl bg-[#0496AC] p-3 text-white transition-opacity hover:opacity-90 shadow-xs"
          >
            <Phone size={18} />
            <span className="text-sm font-bold">+91 {phone}</span>
          </a>
        </div>
      </aside>
    </>
  );
}

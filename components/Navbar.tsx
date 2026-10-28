'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Clock, MapPin, Menu, X, Heart, Shield, Sparkles } from 'lucide-react';

interface NavbarProps {
  settings?: {
    clinicName?: string;
    gujaratiName?: string;
    appointmentPhone?: string;
    opdTimings?: string;
    address?: string;
  };
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const phone = settings?.appointmentPhone || '7984882273';
  const opdTimings = settings?.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Mon - Sat)';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blogs', href: '/blog' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image
            src="/logo.png"
            alt="MatruKa - Complete Care for Her"
            width={180}
            height={44}
            className="h-8 sm:h-9 md:h-10 w-auto max-w-[150px] sm:max-w-[190px] object-contain transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'text-brand-teal-600 bg-brand-teal-50 font-semibold shadow-xs'
                    : 'text-brand-slate-700 hover:text-brand-teal-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Call to Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-xs lg:text-[13px] font-semibold px-3.5 py-2 rounded-lg shadow-xs hover:shadow transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Clinic</span>
          </a>
          <a
            href={`https://wa.me/91${phone}?text=Hello%20MatruKa%2C%20I%20would%20like%20information%20regarding%20OPD%20timings.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs lg:text-[13px] font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-brand-slate-600 hover:text-brand-teal-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-lg">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium flex items-center justify-between ${isActive
                      ? 'bg-brand-teal-50 text-brand-teal-600 font-semibold'
                      : 'text-brand-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <a
              href={`tel:${phone}`}
              className="w-full flex items-center justify-center gap-2 bg-brand-teal-600 text-white font-semibold py-3 rounded-lg shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Clinic: {phone}</span>
            </a>
            <a
              href={`https://wa.me/91${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-emerald-500 text-emerald-700 font-medium py-2.5 rounded-lg"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


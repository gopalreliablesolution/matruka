'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/api';
import {
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Share2,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FooterProps {
  settings?: {
    clinicName?: string;
    gujaratiName?: string;
    tagline?: string;
    appointmentPhone?: string;
    emergencyPhone?: string;
    whatsappNumber?: string;
    email?: string;
    address?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    opdTimings?: string;
    sundayTimings?: string;
    emergencyHours?: string;
    copyrightText?: string;
    googleMapsDirectionsUrl?: string;
    logoUrl?: string;
    logoWhiteUrl?: string;
    footerAboutText?: string;
    footerBadge1?: string;
    footerBadge2?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
      twitter?: string;
    };
    featuredServices?: Array<{ name?: string; title?: string; slug?: string }>;
  };
  footerMenus?: Array<{
    _id?: string;
    label: string;
    url: string;
    sortOrder?: number;
    footerSection?: 'quick_links' | 'specialities' | 'patient_info';
    isActive?: boolean;
    isFooter?: boolean;
  }>;
  services?: Array<{
    _id?: string;
    name?: string;
    title?: string;
    slug?: string;
    isActive?: boolean;
  }>;
}

export default function Footer({ settings, footerMenus, services }: FooterProps) {
  // Dynamic Clinic Details
  const clinicName = settings?.clinicName || 'MatruKa';
  const tagline = settings?.tagline || 'Complete Care for Her';
  const phone = settings?.appointmentPhone || '7984882273';
  const emergencyPhone = settings?.emergencyPhone || phone;
  const whatsappNumber =
    settings?.whatsappNumber?.replace(/\D/g, '') ||
    (phone ? (phone.startsWith('91') ? phone : `91${phone}`) : '917984882273');
  const email = settings?.email || 'info@matruka.in';
  const address =
    settings?.address ||
    '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007';
  const opdTimings =
    settings?.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)';
  const copyrightText =
    settings?.copyrightText ||
    `© ${new Date().getFullYear()} ${clinicName} — ${tagline}. All rights reserved.`;

  const mapUrl =
    settings?.googleMapsDirectionsUrl && settings.googleMapsDirectionsUrl.trim()
      ? settings.googleMapsDirectionsUrl
      : `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const footerLogo =
    settings?.logoWhiteUrl && settings.logoWhiteUrl.trim()
      ? resolveImageUrl(settings.logoWhiteUrl)
      : settings?.logoUrl && settings.logoUrl.trim() && settings.logoUrl !== '/logo.png'
      ? resolveImageUrl(settings.logoUrl)
      : '/logo-white.png';

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${clinicName} — ${tagline}`,
          text: `Dedicated women’s healthcare, pregnancy, and laparoscopic surgery clinic in Surat.`,
          url: typeof window !== 'undefined' ? window.location.origin : 'https://matruka.in',
        });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success('Website link copied to clipboard!');
      } catch {
        toast.success('Website link copied!');
      }
    }
  };

  // Dynamic Social Links (Render only configured platforms, or standard fallback)
  const social = settings?.socialLinks || {};
  const hasCustomSocial = Boolean(
    social.facebook?.trim() ||
      social.instagram?.trim() ||
      social.youtube?.trim() ||
      social.linkedin?.trim() ||
      social.twitter?.trim()
  );

  const allSocialPlatforms = [
    {
      name: 'Instagram',
      href: social.instagram?.trim() || (hasCustomSocial ? '' : 'https://instagram.com/matruka_surat'),
      icon: Instagram,
    },
    {
      name: 'Facebook',
      href: social.facebook?.trim() || (hasCustomSocial ? '' : 'https://facebook.com/matrukasurat'),
      icon: Facebook,
    },
    {
      name: 'YouTube',
      href: social.youtube?.trim() || (hasCustomSocial ? '' : 'https://youtube.com'),
      icon: Youtube,
    },
    {
      name: 'LinkedIn',
      href: social.linkedin?.trim() || (hasCustomSocial ? '' : 'https://linkedin.com'),
      icon: Linkedin,
    },
    {
      name: 'Twitter / X',
      href: social.twitter?.trim() || '',
      icon: Twitter,
    },
  ];

  const socialList = allSocialPlatforms.filter((s) => Boolean(s.href));

  // Dynamic Menus from Database
  const activeFooter = (footerMenus || []).filter((m) => m.isActive !== false);

  const dynamicSpecialities = activeFooter
    .filter((m) => m.footerSection === 'specialities')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const dynamicQuickLinks = activeFooter
    .filter((m) => m.footerSection === 'quick_links' || !m.footerSection)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const dynamicPatientInfo = activeFooter
    .filter((m) => m.footerSection === 'patient_info')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Fallback Service List
  const DEFAULT_SERVICES = [
    { label: 'Personalized Antenatal Care (ANC)', href: '/services/personalized-antenatal-care' },
    { label: 'Normal Delivery & Cesarean Section', href: '/services/normal-delivery-cesarean-section' },
    { label: 'Painless Vaginal Delivery (Epidural)', href: '/services/painless-vaginal-delivery' },
    { label: 'High Risk Pregnancy Management', href: '/services/high-risk-pregnancy-management' },
    { label: 'Gynec Laparoscopic Surgeries', href: '/services/gynec-laparoscopic-surgeries' },
    { label: 'Infertility Evaluation & Treatment', href: '/services/infertility-evaluation-management' },
    { label: 'Advanced Gynec Ultrasound & 3D/4D', href: '/services/gynec-ultrasound' },
    { label: 'Hysterectomy Surgeries (TLH/NDVH)', href: '/services/hysterectomy-surgeries' },
  ];

  // Fallback Quick Links
  const DEFAULT_QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About MatruKa', href: '/about' },
    { label: 'Our Doctors & Credentials', href: '/doctors' },
    { label: 'Hospital Facilities & OT', href: '/facilities' },
    { label: 'Clinic Tour & Gallery', href: '/gallery' },
    { label: 'Pregnancy Health Articles', href: '/blog' },
  ];

  // Resolve Dynamic Services:
  // 1. If explicit footer specialities menu exists, use it
  // 2. Else if live services array passed from backend API, use up to 8 active services
  // 3. Else if settings.featuredServices exists, use it
  // 4. Else use default fallback
  const servicesList: Array<{ label: string; href: string }> =
    dynamicSpecialities.length > 0
      ? dynamicSpecialities.map((s) => ({ label: s.label, href: s.url }))
      : Array.isArray(services) && services.length > 0
      ? services
          .filter((s) => s.isActive !== false)
          .slice(0, 8)
          .map((s) => ({
            label: s.title || s.name || 'Service',
            href: s.slug ? `/services/${s.slug}` : '/services',
          }))
      : settings?.featuredServices && settings.featuredServices.length > 0
      ? settings.featuredServices.slice(0, 8).map((s: any) => ({
          label: s.title || s.name || 'Service',
          href: s.slug ? `/services/${s.slug}` : '/services',
        }))
      : DEFAULT_SERVICES;

  // Resolve Dynamic Quick Links (excluding legal links already in bottom bar):
  const isLegalFooterLink = (href?: string) => {
    const clean = (href || '').trim().toLowerCase();
    return clean === '/privacy-policy' || clean === '/terms' || clean === '/terms-and-conditions';
  };

  const quickLinks: Array<{ label: string; href: string }> =
    dynamicQuickLinks.length > 0 || dynamicPatientInfo.length > 0
      ? [...dynamicQuickLinks, ...dynamicPatientInfo]
          .filter((q) => !isLegalFooterLink(q.url))
          .map((q) => ({ label: q.label, href: q.url }))
      : DEFAULT_QUICK_LINKS;

  return (
    <>
      {/* MatruKa Signature Color Theme: Deep Teal Gradient with Gold Accents */}
      <footer className="relative bg-gradient-to-b from-[#0496AC] via-[#037A8C] to-[#025E6C] text-white font-sans overflow-hidden border-t border-[#05B4CE]/25">
        {/* Subtle decorative background glow circles */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.06] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[#F7CE6E]/[0.05] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pb-14">
          {/* Main 4-Column Grid (Jogi Style Layout in MatruKa Theme) */}
          <div className="grid grid-cols-1 gap-10 border-b border-white/20 pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Column 1: Logo + Social Buttons + Newsletter */}
            <div className="lg:col-span-4 space-y-5">
              <Link href="/" className="inline-flex items-center transition-transform hover:scale-[1.01]">
                <Image
                  src={footerLogo}
                  alt={`${clinicName} - ${tagline}`}
                  width={220}
                  height={55}
                  className="h-12 w-auto object-contain drop-shadow-sm"
                  priority
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.src = '/logo-white.png';
                  }}
                />
              </Link>

              {/* Tagline / About text from backend */}
              {settings?.footerAboutText && (
                <p className="text-xs text-white/90 leading-relaxed max-w-sm">
                  {settings.footerAboutText}
                </p>
              )}

              {/* Social Media Circular White Buttons with Gold Hover */}
              {socialList.length > 0 && (
                <div className="flex items-center gap-3 pt-1">
                  {socialList.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        className="w-10 h-10 rounded-full bg-white text-[#0496AC] hover:bg-[#F7CE6E] hover:text-slate-900 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Column 2: Clinical Services (with dividers) */}
            <div className="lg:col-span-3">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F7CE6E]" />
                <span>Services</span>
              </h3>
              <ul className="space-y-1">
                {servicesList.map((svc) => (
                  <li key={svc.href} className="border-b border-white/15 last:border-b-0">
                    <Link
                      href={svc.href}
                      className="block py-2 text-xs sm:text-sm text-white/90 transition-all hover:text-white hover:translate-x-1"
                    >
                      {svc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Quick Links (with dividers) */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F7CE6E]" />
                <span>Quick Links</span>
              </h3>
              <ul className="space-y-1">
                {quickLinks.map((item) => (
                  <li key={item.href} className="border-b border-white/15 last:border-b-0">
                    <Link
                      href={item.href}
                      className="block py-2 text-xs sm:text-sm text-white/90 transition-all hover:text-white hover:translate-x-1"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Location */}
            <div className="lg:col-span-3">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F7CE6E]" />
                <span>Contact</span>
              </h3>

              <div className="space-y-3">
                {/* Email */}
                {email && (
                  <div className="border-b border-white/15 pb-2.5">
                    <a
                      href={`mailto:${email}`}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90 hover:text-white transition-colors group"
                    >
                      <Mail size={16} className="text-[#F7CE6E] mt-0.5 shrink-0" />
                      <span className="break-all">{email}</span>
                    </a>
                  </div>
                )}

                {/* Consultation Phone */}
                {phone && (
                  <div className="border-b border-white/15 pb-2.5">
                    <a
                      href={`tel:${phone}`}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90 hover:text-white transition-colors group"
                    >
                      <Phone size={16} className="text-[#F7CE6E] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-white">+91 {phone}</span>
                        <span className="block text-[10px] text-white/75 tracking-wider font-semibold uppercase mt-0.5">
                          [ONLINE-CONSULTATION]
                        </span>
                      </div>
                    </a>
                  </div>
                )}

                {/* Emergency / Hospital Phone */}
                {emergencyPhone && (
                  <div className="border-b border-white/15 pb-2.5">
                    <a
                      href={`tel:${emergencyPhone}`}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90 hover:text-white transition-colors group"
                    >
                      <PhoneCall size={16} className="text-[#F7CE6E] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-white">+91 {emergencyPhone}</span>
                        <span className="block text-[10px] text-white/75 tracking-wider font-semibold uppercase mt-0.5">
                          [HOSPITAL & EMERGENCY]
                        </span>
                      </div>
                    </a>
                  </div>
                )}

                {/* OPD Timings */}
                {opdTimings && (
                  <div className="border-b border-white/15 pb-2.5">
                    <div className="flex items-start gap-2.5 text-xs text-white/90">
                      <Clock size={16} className="text-[#F7CE6E] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">{opdTimings}</span>
                        {settings?.sundayTimings && (
                          <span className="block text-[10px] text-[#F7CE6E] font-semibold mt-0.5">
                            Sunday: {settings.sundayTimings}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Address & Google Maps */}
                <div className="pb-1">
                  <div className="flex items-start gap-2.5 text-xs leading-relaxed text-white/90">
                    <MapPin size={16} className="text-[#F7CE6E] mt-0.5 shrink-0" />
                    <div>
                      <span>{address}</span>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-xs font-bold text-[#F7CE6E] hover:text-[#FBE0A2]"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-5 text-white/80">
              {copyrightText}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/85">
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BAR IN MATRUKA THEME (Bottom Right) */}
      <div className="fixed bottom-4 right-3 sm:right-6 z-40 flex items-center gap-2 sm:gap-2.5">
        {/* WhatsApp Round Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            `Hello ${clinicName}, I would like to enquire about consultation and appointments.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 group"
        >
          <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
        </a>

        {/* Call Round Button */}
        <a
          href={`tel:${phone}`}
          aria-label="Call Clinic"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0496AC] hover:bg-[#037A8C] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/20 group"
        >
          <Phone size={19} className="group-hover:rotate-12 transition-transform" />
        </a>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share Website"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#025E6C] hover:bg-[#01424C] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/20 cursor-pointer"
        >
          <Share2 size={18} />
        </button>
      </div>
    </>
  );
}

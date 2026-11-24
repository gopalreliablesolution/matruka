'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/api';
import {
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  settings?: {
    clinicName?: string;
    gujaratiName?: string;
    appointmentPhone?: string;
    emergencyPhone?: string;
    email?: string;
    address?: string;
    opdTimings?: string;
    sundayTimings?: string;
    copyrightText?: string;
    googleMapsDirectionsUrl?: string;
    logoUrl?: string;
    logoWhiteUrl?: string;
    footerAboutText?: string;
    footerBadge1?: string;
    footerBadge2?: string;
    featuredServices?: Array<{ name: string; slug: string }>;
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
}

export default function Footer({ settings, footerMenus }: FooterProps) {
  const phone = settings?.appointmentPhone || '7984882273';
  const address =
    settings?.address ||
    '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007';
  const opdTimings =
    settings?.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)';
  const footerLogo =
    (settings?.logoWhiteUrl && settings.logoWhiteUrl.trim())
      ? resolveImageUrl(settings.logoWhiteUrl)
      : '/logo-white.png';

  const footerAbout =
    settings?.footerAboutText ||
    'Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.';
  const badge1 = settings?.footerBadge1 || 'FOGSI Certified Ultrasound';
  const badge2 = settings?.footerBadge2 || 'Laparoscopic Surgeons';

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

  const DEFAULT_SERVICES = [
    { label: 'Personalized Antenatal Care (ANC)', href: '/services/personalized-antenatal-care' },
    { label: 'Normal Delivery & Cesarean Section', href: '/services/normal-delivery-cesarean-section' },
    { label: 'Painless Vaginal Delivery (Epidural)', href: '/services/painless-vaginal-delivery' },
    { label: 'High Risk Pregnancy Management', href: '/services/high-risk-pregnancy-management' },
    { label: 'Gynec Laparoscopic Surgeries', href: '/services/gynec-laparoscopic-surgeries' },
    { label: 'Hysterectomy Surgeries (TLH/NDVH)', href: '/services/hysterectomy-surgeries' },
    { label: 'Infertility Evaluation & Treatment', href: '/services/infertility-evaluation-management' },
    { label: 'Gynec Ultrasound Diagnostics', href: '/services/gynec-ultrasound' },
  ];

  const DEFAULT_QUICK_LINKS = [
    { label: 'About MatruKa', href: '/about' },
    { label: 'Our Doctors & Credentials', href: '/doctors' },
    { label: 'Hospital Facilities & OT', href: '/facilities' },
    { label: 'Clinic Tour & Gallery', href: '/gallery' },
    { label: 'Pregnancy Health Articles', href: '/blog' },
    { label: 'FAQs & OPD Guidelines', href: '/faqs' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ];

  const servicesList =
    dynamicSpecialities.length > 0
      ? dynamicSpecialities.map((s) => ({ label: s.label, href: s.url }))
      : (settings?.featuredServices && settings.featuredServices.length > 0)
        ? settings.featuredServices.slice(0, 8).map((s: any) => ({ label: s.name, href: `/services/${s.slug}` }))
        : DEFAULT_SERVICES;

  const quickLinks =
    dynamicQuickLinks.length > 0 || dynamicPatientInfo.length > 0
      ? [...dynamicQuickLinks, ...dynamicPatientInfo].map((q) => ({ label: q.label, href: q.url }))
      : DEFAULT_QUICK_LINKS;

  return (
    <footer className="relative bg-gradient-to-b from-[#0496AC] via-[#037A8C] to-[#025E6C] text-white font-sans overflow-hidden">
      {/* Decorative background glow circles */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-emerald-400/[0.04] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Excellence */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center transition-transform hover:scale-[1.01]">
              <Image
                src={footerLogo}
                alt="MatruKa - Complete Care for Her"
                width={220}
                height={55}
                className="h-11 w-auto object-contain"
                priority
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = '/logo-white.png';
                }}
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/90">
              {footerAbout}
            </p>

            {/* Clinical Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {badge1 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-xs border border-white/15">
                  <ShieldCheck size={13} className="text-[#F7CE6E]" />
                  <span>{badge1}</span>
                </span>
              )}
              {badge2 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-xs border border-white/15">
                  <Sparkles size={13} className="text-[#F7CE6E]" />
                  <span>{badge2}</span>
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Clinical Specialities */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7CE6E]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Clinical Specialities
              </h3>
            </div>
            <ul className="mt-5 space-y-2.5">
              {servicesList.map((svc) => (
                <li key={svc.href}>
                  <Link
                    href={svc.href}
                    className="group inline-flex items-center gap-1.5 text-sm leading-6 text-white/85 transition-all hover:text-white hover:translate-x-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/30 group-hover:bg-[#F7CE6E] transition-colors" />
                    <span>{svc.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Patient Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7CE6E]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Patient Information
              </h3>
            </div>
            <ul className="mt-5 space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm leading-6 text-white/85 transition-all hover:text-white hover:translate-x-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/30 group-hover:bg-[#F7CE6E] transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Clinic & Location */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7CE6E]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Clinic & Location
              </h3>
            </div>

            <div className="mt-5 space-y-3.5">
              {/* Address card */}
              <div className="rounded-xl bg-white/[0.08] p-3.5 backdrop-blur-xs border border-white/10 transition-colors hover:bg-white/[0.12]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <MapPin className="h-4 w-4 text-[#F7CE6E]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">Solaris Cure, VIP Road</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/80">{address}</p>
                    <a
                      href={
                        settings?.googleMapsDirectionsUrl ||
                        'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#F7CE6E] transition-colors hover:text-[#FBE0A2]"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* OPD card */}
              <div className="rounded-xl bg-white/[0.08] p-3.5 backdrop-blur-xs border border-white/10 transition-colors hover:bg-white/[0.12]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Clock className="h-4 w-4 text-[#F7CE6E]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">OPD Consultation Hours</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/80">{opdTimings}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      <p className="text-[11px] font-semibold text-[#F7CE6E]">
                        Sunday: 24*7 Emergency On-Call
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Hotline card */}
              <div className="rounded-xl bg-white/[0.08] p-3.5 backdrop-blur-xs border border-white/10 transition-colors hover:bg-white/[0.12]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F7CE6E] to-[#E5B548] text-slate-900">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Appointment &amp; Emergency Desk</p>
                    <a
                      href={`tel:${phone}`}
                      className="mt-0.5 block text-base font-bold text-white transition-colors hover:text-[#F7CE6E]"
                    >
                      +91 {phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-5 text-white/80">
            {settings?.copyrightText ||
              '© 2026 MatruKa — Complete Care for Her. All rights reserved.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/85">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  MapPin,
  Clock,
  ExternalLink,
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
      : DEFAULT_SERVICES;

  const quickLinks =
    dynamicQuickLinks.length > 0 || dynamicPatientInfo.length > 0
      ? [...dynamicQuickLinks, ...dynamicPatientInfo].map((q) => ({ label: q.label, href: q.url }))
      : DEFAULT_QUICK_LINKS;

  return (
    <footer className="bg-[#0496AC] text-white font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Excellence */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo-white.png"
                alt="MatruKa - Complete Care for Her"
                width={220}
                height={55}
                className="h-11 w-auto object-contain"
                priority
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/85">
              Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.
            </p>

            
          </div>

          {/* Column 2: Clinical Specialities */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white font-heading">
              Clinical Specialities
            </h3>
            <ul className="mt-4 space-y-2.5">
              {servicesList.map((svc) => (
                <li key={svc.href}>
                  <Link
                    href={svc.href}
                    className="block text-sm leading-6 text-white/85 transition-colors hover:text-white"
                  >
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Patient Information */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white font-heading">
              Patient Information
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block text-sm leading-6 text-white/85 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Clinic & Location */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white font-heading">
              Clinic & Location
            </h3>

            <div className="mt-4 space-y-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <MapPin className="h-4 w-4 text-[#F7CE6E]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Solaris Cure, VIP Road</p>
                  <p className="mt-1 text-sm leading-6 text-white/85">{address}</p>
                  <a
                    href={
                      settings?.googleMapsDirectionsUrl ||
                      'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#F7CE6E] transition-colors hover:text-[#FBE0A2]"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Clock className="h-4 w-4 text-[#F7CE6E]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">OPD Consultation Hours</p>
                  <p className="mt-1 text-sm leading-6 text-white/85">{opdTimings}</p>
                  <p className="mt-1 text-xs font-medium text-[#F7CE6E]">
                    Sunday: Emergency Care Only (24*7)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Phone className="h-4 w-4 text-[#F7CE6E]" />
                </div>
                <div>
                  <p className="text-sm text-white/85">Appointment & Emergency Desk</p>
                  <a
                    href={`tel:${phone}`}
                    className="mt-1 block text-lg font-bold tracking-tight text-white transition-colors hover:text-[#FBE0A2]"
                  >
                    +91 {phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-5 text-white/75">
            {settings?.copyrightText ||
              '© 2026 MatruKa — Complete Care for Her. All rights reserved.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/80">
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

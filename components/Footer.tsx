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
}

export default function Footer({ settings }: FooterProps) {
  const phone = settings?.appointmentPhone || '7984882273';
  const address =
    settings?.address ||
    '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007';
  const opdTimings =
    settings?.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)';

  const servicesList = [
    { label: 'Personalized Antenatal Care (ANC)', href: '/services/personalized-antenatal-care' },
    { label: 'Normal Delivery & Cesarean Section', href: '/services/normal-delivery-cesarean-section' },
    { label: 'Painless Vaginal Delivery (Epidural)', href: '/services/painless-vaginal-delivery' },
    { label: 'High Risk Pregnancy Management', href: '/services/high-risk-pregnancy-management' },
    { label: 'Gynec Laparoscopic Surgeries', href: '/services/gynec-laparoscopic-surgeries' },
    { label: 'Hysterectomy Surgeries (TLH/NDVH)', href: '/services/hysterectomy-surgeries' },
    { label: 'Infertility Evaluation & Treatment', href: '/services/infertility-evaluation-management' },
    { label: 'Gynec Ultrasound Diagnostics', href: '/services/gynec-ultrasound' },
  ];

  const quickLinks = [
    { label: 'About MatruKa', href: '/about' },
    { label: 'Our Doctors & Credentials', href: '/doctors' },
    { label: 'Hospital Facilities & OT', href: '/facilities' },
    { label: 'Clinic Tour & Gallery', href: '/gallery' },
    { label: 'Pregnancy Health Articles', href: '/blog' },
    { label: 'FAQs & OPD Guidelines', href: '/faqs' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ];

  return (
    <footer className="bg-[#0B2E33] text-slate-200 border-t border-teal-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-teal-800/50">
          {/* Column 1: Brand & Excellence (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-white.png"
                alt="MatruKa - Complete Care for Her"
                width={220}
                height={55}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            <p className="text-xs sm:text-sm text-teal-100/75 leading-relaxed max-w-sm">
              Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.
            </p>

            <div className="pt-2 space-y-1.5 text-xs">
              <p className="text-brand-gold-400 font-semibold tracking-wide">
                Dr. Kairavi Yagnik & Dr. Rut Shah (MS OBGYN)
              </p>
              <p className="text-teal-200/70">
                24*7 Emergency Obstetric & Gynec Care Support
              </p>
            </div>
          </div>

          {/* Column 2: Clinical Specialities (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider font-heading mb-4 text-teal-200">
              Clinical Specialities
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              {servicesList.map((svc) => (
                <li key={svc.href}>
                  <Link
                    href={svc.href}
                    className="text-teal-100/75 hover:text-white transition-colors block py-0.5"
                  >
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Patient Information (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider font-heading mb-4 text-teal-200">
              Patient Information
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-teal-100/75 hover:text-white transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Clinic & Location (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider font-heading mb-4 text-teal-200">
              Clinic & Location
            </h3>

            {/* Address */}
            <div className="flex items-start gap-2.5 text-xs sm:text-[13px]">
              <MapPin className="w-4 h-4 text-brand-gold-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Solaris Cure, VIP Road</p>
                <p className="text-xs text-teal-100/70 leading-relaxed mt-0.5">{address}</p>
                <a
                  href={
                    settings?.googleMapsDirectionsUrl ||
                    'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-gold-400 hover:text-brand-gold-300 font-medium mt-1.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* OPD Consultation Hours */}
            <div className="flex items-start gap-2.5 text-xs sm:text-[13px]">
              <Clock className="w-4 h-4 text-brand-gold-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">OPD Consultation Hours</p>
                <p className="text-xs text-teal-100/70 mt-0.5">{opdTimings}</p>
                <p className="text-[11px] text-brand-gold-400/90 mt-0.5 font-medium">
                  Sunday: Emergency Care Only (24*7)
                </p>
              </div>
            </div>

            {/* Direct Helpline */}
            <div className="flex items-start gap-2.5 text-xs sm:text-[13px]">
              <Phone className="w-4 h-4 text-brand-gold-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-teal-100/70">Appointment & Emergency Desk</p>
                <a
                  href={`tel:${phone}`}
                  className="text-sm sm:text-base font-bold text-white hover:text-brand-gold-300 transition-colors block mt-0.5"
                >
                  +91 {phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Disclaimer & Bottom Bar */}
        <div className="pt-6 space-y-4">
          <p className="max-w-4xl mx-auto text-center text-[11px] leading-relaxed text-teal-200/55">
            <strong className="text-teal-100/80 font-medium">Informational Medical Disclaimer:</strong> This website is an informational portal for MatruKa. It does not provide online consultations, medical diagnoses, appointment bookings, or financial transactions. Please consult our physicians in person for clinical evaluation.
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-teal-800/40 text-[11px] text-teal-200/60">
            <p>
              {settings?.copyrightText ||
                '© 2026 MatruKa — Complete Care for Her. All rights reserved.'}
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <span>•</span>
              <Link href="/admin/login" className="hover:text-brand-gold-400 transition-colors font-medium">
                CMS Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

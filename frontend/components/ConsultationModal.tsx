'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';

interface ConsultationModalProps {
  settings?: {
    clinicName?: string;
    tagline?: string;
    appointmentPhone?: string;
    whatsappNumber?: string;
    address?: string;
    opdTimings?: string;
  };
  services?: any[];
  doctors?: any[];
}

export default function ConsultationModal({ settings }: ConsultationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const clinicName = settings?.clinicName || 'MatruKa';
  const tagline = settings?.tagline || 'Complete Care for Her';
  const phone = settings?.appointmentPhone || '7984882273';
  const whatsappNumber =
    settings?.whatsappNumber?.replace(/\D/g, '') ||
    (phone ? (phone.startsWith('91') ? phone : `91${phone}`) : '917984882273');
  const opdTimings = settings?.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM';
  const address = settings?.address || 'Solaris Cure, VIP Road, Surat';

  // Auto-open once after 3.5 seconds on the first visit of the session
  useEffect(() => {
    const isDismissed =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('matruka_popup_dismissed')
        : null;

    let timer: NodeJS.Timeout;
    if (!isDismissed) {
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500);
    }

    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-consultation-modal', handleOpenEvent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-consultation-modal', handleOpenEvent);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('matruka_popup_dismissed', '1');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      {/* Dimmed Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Ek Dam Simple Pop-up Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto transform transition-all">
        {/* Header Bar */}
        <div className="relative bg-[#0496AC] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-white">
              {clinicName} Women’s Hospital
            </h3>
            <p className="text-xs text-white/85 mt-0.5">
              {tagline} • Surat
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer active:scale-95"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Welcome to {clinicName}. For any clinical inquiries, maternity care, or emergency help, contact our care desk directly:
          </p>

          {/* Quick Clinic Info */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#0496AC] shrink-0" />
              <span>OPD: <strong>{opdTimings}</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[#0496AC] shrink-0 mt-0.5" />
              <span className="leading-snug">{address}</span>
            </div>
          </div>

          {/* Direct 2 Action Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hello ${clinicName}, I would like to inquire regarding clinic consultation and facilities.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs hover:shadow transition"
            >
              <MessageCircle size={16} />
              <span>Connect on WhatsApp</span>
            </a>

            <a
              href={`tel:${phone}`}
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0496AC] hover:bg-[#037A8C] text-white font-bold text-xs shadow-xs hover:shadow transition"
            >
              <Phone size={15} />
              <span>Call Helpline: +91 {phone}</span>
            </a>
          </div>

          {/* Close / Skip link */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-700 font-medium transition cursor-pointer"
            >
              Continue to website →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

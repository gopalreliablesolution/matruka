'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import SafeImage from '@/components/SafeImage';

export interface PopupSettings {
  isActive?: boolean;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  description?: string;
  showDescription?: boolean;
  imageUrl?: string;
  showImage?: boolean;
  showInfo?: boolean;
  showOpd?: boolean;
  opdText?: string;
  showAddress?: boolean;
  addressText?: string;
  showWhatsapp?: boolean;
  whatsappText?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  showCall?: boolean;
  callText?: string;
  callNumber?: string;
  showDismiss?: boolean;
  dismissText?: string;
  delaySeconds?: number;
  showOncePerSession?: boolean;
}

interface ConsultationModalProps {
  settings?: {
    clinicName?: string;
    tagline?: string;
    appointmentPhone?: string;
    whatsappNumber?: string;
    address?: string;
    opdTimings?: string;
    popup?: PopupSettings;
  };
  services?: any[];
  doctors?: any[];
}

export default function ConsultationModal({ settings }: ConsultationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const popup = settings?.popup;

  // Master switch: is popup enabled? (default true if undefined)
  const isPopupActive = popup?.isActive !== undefined ? popup.isActive : true;

  // Header
  const showHeader = popup?.showHeader !== undefined ? popup.showHeader : true;
  const clinicName = settings?.clinicName || 'MatruKa';
  const tagline = settings?.tagline || 'Complete Care for Her';
  const title = popup?.title || `${clinicName} Women’s Hospital`;
  const subtitle = popup?.subtitle || `${tagline} • Surat`;

  // Image / Banner
  const showImage = Boolean(popup?.showImage && popup?.imageUrl);
  const imageUrl = popup?.imageUrl ? resolveImageUrl(popup.imageUrl) : '';

  // Description
  const showDescription = popup?.showDescription !== undefined ? popup.showDescription : true;
  const description =
    popup?.description ||
    `Welcome to ${clinicName}. For any clinical inquiries, maternity care, or emergency help, contact our care desk directly:`;

  // Quick Info (OPD & Address)
  const showInfo = popup?.showInfo !== undefined ? popup.showInfo : true;
  const showOpd = popup?.showOpd !== undefined ? popup.showOpd : true;
  const opdTimings = popup?.opdText || settings?.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM';
  const showAddress = popup?.showAddress !== undefined ? popup.showAddress : true;
  const address = popup?.addressText || settings?.address || 'Solaris Cure, VIP Road, Surat';

  // Action Buttons
  const showWhatsapp = popup?.showWhatsapp !== undefined ? popup.showWhatsapp : true;
  const whatsappLabel = popup?.whatsappText || 'Connect on WhatsApp';
  const rawWhatsapp =
    popup?.whatsappNumber?.replace(/\D/g, '') ||
    settings?.whatsappNumber?.replace(/\D/g, '') ||
    (settings?.appointmentPhone
      ? settings.appointmentPhone.startsWith('91')
        ? settings.appointmentPhone
        : `91${settings.appointmentPhone}`
      : '917984882273');
  const whatsappNumber = rawWhatsapp.startsWith('91') ? rawWhatsapp : `91${rawWhatsapp}`;
  const whatsappMessage =
    popup?.whatsappMessage ||
    `Hello ${clinicName}, I would like to inquire regarding clinic consultation and facilities.`;

  const showCall = popup?.showCall !== undefined ? popup.showCall : true;
  const callLabel = popup?.callText || 'Call Helpline';
  const callPhone = popup?.callNumber || settings?.appointmentPhone || '7984882273';

  // Dismiss / Delay
  const showDismiss = popup?.showDismiss !== undefined ? popup.showDismiss : true;
  const dismissText = popup?.dismissText || 'Continue to website →';
  const delaySeconds = typeof popup?.delaySeconds === 'number' ? popup.delaySeconds : 3.5;
  const showOncePerSession = popup?.showOncePerSession !== undefined ? popup.showOncePerSession : true;

  const hasHeaderContent = showHeader && (Boolean(title) || Boolean(subtitle));
  const hasImageContent = Boolean(showImage && imageUrl);
  const hasInfoContent = showInfo && ((showOpd && Boolean(opdTimings)) || (showAddress && Boolean(address)));
  const hasButtons = showWhatsapp || showCall;
  const hasBodyContent =
    (showDescription && Boolean(description)) ||
    hasInfoContent ||
    hasButtons ||
    showDismiss;
  const hasAnyVisibleContent = hasHeaderContent || hasImageContent || hasBodyContent;
  const isImageOnly = Boolean(hasImageContent && !hasHeaderContent && !hasBodyContent);

  // Auto-open logic
  useEffect(() => {
    // If popup is disabled in admin settings or has nothing visible, never open
    if (!isPopupActive || !hasAnyVisibleContent) {
      setIsOpen(false);
      return;
    }

    const isDismissed =
      typeof window !== 'undefined' && showOncePerSession
        ? sessionStorage.getItem('matruka_popup_dismissed')
        : null;

    let timer: NodeJS.Timeout;
    if (!isDismissed) {
      timer = setTimeout(() => {
        setIsOpen(true);
      }, Math.max(0, delaySeconds * 1000));
    }

    const handleOpenEvent = () => {
      // Manual trigger only opens if popup is active and has visible content
      if (isPopupActive && hasAnyVisibleContent) {
        setIsOpen(true);
      }
    };
    window.addEventListener('open-consultation-modal', handleOpenEvent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-consultation-modal', handleOpenEvent);
    };
  }, [isPopupActive, hasAnyVisibleContent, delaySeconds, showOncePerSession]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined' && showOncePerSession) {
      sessionStorage.setItem('matruka_popup_dismissed', '1');
    }
  };

  // If popup is not open, disabled, or has no visible content at all
  if (!isOpen || !isPopupActive || !hasAnyVisibleContent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      {/* Dimmed Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Dynamic Pop-up Card */}
      <div
        className={`relative z-10 w-full ${
          isImageOnly ? 'max-w-lg sm:max-w-2xl bg-transparent' : 'max-w-sm bg-white'
        } rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto transform transition-all`}
      >
        {/* Optional Banner Image */}
        {showImage && imageUrl && (
          <div className={`relative w-full overflow-hidden ${isImageOnly ? 'bg-transparent' : 'bg-slate-50'}`}>
            <SafeImage
              src={imageUrl}
              alt={title}
              fallbackSrc="/logo.png"
              className={
                isImageOnly
                  ? 'w-full h-auto max-h-[85vh] object-contain block'
                  : 'w-full h-auto max-h-72 object-contain bg-slate-50 block'
              }
              fallbackClassName="w-full h-48 object-contain p-6 bg-slate-50 block"
            />
            {!showHeader && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white flex items-center justify-center transition cursor-pointer active:scale-95 shadow-md"
              >
                <X size={17} />
              </button>
            )}
          </div>
        )}

        {/* Header Bar */}
        {showHeader && (
          <div className="relative bg-[#0496AC] text-white px-5 py-4 flex items-center justify-between">
            <div className="pr-3">
              {title && (
                <h3 className="text-base sm:text-lg font-bold font-heading text-white leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-white/85 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer active:scale-95 shrink-0"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Floating Close Button if no Header and no Image */}
        {!showHeader && !showImage && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
          >
            <X size={17} />
          </button>
        )}

        {/* Body Content */}
        {hasBodyContent && (
          <div className="p-5 space-y-4">
            {showDescription && description && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {description}
              </p>
            )}

            {/* Quick Clinic Info Box */}
            {showInfo && (showOpd || showAddress) && (
              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                {showOpd && opdTimings && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#0496AC] shrink-0" />
                    <span>OPD: <strong>{opdTimings}</strong></span>
                  </div>
                )}
                {showAddress && address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#0496AC] shrink-0 mt-0.5" />
                    <span className="leading-snug">{address}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {(showWhatsapp || showCall) && (
              <div className="space-y-2 pt-1">
                {showWhatsapp && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs hover:shadow transition"
                  >
                    <MessageCircle size={16} />
                    <span>{whatsappLabel}</span>
                  </a>
                )}

                {showCall && (
                  <a
                    href={`tel:${callPhone}`}
                    onClick={handleClose}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0496AC] hover:bg-[#037A8C] text-white font-bold text-xs shadow-xs hover:shadow transition"
                  >
                    <Phone size={15} />
                    <span>{callLabel}: +91 {callPhone}</span>
                  </a>
                )}
              </div>
            )}

            {/* Close / Skip link */}
            {showDismiss && (
              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs text-slate-400 hover:text-slate-700 font-medium transition cursor-pointer"
                >
                  {dismissText}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

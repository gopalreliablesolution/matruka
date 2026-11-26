'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, Loader2, MapPin, Clock, User, Send, MessageSquare } from 'lucide-react';
import { publicApi } from '@/lib/api';

export function buildPinnedMapEmbedUrl(address?: string): string {
  const raw = (address || 'Solaris Cure, VIP Road, Vesu, Surat, Gujarat 395007').trim();
  const cleaned = raw
    .replace(/^\d+[-–]\d+\s*,\s*/i, '')
    .replace(/beside[s]?\s+[^,]+,\s*/i, '')
    .trim();
  // "Solaris Cure, VIP Road, Vesu, Surat" resolves cleanly as a pinned place in Google Maps
  const finalQuery =
    cleaned.toLowerCase().includes('solaris cure') && !cleaned.toLowerCase().includes('vesu')
      ? cleaned.replace(/vip road/i, 'VIP Road, Vesu')
      : cleaned || raw;
  return `https://maps.google.com/maps?q=${encodeURIComponent(finalQuery)}&t=k&z=17&ie=UTF8&output=embed`;
}

export function sanitizeMapEmbedUrl(raw?: string, addressFallback?: string): string {
  const pinnedFallback = buildPinnedMapEmbedUrl(addressFallback);
  if (!raw) return pinnedFallback;
  const str = raw.trim();

  // Only replace empty or leftover Jogi URLs; otherwise respect the exact URL saved in Admin
  if (str.includes('<iframe') || str.includes('src=')) {
    const match = str.match(/src=["']([^"']+)["']/i);
    if (match && match[1] && (match[1].startsWith('http://') || match[1].startsWith('https://'))) {
      if (match[1].toLowerCase().includes('jogi')) {
        return pinnedFallback;
      }
      return match[1];
    }
  }

  if (str.startsWith('https://') || str.startsWith('http://')) {
    if (str.toLowerCase().includes('jogi')) {
      return pinnedFallback;
    }
    return str;
  }

  return pinnedFallback;
}

export interface HospitalLocationData {
  _id?: string;
  sectionTitle?: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone: string;
  email: string;
  days: string;
  hours: string;
  mapEmbedUrl?: string;
  isActive?: boolean;
}

interface HospitalLocationSectionProps {
  initialLocations?: HospitalLocationData[];
  newsletterBadge?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterBtnText?: string;
}

export default function HospitalLocationSection({
  initialLocations,
  newsletterBadge = 'CLINIC INQUIRY',
  newsletterTitle = 'Quick Clinic Inquiry',
  newsletterSubtitle = 'Have a question about pregnancy care, OPD timings, or treatments? Send us an inquiry and our team will reach out.',
  newsletterBtnText = 'Submit Inquiry',
}: HospitalLocationSectionProps) {
  const [locations, setLocations] = useState<HospitalLocationData[]>(
    initialLocations || []
  );
  const [locationsLoading, setLocationsLoading] = useState(!initialLocations || initialLocations.length === 0);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    contact: '',
    email: '',
    description: '',
  });
  const [inquiryStatus, setInquiryStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [inquiryMessage, setInquiryMessage] = useState('');

  useEffect(() => {
    if (initialLocations && initialLocations.length > 0) {
      setLocations(initialLocations);
      setLocationsLoading(false);
    } else {
      fetchLocations();
    }
  }, [initialLocations]);

  const fetchLocations = async () => {
    try {
      setLocationsLoading(true);
      const res = await publicApi.get('/hospital-locations');
      if (res.data?.success && res.data.data) {
        setLocations(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch hospital locations:', error);
    } finally {
      setLocationsLoading(false);
    }
  };

  // Auto-hide success message after 6 seconds
  useEffect(() => {
    if (inquiryStatus === 'success') {
      const timer = setTimeout(() => {
        setInquiryStatus('idle');
        setInquiryMessage('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [inquiryStatus]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = inquiryData.name.trim();
    const cleanPhone = inquiryData.contact.replace(/\D/g, '');
    const cleanEmail = inquiryData.email.trim();
    const cleanDesc = inquiryData.description.trim();

    if (!cleanName || cleanName.length < 2) {
      setInquiryMessage('Please enter your full name.');
      setInquiryStatus('error');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setInquiryMessage('Please enter a valid 10-digit mobile number.');
      setInquiryStatus('error');
      return;
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setInquiryMessage('Please enter a valid email address.');
      setInquiryStatus('error');
      return;
    }

    setInquiryStatus('loading');
    setInquiryMessage('');
    try {
      await publicApi.post('/appointments', {
        patientName: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        message: cleanDesc,
        department: 'Website Inquiry',
        doctor: 'Any Available Specialist',
        city: 'Surat',
      });

      setInquiryStatus('success');
      setInquiryMessage('Thank you! Your inquiry has been received. Our care desk will contact you shortly.');
      setInquiryData({ name: '', contact: '', email: '', description: '' });
    } catch (error: any) {
      setInquiryStatus('error');
      setInquiryMessage(
        error.response?.data?.error || 'Something went wrong. Please try again.'
      );
    }
  };

  const activeLocation = locations[0] || {
    sectionTitle: 'Visit Our Clinic',
    name: 'MatruKa — Complete Care for Her',
    address: '303-306, Solaris Cure, Beside Ratnajyoti Apartment, VIP Road',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395007',
    days: 'Monday to Saturday',
    hours: '10:00 AM to 1:00 PM | 5:00 PM to 7:00 PM (Sunday: 24*7 Emergency)',
    phone: '7984882273',
    email: 'info@matruka.in',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.1557991965564!2d72.7797779759714!3d21.146200283737225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be05307bdfbcdd7%3A0xe54e1f7481ba2aa6!2sSolaris%20Cure!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin',
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white border-t border-slate-100 font-sans relative overflow-hidden">
      <div className="w-full max-w-[82.5rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* UPPER SECTION: Locations list */}
        <div className="mb-8 md:mb-12 bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_30px_rgba(4,150,172,0.06)] overflow-hidden">
          <div className="flex flex-col">
            <div className="flex-1 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#0496AC]/10 text-[#0496AC] border border-[#0496AC]/20 mb-2">
                    <MapPin size={12} />
                    <span>CLINIC HEADQUARTERS</span>
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-[#1A2C30]">
                    {activeLocation.sectionTitle || 'Visit Our Clinic'}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>OPD Consultations Open Today</span>
                </div>
              </div>

              {locationsLoading && locations.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#0496AC]" size={28} />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {locations.map((loc, i) => (
                    <div key={loc._id || i} className="py-6 first:pt-6 last:pb-0">
                      {/* Clinic name */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="text-xl md:text-2xl font-bold font-heading text-[#0496AC]">
                          {loc.name}
                        </h3>
                        <span className="self-start md:self-auto inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          Surat, Gujarat
                        </span>
                      </div>

                      {/* Address */}
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                        {loc.address}
                        {loc.city && loc.state && `, ${loc.city}, ${loc.state}${loc.pincode ? ` - ${loc.pincode}` : ''}`}
                      </p>

                      {/* Days + Hours row */}
                      <div className="rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#0496AC] shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-[#1A2C30]">
                            {loc.days}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-600 sm:text-right">
                          {loc.hours}
                        </span>
                      </div>

                      {/* Phone + Email */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {loc.phone && (
                          <a
                            href={`tel:${loc.phone}`}
                            className="inline-flex items-center gap-2.5 rounded-xl bg-[#0496AC]/10 px-4 py-2 text-[#0496AC] font-bold transition-all hover:bg-[#0496AC] hover:text-white"
                          >
                            <Phone size={14} />
                            <span>+91 {loc.phone}</span>
                          </a>
                        )}
                        {loc.email && (
                          <a
                            href={`mailto:${loc.email}`}
                            className="inline-flex items-center gap-2.5 rounded-xl bg-slate-100 px-4 py-2 text-slate-700 font-semibold transition-all hover:bg-slate-200"
                          >
                            <Mail size={14} />
                            <span>{loc.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Map + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Column */}
          <div className="lg:col-span-7 relative bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_30px_rgba(4,150,172,0.06)] overflow-hidden min-h-[380px]">
            {activeLocation ? (
              <iframe
                src={sanitizeMapEmbedUrl(
                  activeLocation.mapEmbedUrl,
                  [activeLocation.address, activeLocation.city, activeLocation.state, activeLocation.pincode]
                    .filter(Boolean)
                    .join(', ')
                )}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${activeLocation.name || 'Clinic'} Location Map`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 min-h-[380px] p-6 text-center">
                <MapPin size={36} className="text-slate-300 mb-2" />
                <p className="text-sm font-medium">Map location not available</p>
              </div>
            )}
          </div>

          {/* Inquiry Form Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl border border-slate-200/90 shadow-[0_4px_30px_rgba(4,150,172,0.06)] p-6 sm:p-8 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#0496AC]/10 text-[#0496AC] border border-[#0496AC]/20 mb-3 self-start">
              <MessageSquare size={12} />
              <span>{newsletterBadge}</span>
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-heading text-[#1A2C30] mb-1.5">
              {newsletterTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              {newsletterSubtitle}
            </p>

            {inquiryStatus === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center animate-in fade-in duration-200">
                <p className="text-emerald-700 font-bold text-sm">{inquiryMessage}</p>
                <p className="text-emerald-600/80 text-xs mt-1">We respect your privacy and will reach out soon.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    value={inquiryData.name}
                    onChange={(e) =>
                      setInquiryData({ ...inquiryData, name: e.target.value })
                    }
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/20 outline-none text-slate-800 placeholder:text-slate-400 bg-white text-sm font-medium transition"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="Contact Number (10 digits) *"
                    value={inquiryData.contact}
                    onChange={(e) =>
                      setInquiryData({ ...inquiryData, contact: e.target.value })
                    }
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/20 outline-none text-slate-800 placeholder:text-slate-400 bg-white text-sm font-medium transition"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={inquiryData.email}
                    onChange={(e) =>
                      setInquiryData({ ...inquiryData, email: e.target.value })
                    }
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/20 outline-none text-slate-800 placeholder:text-slate-400 bg-white text-sm font-medium transition"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="Description / Your Inquiry..."
                    value={inquiryData.description}
                    onChange={(e) =>
                      setInquiryData({ ...inquiryData, description: e.target.value })
                    }
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/20 outline-none text-slate-800 placeholder:text-slate-400 bg-white text-sm font-medium transition resize-none"
                  />
                </div>
                {inquiryMessage && (
                  <p className="text-rose-500 text-xs font-semibold">{inquiryMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={inquiryStatus === 'loading'}
                  className="w-full h-11 bg-gradient-to-r from-[#0496AC] to-[#037A8C] hover:from-[#037A8C] hover:to-[#025E6C] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_4px_14px_rgba(4,150,172,0.3)] hover:shadow-[0_6px_20px_rgba(4,150,172,0.4)] active:scale-[0.99] cursor-pointer"
                >
                  {inquiryStatus === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" size={17} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>{newsletterBtnText}</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

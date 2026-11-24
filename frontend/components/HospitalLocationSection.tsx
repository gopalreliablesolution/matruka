'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, Loader2, MapPin, Clock, User, Sparkles, Send } from 'lucide-react';
import { publicApi } from '@/lib/api';

const DEFAULT_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.1557991965564!2d72.7797779759714!3d21.146200283737225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be05307bdfbcdd7%3A0xe54e1f7481ba2aa6!2sSolaris%20Cure!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin';

export function sanitizeMapEmbedUrl(raw?: string): string {
  if (!raw) return DEFAULT_MAP_EMBED_URL;
  const str = raw.trim();

  // If a full <iframe ... src="..." ...> HTML snippet was entered
  if (str.includes('<iframe') || str.includes('src=')) {
    const match = str.match(/src=["']([^"']+)["']/i);
    if (match && match[1] && (match[1].startsWith('http://') || match[1].startsWith('https://'))) {
      if (match[1].toLowerCase().includes('jogi')) {
        return DEFAULT_MAP_EMBED_URL;
      }
      return match[1];
    }
  }

  // If it's a valid web URL
  if (str.startsWith('https://') || str.startsWith('http://')) {
    if (str.toLowerCase().includes('jogi')) {
      return DEFAULT_MAP_EMBED_URL;
    }
    return str;
  }

  return DEFAULT_MAP_EMBED_URL;
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
  newsletterBadge = 'MATRUKA HEALTH BULLETIN',
  newsletterTitle = 'Subscribe to Health Updates',
  newsletterSubtitle = 'Receive verified gynaecology advice, trimester wellness tips, and clinic updates directly in your inbox.',
  newsletterBtnText = 'Join Our Newsletter',
}: HospitalLocationSectionProps) {
  const [locations, setLocations] = useState<HospitalLocationData[]>(
    initialLocations || []
  );
  const [locationsLoading, setLocationsLoading] = useState(!initialLocations || initialLocations.length === 0);
  const [newsletterData, setNewsletterData] = useState({ name: '', email: '' });
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    if (!initialLocations || initialLocations.length === 0) {
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
    if (newsletterStatus === 'success') {
      const timer = setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [newsletterStatus]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterData.name || !newsletterData.email) {
      setNewsletterMessage('Please fill in all fields.');
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('loading');
    setNewsletterMessage('');
    try {
      await publicApi.post('/newsletter', {
        name: newsletterData.name,
        email: newsletterData.email,
        sourcePath: '/hospital-location',
      });

      setNewsletterStatus('success');
      setNewsletterMessage('Thank you for subscribing to our updates!');
      setNewsletterData({ name: '', email: '' });
    } catch (error: any) {
      setNewsletterStatus('error');
      setNewsletterMessage(
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
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_30px_rgba(4,150,172,0.06)] overflow-hidden min-h-[380px]">
            {activeLocation ? (
              <iframe
                src={sanitizeMapEmbedUrl(activeLocation.mapEmbedUrl)}
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

          {/* Newsletter Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl border border-slate-200/90 shadow-[0_4px_30px_rgba(4,150,172,0.06)] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#0496AC]/10 text-[#0496AC] border border-[#0496AC]/20 mb-3 self-start">
              <Sparkles size={12} />
              <span>{newsletterBadge}</span>
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-heading text-[#1A2C30] mb-2">
              {newsletterTitle}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {newsletterSubtitle}
            </p>

            {newsletterStatus === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center animate-in fade-in duration-200">
                <p className="text-emerald-700 font-bold text-sm">{newsletterMessage}</p>
                <p className="text-emerald-600/80 text-xs mt-1">We respect your privacy and never spam.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3.5">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={newsletterData.name}
                    onChange={(e) =>
                      setNewsletterData({ ...newsletterData, name: e.target.value })
                    }
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/20 outline-none text-slate-800 placeholder:text-slate-400 bg-white text-sm font-medium transition"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    value={newsletterData.email}
                    onChange={(e) =>
                      setNewsletterData({ ...newsletterData, email: e.target.value })
                    }
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/20 outline-none text-slate-800 placeholder:text-slate-400 bg-white text-sm font-medium transition"
                    required
                  />
                </div>
                {newsletterMessage && (
                  <p className="text-rose-500 text-xs font-semibold">{newsletterMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="w-full h-12 bg-gradient-to-r from-[#0496AC] to-[#037A8C] hover:from-[#037A8C] hover:to-[#025E6C] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-[0_4px_14px_rgba(4,150,172,0.3)] hover:shadow-[0_6px_20px_rgba(4,150,172,0.4)] active:scale-[0.99] cursor-pointer"
                >
                  {newsletterStatus === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" size={17} />
                      <span>Subscribing...</span>
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

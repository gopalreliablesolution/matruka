'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, Loader2, MapPin } from 'lucide-react';
import { publicApi } from '@/lib/api';

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
}

export default function HospitalLocationSection({
  initialLocations,
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
    <section className="w-full py-6 sm:py-8 lg:py-10 bg-white border-t border-slate-100 font-sans">
      <div className="w-full max-w-[82.5rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* UPPER SECTION: Locations list */}
        <div className="mb-6 md:mb-8 bg-white rounded-[1.25rem] border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col">
            <div className="flex-1 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3">
                {/* <span className="w-2 h-2 rounded-full bg-primary" /> */}
                <h2 className="text-xl md:text-2xl font-bold font-heading text-gray-900">
                  {activeLocation.sectionTitle || 'Visit Our Clinic'}
                </h2>
              </div>

              {locationsLoading && locations.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {locations.map((loc, i) => (
                    <div key={loc._id || i} className="py-4 first:pt-1 last:pb-0">
                      {/* Clinic name */}
                      <h3 className="text-lg md:text-xl font-bold font-heading text-primary mb-1.5">
                        {loc.name}
                      </h3>

                      {/* Address */}
                      <p className="text-sm md:text-[0.9375rem] text-gray-600 leading-relaxed mb-3">
                        {loc.address}
                        {loc.city && loc.state && `, ${loc.city}, ${loc.state}${loc.pincode ? ` - ${loc.pincode}` : ''}`}
                      </p>

                      {/* Days + Hours row */}
                      <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-1 mb-3 pt-1 border-t border-gray-100">
                        <span className="text-sm font-semibold text-primary">
                          ({loc.days})
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {loc.hours}
                        </span>
                      </div>

                      {/* Phone + Email */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-gray-700">
                        {loc.phone && (
                          <a
                            href={`tel:${loc.phone}`}
                            className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                          >
                            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Phone size={14} />
                            </span>
                            <span className="font-semibold">+91 {loc.phone}</span>
                          </a>
                        )}
                        {loc.email && (
                          <a
                            href={`mailto:${loc.email}`}
                            className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                          >
                            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Mail size={14} />
                            </span>
                            <span className="font-medium">{loc.email}</span>
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
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Map Column */}
          <div className="w-full lg:w-1/2 bg-white rounded-[1.25rem] border border-gray-200 shadow-sm overflow-hidden min-h-[350px]">
            {activeLocation.mapEmbedUrl ? (
              <iframe
                src={activeLocation.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '350px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${activeLocation.name} Location Map`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 min-h-[350px] p-6 text-center">
                <MapPin size={32} className="text-gray-300 mb-2" />
                <p className="text-sm font-medium">Map location not available</p>
              </div>
            )}
          </div>

          {/* Newsletter Column */}
          <div className="w-full lg:w-1/2 bg-white rounded-[1.25rem] border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold font-heading text-gray-900 mb-2 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={18} />
              </span>
              <span>Subscribe to Newsletter</span>
            </h3>
            <p className="text-gray-600 text-sm md:text-[0.9375rem] mb-6">
              Get health tips and updates delivered to your inbox.
            </p>

            {newsletterStatus === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center animate-in fade-in duration-200">
                <p className="text-emerald-700 font-bold text-sm">{newsletterMessage}</p>
                <p className="text-emerald-600/80 text-xs mt-1">We respect your privacy and never spam.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newsletterData.name}
                  onChange={(e) =>
                    setNewsletterData({ ...newsletterData, name: e.target.value })
                  }
                  className="w-full h-[3.125rem] px-5 rounded-[0.625rem] border border-[#D6D6D6] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 placeholder:text-gray-400 bg-white text-sm md:text-base font-medium transition"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={newsletterData.email}
                  onChange={(e) =>
                    setNewsletterData({ ...newsletterData, email: e.target.value })
                  }
                  className="w-full h-[3.125rem] px-5 rounded-[0.625rem] border border-[#D6D6D6] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 placeholder:text-gray-400 bg-white text-sm md:text-base font-medium transition"
                  required
                />
                {newsletterMessage && (
                  <p className="text-red-500 text-xs font-semibold">{newsletterMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="w-full h-[3.125rem] bg-primary hover:bg-primary-dark text-white font-bold text-sm md:text-base rounded-[0.625rem] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                >
                  {newsletterStatus === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
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

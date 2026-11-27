import React from 'react';
import { Phone, MapPin, Clock, Mail, ShieldAlert, ExternalLink, MessageCircle } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';
import { sanitizeMapEmbedUrl } from '@/lib/mapUrl';

async function getContactSettings() {
  const defaults = {
    appointmentPhone: '7984882273',
    emergencyPhone: '7984882273',
    whatsappNumber: '917984882273',
    email: 'Info.matruka@gmail.com',
    address: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
    opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
    sundayTimings: 'Emergency Only (24*7)',
  };

  try {
    const [settingsRes, locRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/public/settings`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/hospital-locations`, { cache: 'no-store' }).catch(() => null),
    ]);

    const settingsJson = settingsRes.ok ? await settingsRes.json() : null;
    const locJson = locRes && locRes.ok ? await locRes.json() : null;
    const baseSettings = settingsJson?.data || defaults;
    const activeLoc = Array.isArray(locJson?.data) && locJson.data.length > 0 ? locJson.data[0] : null;

    if (activeLoc) {
      const fullAddress = [activeLoc.address, activeLoc.city, activeLoc.state, activeLoc.pincode]
        .filter(Boolean)
        .join(', ');
      return {
        ...baseSettings,
        address: fullAddress || baseSettings.address,
        googleMapsEmbedUrl: activeLoc.mapEmbedUrl || baseSettings.googleMapsEmbedUrl,
        appointmentPhone: activeLoc.phone || baseSettings.appointmentPhone,
        email: activeLoc.email || baseSettings.email,
        opdTimings: activeLoc.hours
          ? `${activeLoc.hours}${activeLoc.days ? ` (${activeLoc.days})` : ''}`
          : baseSettings.opdTimings,
      };
    }

    return baseSettings;
  } catch (e) {
    console.error(e);
  }
  return defaults;
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  const phone = settings.appointmentPhone || '7984882273';
  const address =
    settings.address ||
    '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007';
  const opdTimings =
    settings.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)';

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Location & Inquiries
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-brand-slate-900 leading-tight">
          Contact Matruka Clinic
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Visit Dr. Kairavi Yagnik and Dr. Rut Shah at Solaris Cure, VIP Road Surat. We are here to guide your maternity and gynaecological health with warmth and clinical expertise.
        </p>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Phone & OPD Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-brand-slate-900 font-heading">
                Clinic Contact Information
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5 p-4 bg-brand-teal-50/70 rounded-2xl border border-brand-teal-100">
                  <Phone className="w-5 h-5 text-brand-teal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-slate-900">Telephone / Helpline:</p>
                    <a
                      href={`tel:${phone}`}
                      className="text-lg font-bold text-brand-teal-700 hover:text-brand-teal-800"
                    >
                      {phone}
                    </a>
                    <p className="text-xs text-slate-500 mt-0.5">Click to call directly from your phone</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-slate-900">WhatsApp Inquiries:</p>
                    <a
                      href={`https://wa.me/91${phone}?text=Hello%20Matruka%2C%20I%20would%20like%20information%20regarding%20OPD%20timings.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      +91 {phone} (Chat on WhatsApp)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <Clock className="w-5 h-5 text-brand-gold-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-slate-900">OPD Consultation Hours:</p>
                    <p className="text-slate-600 mt-0.5">{opdTimings}</p>
                    <p className="text-xs text-amber-700 font-semibold mt-1">
                      Sunday: Emergency Only (24*7)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brand-slate-900">Hospital Address:</p>
                    <p className="text-slate-600 leading-relaxed mt-0.5">{address}</p>
                    <p className="text-xs text-slate-400 mt-1">Landmark: Beside Ratnajyoti Apartment</p>
                  </div>
                </div>
              </div>

              {/* Call Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Reception</span>
                </a>
                <a
                  href={
                    settings.googleMapsDirectionsUrl ||
                    'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-brand-slate-800 font-semibold py-3 px-4 rounded-xl transition text-sm"
                >
                  <MapPin className="w-4 h-4 text-brand-teal-600" />
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* Online Booking Notice */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Appointment & Privacy Notice</span>
              </p>
              <p className="text-xs leading-relaxed text-amber-800">
                You can submit a basic appointment request online for consultation scheduling. Please avoid sharing sensitive medical records or emergency details in the form. For urgent concerns, call the clinic directly.
              </p>
              <a
                href="/book-appointment"
                className="inline-flex items-center justify-center rounded-lg bg-brand-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-teal-700 transition"
              >
                Book Appointment Online
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Location */}
          <div className="lg:col-span-7">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                <div>
                  <h3 className="font-bold text-brand-slate-900 font-heading text-base">
                    Interactive Map & Location
                  </h3>
                  <p className="text-xs text-slate-500">Solaris Cure, VIP Road, Surat - 395007</p>
                </div>
                <a
                  href={
                    settings.googleMapsDirectionsUrl ||
                    'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal-700 hover:text-brand-teal-800 whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden h-[320px] sm:h-[450px]">
                <iframe
                  src={sanitizeMapEmbedUrl(settings.googleMapsEmbedUrl, settings.address)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Matruka Location on Google Maps"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



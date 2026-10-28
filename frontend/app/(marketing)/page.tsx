import React from 'react';
import Link from 'next/link';
import {
  Phone,
  PhoneCall,
  MessageSquare,
  Clock,
  MapPin,
  Heart,
  Shield,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Building2,
  BookOpen,
  HelpCircle,
  Star,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageSquareQuote,
} from 'lucide-react';

async function getHomeData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/public/home-data`, {
    next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.error('Failed to fetch home data:', err);
  }
  return null;
}

export default async function HomePage() {
  const data = await getHomeData();

  const settings = data?.settings || {};
  const sections = data?.sections || [];
  const banners = data?.banners || [];
  const featuredDoctors = data?.featuredDoctors || [];
  const featuredServices = data?.featuredServices || [];
  const facilities = data?.facilities || [];
  const testimonials = data?.testimonials || [];
  const recentBlogs = data?.recentBlogs || [];
  const faqs = data?.faqs || [];

  const phone = settings.appointmentPhone || '7984882273';
  const opdTimings = settings.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)';

  const isSectionEnabled = (key: string) => {
    if (!sections.length) return true;
    const sec = sections.find((s: any) => s.sectionKey === key);
    return sec ? sec.isEnabled : true;
  };

  const getSectionTitle = (key: string, defaultTitle: string) => {
    const sec = sections.find((s: any) => s.sectionKey === key);
    return sec?.title || defaultTitle;
  };

  const getSectionSubtitle = (key: string, defaultSub: string) => {
    const sec = sections.find((s: any) => s.sectionKey === key);
    return sec?.subtitle || defaultSub;
  };

  const activeBanner = banners[0] || {
    title: 'Nurturing Motherhood With Expertise & Love',
    subtitle:
      'Comprehensive maternity, high-risk pregnancy, and advanced gynaecological laparoscopic care led by Dr. Kairavi Yagnik & Dr. Rut Shah in Surat.',
    badgeText: 'Complete Care for Her',
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section - Sleek, Balanced Abya Doula Inspired Layout */}
      {isSectionEnabled('hero_slider') && (
        <section className="relative bg-white overflow-hidden py-6 sm:py-8 lg:py-10 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
                <div className="inline-block">
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-teal-700 font-sans">
                    {activeBanner.badgeText || 'MATRUKA — COMPLETE CARE FOR HER'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-[2.65rem] font-bold font-heading text-brand-slate-900 leading-[1.18] tracking-tight">
                  {activeBanner.title || 'Nurturing Motherhood With Clinical Precision & Love'}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans">
                  {activeBanner.subtitle ||
                    'Comprehensive maternity, personalized antenatal care, painless delivery, and advanced gynaecological laparoscopy led by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road, Surat.'}
                </p>

                {/* Proper Sleek Rounded Buttons (No Clumsy Oversized Pills) */}
                <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <a
                    href="tel:7984882273"
                    className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-xs hover:shadow-sm transition-all text-sm font-sans"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Clinic: 7984882273</span>
                  </a>
                  <a
                    href="https://wa.me/917984882273?text=Hello%20MatruKa%20Team%2C%20I%20would%20like%20information%20about%20your%20maternity%20and%20gynaecology%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 font-medium px-4 py-2.5 rounded-lg border border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-sm font-sans"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Hero Image - Free-standing Cutout with Organic Peach Curve */}
              <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-md lg:max-w-none flex justify-center items-center">
                  {/* Organic warm peach backdrop curve shape */}
                  <div
                    className="absolute -bottom-4 -left-6 sm:-left-2 lg:-left-4 w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-[#FCEAE6] -z-10 pointer-events-none transform translate-y-4"
                    aria-hidden="true"
                  />

                  {/* Free-standing Transparent Cutout - Proportional & Clean */}
                  <img
                    src="/images/hero/maternity-cutout.png"
                    alt="Mother tenderly embracing newborn infant - MatruKa Maternity & Gynaecology Care Surat"
                    className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px] h-auto object-contain select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_86%,transparent_100%)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Emergency & Timings Ribbon */}
      {isSectionEnabled('emergency_ribbon') && (
        <section className="bg-brand-teal-600 text-white py-4 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-brand-gold-500 text-brand-slate-900 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider text-xs">
                Emergency 24x7
              </span>
              <span className="font-medium">
                Round-the-clock emergency support for obstetric labour & acute gynaecology:
              </span>
              <a
                href={`tel:${phone}`}
                className="font-bold underline hover:text-brand-gold-300 text-sm"
              >
                {phone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-brand-teal-100">
              <Clock className="w-4 h-4 text-brand-gold-300" />
              <span>OPD Consultation: 10 AM - 1 PM & 5 PM - 7 PM</span>
            </div>
          </div>
        </section>
      )}

      {/* 3. About Matruka Overview */}
      {isSectionEnabled('about_clinic') && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
                    About Matruka
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold font-heading text-brand-slate-900 mt-2">
                    {getSectionTitle('about_clinic', 'Complete Healthcare for Every Stage of Womanhood')}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Matruka — Complete Care for Her is an empathetic, specialized women’s healthcare clinic located in Solaris Cure on VIP Road, Surat. Established with the clinical leadership of Dr. Kairavi Yagnik and Dr. Rut Shah, our mission is to deliver evidence-based, respectful, and joyful care from pre-conception through delivery and beyond.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-brand-slate-900 text-sm">Obstetrics & Maternity</h4>
                      <p className="text-xs text-slate-500">Antenatal care, normal and painless deliveries</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-brand-slate-900 text-sm">Advanced Laparoscopy</h4>
                      <p className="text-xs text-slate-500">Keyhole surgery for cysts, fibroids, & hysterectomy</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-brand-slate-900 text-sm">Infertility Care</h4>
                      <p className="text-xs text-slate-500">Evidence-based workup & follicular monitoring</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-brand-slate-900 text-sm">FOGSI Sonography</h4>
                      <p className="text-xs text-slate-500">In-clinic high-resolution pelvic ultrasound</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal-700 hover:text-brand-teal-800"
                  >
                    <span>Read More About Our Care Philosophy</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Statistics & Highlights */}
              <div className="lg:col-span-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-teal-50/70 p-6 rounded-2xl border border-brand-teal-100 text-center space-y-1">
                    <p className="text-3xl sm:text-4xl font-bold text-brand-teal-700 font-heading">
                      10+
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-brand-slate-800">
                      Years Clinical Experience
                    </p>
                    <p className="text-[11px] text-slate-500">Dedicated to Obstetrics & Gynaecology</p>
                  </div>

                  <div className="bg-brand-gold-50/70 p-6 rounded-2xl border border-brand-gold-200 text-center space-y-1">
                    <p className="text-3xl sm:text-4xl font-bold text-brand-gold-700 font-heading">
                      14
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-brand-slate-800">
                      Confirmed Specialities
                    </p>
                    <p className="text-[11px] text-slate-500">From Antenatal to Laparoscopy</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-1">
                    <p className="text-3xl sm:text-4xl font-bold text-brand-slate-900 font-heading">
                      24*7
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-brand-slate-800">
                      Emergency Support
                    </p>
                    <p className="text-[11px] text-slate-500">Immediate care for maternity onset</p>
                  </div>

                  <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 text-center space-y-1">
                    <p className="text-3xl sm:text-4xl font-bold text-emerald-700 font-heading">
                      100%
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-brand-slate-800">
                      Women-Centric Focus
                    </p>
                    <p className="text-[11px] text-slate-500">Respectful, dignified patient care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Confirmed Services & Specialities */}
      {isSectionEnabled('services_specialities') && (
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-100/60 px-3 py-1 rounded-md">
                Clinical Specialities
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-brand-slate-900 mt-2">
                {getSectionTitle('services_specialities', 'Comprehensive Healthcare Services at Matruka')}
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                {getSectionSubtitle(
                  'services_specialities',
                  'Every service is managed directly by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road Surat.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((svc: any) => (
                <div
                  key={svc._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-teal-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-teal-50 text-brand-teal-700">
                        {svc.category}
                      </span>
                      <Sparkles className="w-4 h-4 text-brand-gold-500" />
                    </div>

                    <h3 className="text-lg font-bold text-brand-slate-900 font-heading group-hover:text-brand-teal-600 transition-colors">
                      {svc.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {svc.shortDescription}
                    </p>

                    {svc.treatments && svc.treatments.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-brand-slate-800 mb-1.5">Procedures:</p>
                        <ul className="text-xs text-slate-500 space-y-1">
                          {svc.treatments.slice(0, 3).map((t: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-500" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                      href={`/services/${svc.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 transition"
                    >
                      <span>Explore Clinical Protocol</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow transition"
              >
                <span>View All 14 Confirmed Specialities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. Featured Doctors Section */}
      {isSectionEnabled('featured_doctors') && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
                Our Specialists
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-brand-slate-900 mt-2">
                {getSectionTitle('featured_doctors', 'Meet Dr. Kairavi Yagnik & Dr. Rut Shah')}
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                MS Obstetricians, Gynaecologists, and Fellowship-Trained Laparoscopic Surgeons dedicated to compassionate patient healing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredDoctors.map((doc: any) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-brand-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-teal-50 border-2 border-brand-teal-200 flex items-center justify-center font-bold text-2xl text-brand-teal-700 flex-shrink-0">
                        {doc.name[4] || 'D'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-brand-slate-900 font-heading">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-bold text-brand-gold-600 bg-brand-gold-50 inline-block px-2 py-0.5 rounded mt-0.5 border border-brand-gold-200">
                          {doc.qualifications}
                        </p>
                        <p className="text-xs text-brand-teal-700 font-medium mt-1">
                          {doc.designation}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {doc.bio}
                    </p>

                    {/* Fellowships */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <p className="text-[11px] font-bold text-brand-slate-800 uppercase tracking-wider">
                        Fellowships & Certifications:
                      </p>
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {(doc.fellowshipsAndCertifications || []).map((f: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-brand-gold-500" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* OPD Hours */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                      <Clock className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                      <span>OPD: {doc.opdTimings}</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/doctors/${doc.slug}`}
                      className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 flex items-center gap-1"
                    >
                      <span>View Full Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={`tel:${phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 px-3 py-1.5 rounded-lg transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact Doctor</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Facilities & Infrastructure */}
      {isSectionEnabled('facilities_infrastructure') && (
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-100/60 px-3 py-1 rounded-md">
                Hospital Infrastructure
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-brand-slate-900 mt-2">
                {getSectionTitle('facilities_infrastructure', 'Modern Facilities for Mother & Baby')}
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Carefully designed for sterile surgical precision, high-resolution diagnostic imaging, and calm, private recovery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((fac: any) => (
                <div
                  key={fac._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-teal-300 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal-50 text-brand-teal-700 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-brand-slate-900 text-base font-heading">{fac.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{fac.shortDescription}</p>

                    {fac.features && (
                      <ul className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                        {fac.features.slice(0, 3).map((ft: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-brand-teal-500" />
                            <span>{ft}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/facilities"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal-700 hover:text-brand-teal-800"
              >
                <span>Tour Our Hospital Facilities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Patient Testimonials */}
      {isSectionEnabled('testimonials') && testimonials.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
                Patient Stories
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-brand-slate-900 mt-2">
                {getSectionTitle('testimonials', 'Words From Our Mothers and Patients')}
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Genuine feedback from patients who entrusted their pregnancies and gynaecological treatments to Matruka.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t: any) => (
                <div
                  key={t._id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-brand-gold-500">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brand-gold-500 text-brand-gold-500" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                      &ldquo;{t.story}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200">
                    <p className="font-bold text-brand-slate-900 text-sm font-heading">{t.patientName}</p>
                    <p className="text-[11px] text-slate-500">{t.location}</p>
                    <p className="text-xs text-brand-teal-700 font-medium mt-1">
                      Care: {t.treatmentReceived}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQs Section */}
      {isSectionEnabled('faqs') && faqs.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-100/60 px-3 py-1 rounded-md">
                Common Inquiries
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-brand-slate-900 mt-2">
                {getSectionTitle('faqs', 'Frequently Asked Questions')}
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq: any) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-teal-50 text-brand-teal-700">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-brand-slate-900 text-sm sm:text-base font-heading">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-2 border-l-2 border-brand-teal-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-teal-700 hover:text-brand-teal-800"
              >
                <span>View Full Frequently Asked Questions Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 9. Location, OPD Timings & Map */}
      {isSectionEnabled('location_contact') && (
        <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
                    Visit Our Clinic
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-brand-slate-900 mt-2">
                    Solaris Cure, VIP Road Surat
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Easy access with ample parking and elevator access.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-slate-900">Address:</p>
                      <p className="text-slate-600">
                        303-306, Solaris Cure, Beside Ratnajyoti Apartment, VIP Road, Surat - 395007
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-gold-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-slate-900">OPD Timings:</p>
                      <p className="text-slate-600">{opdTimings}</p>
                      <p className="text-xs text-amber-700 font-semibold mt-0.5">
                        Sunday: Emergency 24*7 Only
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-slate-900">Call / Inquiries:</p>
                      <a href={`tel:${phone}`} className="text-base font-bold text-brand-teal-700">
                        {phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Clinic</span>
                  </a>
                  <a
                    href={
                      settings.googleMapsDirectionsUrl ||
                      'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-brand-slate-800 font-semibold text-sm px-5 py-3 rounded-xl transition"
                  >
                    <MapPin className="w-4 h-4 text-brand-teal-600" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-md h-96 relative">
                  <iframe
                    src={
                      settings.googleMapsEmbedUrl ||
                      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2223847847953!2d72.825!3d21.145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4c!2sSolaris+Cure+VIP+Road+Surat!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin'
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Matruka Location on Google Maps"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}



import React from 'react';
import Link from 'next/link';
import { BACKEND_URL, resolveImageUrl } from '@/lib/api';
import SafeImage from '@/components/SafeImage';
import HospitalLocationSection from '@/components/HospitalLocationSection';
import FAQSection from '@/components/FAQSection';
import HeroSlider from '@/components/HeroSlider';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import MaternityCarePathway from '@/components/MaternityCarePathway';
import GalleryPreviewSection from '@/components/GalleryPreviewSection';
import LatestBlogsSection from '@/components/LatestBlogsSection';
import DoctorAvatar from '@/components/DoctorAvatar';
import {
  Phone,
  Clock,
  MapPin,
  Heart,
  Shield,
  ChevronRight,
  Stethoscope,
  Building2,
  Star,
  ArrowRight,
  MessageSquareQuote,
  CheckCircle2,
  CalendarCheck,
  Award,
  Activity,
  HeartHandshake,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

async function getHomeData() {
  try {
    const [homeRes, servicesRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/public/home-data`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/services`, { cache: 'no-store' }).catch(() => null),
    ]);
    if (homeRes.ok) {
      const json = await homeRes.json();
      const homeData = json.data || {};
      if (servicesRes && servicesRes.ok) {
        const svcJson = await servicesRes.json();
        const allServices = svcJson?.data?.services;
        if (Array.isArray(allServices) && allServices.length > 0) {
          homeData.featuredServices = allServices;
        }
      }
      return homeData;
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
  const galleryPreview = data?.galleryPreview || [];
  const faqs = data?.faqs || [];
  const hospitalLocations = data?.hospitalLocations || [];

  const phone = settings.appointmentPhone || '7984882273';
  const emergencyPhone = settings.emergencyPhone || phone;
  const whatsappNumber = settings.whatsappNumber || '917984882273';
  const opdTimings = settings.opdTimings || '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)';
  const emergencyHours = settings.emergencyHours || 'Round-the-clock emergency support for obstetric labour & acute gynaecology:';

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

  const aboutSection = sections.find((s: any) => s.sectionKey === 'about_clinic');
  const aboutSettings = aboutSection?.settings || {};
  const careStatsSection = sections.find((s: any) => s.sectionKey === 'care_statistics');
  const servicesSection = sections.find((s: any) => s.sectionKey === 'services_specialities');
  const whyChooseSection = sections.find((s: any) => s.sectionKey === 'why_choose_us');
  const pathwaySection =
    sections.find((s: any) => s.sectionKey === 'maternity_pathway') ||
    sections.find((s: any) => s.sectionKey === 'why_choose_us');
  const doctorsSection = sections.find((s: any) => s.sectionKey === 'featured_doctors');
  const facilitiesSection = sections.find((s: any) => s.sectionKey === 'facilities_infrastructure');
  const testimonialsSection = sections.find((s: any) => s.sectionKey === 'testimonials');
  const gallerySection = sections.find((s: any) => s.sectionKey === 'gallery_preview');
  const blogsSection = sections.find((s: any) => s.sectionKey === 'latest_blogs');
  const contactSection = sections.find((s: any) => s.sectionKey === 'location_contact');
  const faqsSection = sections.find((s: any) => s.sectionKey === 'faqs');

  const aboutFeatures = (aboutSettings.features && aboutSettings.features.length > 0)
    ? aboutSettings.features
    : [
      { title: 'Obstetrics & Maternity', desc: 'Antenatal care, normal and painless deliveries' },
      { title: 'Advanced Laparoscopy', desc: 'Keyhole surgery for cysts, fibroids, & hysterectomy' },
      { title: 'Infertility Care', desc: 'Evidence-based workup & follicular monitoring' },
      { title: 'FOGSI Sonography', desc: 'In-clinic high-resolution pelvic ultrasound' },
    ];

  const careStats = (careStatsSection?.settings?.stats && careStatsSection.settings.stats.length > 0)
    ? careStatsSection.settings.stats
    : (aboutSettings.stats && aboutSettings.stats.length > 0)
      ? aboutSettings.stats
      : [
        { value: '10+', label: 'Years Experience', desc: 'Obstetrics & Gynec' },
        { value: `${featuredServices.length || 14}`, label: 'Specialities', desc: 'Antenatal to Surgery' },
        { value: '24*7', label: 'Emergency Support', desc: 'Obstetric readiness' },
        { value: '100%', label: 'Women-Centric', desc: 'Dignified patient care' },
      ];

  const defaultQualityStandards = [
    {
      title: 'Consultant-Led Care',
      desc: 'Every antenatal consultation, diagnostic ultrasound, and surgery is personally performed by our senior specialists.',
      badge: 'Direct Expertise',
    },
    {
      title: 'Minimally Invasive Surgery',
      desc: 'Advanced keyhole laparoscopic techniques for fibroids, endometriosis, and cysts ensuring tiny scars and rapid discharge.',
      badge: 'Daycare Available',
    },
    {
      title: 'Natural & Painless Birth Focus',
      desc: 'Scientific, patient-centered labour support prioritizing normal delivery and maternal comfort.',
      badge: 'Safe Deliveries',
    },
    {
      title: 'NABH-Standard Hygiene',
      desc: 'Modern modular surgical suites with HEPA air filtration and stringent hospital infection control protocols.',
      badge: 'Zero Compromise',
    },
  ];

  const qualityStandards = (whyChooseSection?.settings?.items && whyChooseSection.settings.items.length > 0)
    ? whyChooseSection.settings.items
    : defaultQualityStandards;

  const founderQuote = aboutSettings.quote || 'Every woman deserves clinical expertise delivered with unhurried listening, dignity, and warmth.';
  const founderQuoteAuthor = aboutSettings.quoteAuthor || 'Dr. Kairavi Yagnik & Dr. Rut Shah';

  return (
    <div className="space-y-0 text-slate-800 antialiased selection:bg-brand-teal-100 selection:text-brand-teal-900">
      {/* 1. Hero Section - Luxury Multi-Slide Carousel */}
      {isSectionEnabled('hero_slider') && (
        <HeroSlider
          banners={banners}
          phone={phone}
          whatsappNumber={whatsappNumber}
          trustBadge1={settings.heroBadge1 || ''}
          trustBadge2={settings.heroBadge2 || ''}
          ratingScore={settings.ratingScore || '4.9/5'}
          ratingText={settings.ratingText || "Surat's Trusted Women's Care"}
        />
      )}

      {/* 2. Floating Emergency & Timings Command Bar */}
      {isSectionEnabled('emergency_ribbon') && (
        <div className="-mt-8 sm:-mt-10 relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16">
          <ScrollReveal animation="fade-up" duration={600}>
            <div className="bg-gradient-to-r from-[#047A8C] via-[#0496AC] to-[#037A8C] text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[0_16px_40px_rgba(4,150,172,0.28)] border border-teal-300/30 backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Left: Emergency 24x7 Hotline */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="text-white text-xs sm:text-sm font-semibold">
                  {emergencyHours}
                </span>
                <a
                  href={`tel:${emergencyPhone}`}
                  className="inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-brand-teal-800 font-semibold px-4 py-1.5 rounded-xl transition shadow-xs text-xs sm:text-sm hover:scale-102 active:scale-98"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-teal-700 shrink-0" />
                  <span>{emergencyPhone}</span>
                </a>
              </div>

              {/* Right: OPD Consultation Hours & Directions */}
              <div className="flex items-center gap-4 text-xs sm:text-sm flex-wrap lg:justify-end border-t lg:border-t-0 border-teal-500/40 pt-3 lg:pt-0">
                <div className="flex items-center gap-2 text-teal-100">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>OPD Hours: <strong className="text-white font-semibold">{opdTimings}</strong></span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-teal-100 text-xs pl-3 border-l border-teal-400/40">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{settings.shortAddress || settings.address || 'Solaris Cure, VIP Road Surat'}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* 3. About Matruka Overview & Care Highlights */}
      {isSectionEnabled('about_clinic') && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-brand-teal-50/20 to-white relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-teal-500/[0.04] rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Mission & Care Philosophy */}
              <div className="lg:col-span-6 space-y-6">
                <ScrollReveal animation="fade-right" duration={600}>
                  <div>
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2.5 sm:px-3 py-1 rounded-md leading-snug">
                      <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-600 shrink-0" />
                      <span>{aboutSection?.badgeText || 'Centre of Excellence in Women\'s Health'}</span>
                    </span>
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
                      {getSectionTitle('about_clinic', 'Complete Healthcare for Every Stage of Womanhood')}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-4">
                    {aboutSection?.subtitle ||
                      aboutSettings.description ||
                      'Matruka — Complete Care for Her is an empathetic, specialized women’s healthcare clinic located in Solaris Cure on VIP Road, Surat. Established with the clinical leadership of Dr. Kairavi Yagnik and Dr. Rut Shah, our mission is to deliver evidence-based, respectful, and joyful care from pre-conception through delivery and beyond.'}
                  </p>

                  {/* Founder Quote Card */}
                  <div className="mt-5 rounded-2xl bg-white p-4 sm:p-5 border-l-4 border-brand-teal-600 shadow-[0_4px_20px_rgba(4,150,172,0.06)] border-y border-r border-slate-100">
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                      &ldquo;{founderQuote}&rdquo;
                    </p>
                    <p className="text-xs font-bold text-brand-teal-700 mt-2">
                      — {founderQuoteAuthor}
                    </p>
                  </div>
                </ScrollReveal>

                {/* 4 Pillars Grid with sleek iconography */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {aboutFeatures.map((feat: any, idx: number) => {
                    const icons = [Stethoscope, Shield, Heart, Award];
                    const FeatIcon = icons[idx % icons.length];
                    return (
                      <ScrollReveal key={idx} animation="fade-up" delay={idx * 80} duration={500}>
                        <div
                          className="card-hover-lift p-4 rounded-2xl bg-white hover:bg-brand-teal-50/50 border border-slate-200/90 hover:border-brand-teal-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group h-full"
                        >
                          <div className="w-9 h-9 rounded-xl bg-brand-teal-50 text-brand-teal-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-brand-teal-600 group-hover:text-white transition-all">
                            <FeatIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-slate-900 text-xs sm:text-sm group-hover:text-brand-teal-800 transition-colors">
                              {feat.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                              {feat.desc}
                            </p>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>

                <ScrollReveal animation="fade-up" delay={200}>
                  <div className="pt-2">
                    <Link
                      href={aboutSettings.btnLink || '/about'}
                      className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal-700 hover:text-brand-teal-800 group transition"
                    >
                      <span>{aboutSettings.btnText || 'Read More About Our Care Philosophy'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: High-Impact Statistics Cards */}
              <div className="lg:col-span-6">
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  {careStats.map((stat: any, idx: number) => {
                    const cardStyles = [
                      {
                        border: 'hover:border-brand-teal-300',
                        accent: 'from-brand-teal-600 to-brand-teal-700',
                        bg: 'bg-brand-teal-50/30',
                      },
                      {
                        border: 'hover:border-amber-300',
                        accent: 'from-amber-500 to-amber-600',
                        bg: 'bg-amber-50/30',
                      },
                      {
                        border: 'hover:border-slate-300',
                        accent: 'from-brand-slate-800 to-brand-slate-900',
                        bg: 'bg-slate-50/30',
                      },
                      {
                        border: 'hover:border-emerald-300',
                        accent: 'from-emerald-600 to-teal-700',
                        bg: 'bg-emerald-50/30',
                      },
                    ];
                    const style = cardStyles[idx % cardStyles.length];
                    return (
                      <ScrollReveal key={idx} animation="fade-up" delay={idx * 100} duration={600}>
                        <div
                          className={`card-hover-lift bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-[0_6px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(4,150,172,0.14)] transition-all duration-300 relative overflow-hidden group h-full ${style.border}`}
                        >
                          {/* Card Content */}
                          <div className="space-y-1 text-center sm:text-left pt-1">
                            <p className="text-2xl sm:text-4xl font-bold text-brand-teal-700 font-heading">
                              <AnimatedCounter value={stat.value} duration={1600} />
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-brand-slate-800">
                              {stat.label}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {stat.desc}
                            </p>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Confirmed Services & Specialities - Enterprise Medical Grid */}
      {isSectionEnabled('services_specialities') && (
        <section className="py-12 sm:py-16 lg:py-20 bg-slate-50/80 border-y border-slate-200/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" duration={600}>
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-100/60 px-2.5 sm:px-3 py-1 rounded-md leading-snug">
                  <Stethoscope className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-700 shrink-0" />
                  <span>Clinical Specialities &amp; Surgical Care</span>
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
                  {getSectionTitle('services_specialities', 'Comprehensive Healthcare Services at Matruka')}
                </h2>
                <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
                  {getSectionSubtitle(
                    'services_specialities',
                    'Every service is managed directly by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road Surat.'
                  )}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {featuredServices.slice(0, 6).map((svc: any, idx: number) => (
                <ScrollReveal key={svc._id} animation="fade-up" delay={(idx % 3) * 100} duration={550}>
                  <div
                    className="card-hover-lift bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-brand-teal-300 transition-all duration-300 flex flex-col justify-between group relative h-full"
                  >
                    <div className="space-y-4">
                      <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <SafeImage
                          src={resolveImageUrl(svc.featuredImage, '/logo.png')}
                          fallbackSrc="/logo.png"
                          alt={svc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fallbackClassName="w-full h-full object-contain p-5 bg-slate-50"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-100/80">
                          {svc.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-brand-slate-900 font-heading group-hover:text-brand-teal-700 transition-colors leading-snug">
                        {svc.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {svc.shortDescription}
                      </p>

                      {svc.treatments && svc.treatments.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider mb-2">Key Clinical Procedures:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {svc.treatments.slice(0, 3).map((t: string, i: number) => (
                              <span
                                key={i}
                                className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg font-medium truncate max-w-full"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-5 border-t border-slate-100">
                      <Link
                        href={`/services/${svc.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 group-hover:translate-x-1 transition-all"
                      >
                        <span>Explore Clinical Protocol</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center mt-12">
                <Link
                  href={servicesSection?.settings?.btnLink || '/services'}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-teal-600 to-brand-teal-700 hover:from-brand-teal-700 hover:to-brand-teal-800 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-[0_4px_16px_rgba(4,150,172,0.25)] hover:shadow-[0_6px_24px_rgba(4,150,172,0.35)] hover:-translate-y-0.5 transition-all"
                >
                  <span>{servicesSection?.settings?.btnText || 'View All Specialities'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 5. Why Choose Matruka - Patient Care Standards */}
      {isSectionEnabled('why_choose_us') && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" duration={600}>
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2.5 sm:px-3 py-1 rounded-md leading-snug">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-600 shrink-0" />
                  <span>{whyChooseSection?.badgeText || 'Our Clinical Standards'}</span>
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
                  {getSectionTitle('why_choose_us', 'Why Women & Families Trust Matruka')}
                </h2>
                <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
                  {getSectionSubtitle(
                    'why_choose_us',
                    'Uncompromising surgical precision combined with empathetic, personalized bedside care in Surat.'
                  )}
                </p>
              </div>
            </ScrollReveal>

            {(() => {
              const visibleStandards = qualityStandards.filter((std: any) => std?.isVisible !== false);
              if (visibleStandards.length === 0) return null;
              const gridCols =
                visibleStandards.length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : visibleStandards.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
                    : visibleStandards.length === 3
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
              return (
                <div className={`grid ${gridCols} gap-6`}>
                  {visibleStandards.map((std: any, idx: number) => {
                    const icons = [Stethoscope, Activity, Heart, ShieldCheck];
                    const StdIcon = icons[idx % icons.length];
                    return (
                      <ScrollReveal key={idx} animation="fade-up" delay={idx * 100} duration={500}>
                        <div className="card-hover-lift rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-brand-teal-300 transition-all duration-300 flex flex-col justify-between h-full">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal-50 to-brand-teal-100/70 text-brand-teal-700 flex items-center justify-center font-bold shadow-2xs">
                                <StdIcon className="w-6 h-6" />
                              </div>
                              {std.badge && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                                  {std.badge}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-brand-slate-900 text-base font-heading">
                              {std.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {std.desc}
                            </p>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* 6. Maternity Pathway - Conception to Postnatal Journey */}
      {isSectionEnabled('maternity_pathway') && (
        <MaternityCarePathway
          badgeText={pathwaySection?.badgeText || 'MATERNITY JOURNEY ROADMAP'}
          title={getSectionTitle('maternity_pathway', 'Your Pathway to Motherhood — Complete Care at Every Step')}
          subtitle={getSectionSubtitle(
            'maternity_pathway',
            'A structured, joyful, and medically rigorous continuum of care from pre-conception planning to comfortable delivery and postnatal recovery.'
          )}
          stages={
            pathwaySection?.settings?.stages && pathwaySection.settings.stages.length > 0
              ? pathwaySection.settings.stages
              : undefined
          }
          phone={phone}
        />
      )}

      {/* 7. Featured Doctors Section - Executive Medical Profiles */}
      {isSectionEnabled('featured_doctors') && (
        <section className="py-12 sm:py-16 lg:py-20 bg-slate-50/80 border-t border-slate-200/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" duration={600}>
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2.5 sm:px-3 py-1 rounded-md leading-snug">
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-600 shrink-0" />
                  <span>Our Specialists</span>
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
                  {getSectionTitle('featured_doctors', 'Meet Dr. Kairavi Yagnik & Dr. Rut Shah')}
                </h2>
                <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
                  MS Obstetricians, Gynaecologists, and Fellowship-Trained Laparoscopic Surgeons dedicated to compassionate patient healing.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredDoctors.map((doc: any, idx: number) => (
                <ScrollReveal key={doc._id} animation="fade-up" delay={idx * 150} duration={600}>
                  <div
                    className="card-hover-lift bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-brand-teal-300 transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <DoctorAvatar
                          name={doc.name}
                          profileImage={doc.profileImage}
                          className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl"
                          textSize="text-2xl sm:text-3xl"
                          showBadge={true}
                        />
                        <div>
                          <h3 className="text-xl font-bold text-brand-slate-900 font-heading">
                            {doc.name}
                          </h3>
                          <p className="text-xs font-bold text-amber-800 bg-amber-50 inline-block px-2.5 py-0.5 rounded-md mt-1 border border-amber-200/80">
                            {doc.qualifications}
                          </p>
                          <p className="text-xs text-brand-teal-700 font-semibold mt-1">
                            {doc.designation}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            {doc.experienceYears || 10}+ Years Clinical Experience
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {doc.bio}
                      </p>

                      {/* Experience & Journey Timeline Preview */}
                      {Array.isArray(doc.experienceJourney) && doc.experienceJourney.length > 0 && (
                        <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100/80 space-y-2.5">
                          <p className="text-[11px] font-bold text-brand-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-teal-600" />
                            <span>Experience &amp; Journey:</span>
                          </p>
                          <div className="relative pl-4 space-y-2 before:content-[''] before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-brand-teal-300">
                            {doc.experienceJourney.slice(0, 3).map((step: any, i: number) => (
                              <div key={i} className="relative text-xs">
                                <span className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-teal-600" />
                                <span className="font-bold text-brand-slate-900">{step.year ? `${step.year}: ` : ''}</span>
                                <span className="font-semibold text-slate-700">{step.role}</span>
                                {step.institution && (
                                  <span className="text-slate-500"> — {step.institution}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fellowships */}
                      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-2">
                        <p className="text-[11px] font-bold text-brand-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>Fellowships &amp; Certifications:</span>
                        </p>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {(doc.fellowshipsAndCertifications || []).map((f: string, i: number) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-500 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* OPD Hours */}
                      <div className="flex items-center gap-2 text-xs text-slate-700 bg-teal-50/50 p-3 rounded-xl border border-teal-100/60">
                        <Clock className="w-4 h-4 text-brand-teal-600 shrink-0" />
                        <span>OPD Schedule: <strong className="text-brand-slate-900">{doc.opdTimings}</strong></span>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        href={`/doctors/${doc.slug}`}
                        className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 flex items-center gap-1 group"
                      >
                        <span>View Credentials</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <a
                        href={`tel:${doc.phone || phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-teal-600 hover:bg-brand-teal-700 text-white px-4 py-2 rounded-xl transition shadow-2xs hover:scale-102 active:scale-98"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contact Doctor</span>
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Facilities & Infrastructure - Enterprise 4-Card Grid */}
      {isSectionEnabled('facilities_infrastructure') && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" duration={600}>
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-100/60 px-2.5 sm:px-3 py-1 rounded-md leading-snug">
                  <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-700 shrink-0" />
                  <span>Hospital Infrastructure</span>
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
                  {getSectionTitle('facilities_infrastructure', 'Modern Facilities for Mother & Baby')}
                </h2>
                <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
                  Carefully designed for sterile surgical precision, high-resolution diagnostic imaging, and calm, private recovery.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((fac: any, idx: number) => (
                <ScrollReveal key={fac._id} animation="fade-up" delay={(idx % 4) * 80} duration={500}>
                  <div
                    className="card-hover-lift bg-white rounded-3xl border border-slate-200/90 p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-brand-teal-300 transition-all duration-300 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      {fac.image ? (
                        <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <SafeImage
                            src={resolveImageUrl(fac.image, '/logo.png')}
                            fallbackSrc="/logo.png"
                            alt={fac.name}
                            className="w-full h-full object-cover"
                            fallbackClassName="w-full h-full object-contain p-4 bg-slate-50"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal-500 to-brand-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}
                      <h3 className="font-bold text-brand-slate-900 text-base font-heading">{fac.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{fac.shortDescription}</p>

                      {fac.features && (
                        <ul className="text-[11px] text-slate-500 space-y-1.5 pt-3 border-t border-slate-100">
                          {fac.features.slice(0, 3).map((ft: string, i: number) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                              <span>{ft}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center mt-12">
                <Link
                  href={facilitiesSection?.settings?.btnLink || '/facilities'}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal-700 hover:text-brand-teal-800 group transition"
                >
                  <span>{facilitiesSection?.settings?.btnText || 'Tour Our Hospital Facilities'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 8. Gallery Preview - Clinic & Infrastructure Walkthrough */}
      {isSectionEnabled('gallery_preview') && (
        <GalleryPreviewSection
          badgeText={gallerySection?.badgeText || 'INSIDE MATRUKA CLINIC'}
          title={getSectionTitle('gallery_preview', 'Modern Clinical Infrastructure & Care Environment')}
          subtitle={
            getSectionSubtitle(
              'gallery_preview',
              'Take a visual walkthrough of our specialized women’s hospital, modular surgical theatres, and comfortable recovery suites at Solaris Cure, VIP Road Surat.'
            )
          }
          btnText={gallerySection?.settings?.btnText || 'Explore Complete Hospital Tour'}
          btnLink={gallerySection?.settings?.btnLink || '/gallery'}
          items={galleryPreview}
        />
      )}

      {/* 9. Patient Testimonials - Verified Reviews Grid */}
      {isSectionEnabled('testimonials') && testimonials.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-slate-50/70 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" duration={600}>
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2.5 sm:px-3 py-1 rounded-md leading-snug">
                  <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-600 shrink-0" />
                  <span>Patient Stories</span>
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
                  {getSectionTitle('testimonials', 'Words From Our Mothers and Patients')}
                </h2>
                <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
                  Genuine feedback from patients who entrusted their pregnancies and gynaecological treatments to Matruka.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {testimonials.map((t: any, idx: number) => (
                <ScrollReveal key={t._id} animation="fade-up" delay={(idx % 3) * 100} duration={500}>
                  <div
                    className="card-hover-lift bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between relative shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-brand-teal-200 transition-all duration-300 h-full"
                  >
                    <MessageSquareQuote className="w-8 h-8 text-brand-teal-200/60 absolute top-5 right-5" />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed pt-1">
                        &ldquo;{t.story}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 mt-5 border-t border-slate-200/70 relative z-10">
                      <p className="font-bold text-brand-slate-900 text-sm font-heading">{t.patientName}</p>
                      <p className="text-[11px] text-slate-500">{t.location}</p>
                      <p className="text-xs text-brand-teal-700 font-semibold mt-1">
                        Care: {t.treatmentReceived}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Latest Blogs - Pregnancy & Gynaecology Knowledge */}
      {isSectionEnabled('latest_blogs') && (
        <LatestBlogsSection
          badgeText={
            blogsSection?.badgeText &&
            !['HEALTH BLOGS & EDUCATION', "PREGNANCY & WOMEN'S HEALTH EDUCATION", 'PREGNANCY & WOMEN’S HEALTH EDUCATION'].includes(blogsSection.badgeText.trim())
              ? blogsSection.badgeText
              : 'BLOGS'
          }
          title={getSectionTitle('latest_blogs', 'Doctor-Authored Health Blogs & Tips')}
          subtitle={
            getSectionSubtitle(
              'latest_blogs',
              'Evidence-based advice on trimester wellness, gynaecological health, and post-delivery care written directly by our clinic specialists in Surat.'
            )
          }
          btnText={blogsSection?.settings?.btnText || 'Explore All Health Blogs'}
          btnLink={blogsSection?.settings?.btnLink || '/blog'}
          blogs={recentBlogs}
        />
      )}

      {/* 11. Hospital Location, OPD Timings, Map & Newsletter */}
      {isSectionEnabled('location_contact') && (
        <ScrollReveal animation="fade-up" duration={600}>
          <HospitalLocationSection
            initialLocations={hospitalLocations}
            newsletterBadge={
              contactSection?.settings?.newsletterBadge &&
              contactSection.settings.newsletterBadge !== 'MATRUKA HEALTH BULLETIN'
                ? contactSection.settings.newsletterBadge
                : 'CLINIC INQUIRY'
            }
            newsletterTitle={
              contactSection?.settings?.newsletterTitle &&
              contactSection.settings.newsletterTitle !== 'Subscribe to Health Updates'
                ? contactSection.settings.newsletterTitle
                : 'Quick Clinic Inquiry'
            }
            newsletterSubtitle={
              contactSection?.settings?.newsletterSubtitle &&
              !contactSection.settings.newsletterSubtitle.includes('trimester wellness tips, and clinic updates directly in your inbox')
                ? contactSection.settings.newsletterSubtitle
                : 'Have a question about pregnancy care, OPD timings, or treatments? Send us an inquiry and our team will reach out.'
            }
            newsletterBtnText={
              contactSection?.settings?.newsletterBtnText &&
              contactSection.settings.newsletterBtnText !== 'Join Our Newsletter'
                ? contactSection.settings.newsletterBtnText
                : 'Submit Inquiry'
            }
          />
        </ScrollReveal>
      )}

      {/* 10. FAQs Section */}
      {isSectionEnabled('faqs') && faqs.length > 0 && (
        <ScrollReveal animation="fade-up" duration={600}>
          <FAQSection
            initialFaqs={faqs}
            badgeText={faqsSection?.badgeText || 'PATIENT GUIDANCE & FAQS'}
            title={getSectionTitle('faqs', 'Frequently Asked Questions')}
            subtitle={
              getSectionSubtitle(
                'faqs',
                'Answers to common questions regarding consultation, pregnancy care, surgery, and clinic visits.'
              )
            }
          />
        </ScrollReveal>
      )}
    </div>
  );
}

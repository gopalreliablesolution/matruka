'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Baby,
  Heart,
  Stethoscope,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Clock,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export interface CareStage {
  step: string;
  stageName: string;
  duration: string;
  headline: string;
  description: string;
  highlights: string[];
  recommendedScans: string;
  badge: string;
}

const DEFAULT_STAGES: CareStage[] = [
  {
    step: '01',
    stageName: 'Pre-Conception & Planning',
    duration: 'Before Pregnancy',
    headline: 'Building a Strong, Healthy Foundation for Conception',
    description:
      'Evidence-based pre-pregnancy health screening, ovulation follicular tracking, rubella/thalassemia screening, and preconception nutritional guidance led directly by Dr. Kairavi Yagnik & Dr. Rut Shah.',
    highlights: [
      'Pre-pregnancy wellness & fertility evaluation',
      'Follicular tracking & ovulation monitoring',
      'Genetic & thyroid/HbA1c screening',
      'Personalized dietary & lifestyle counseling',
    ],
    recommendedScans: 'Pelvic Baseline Ultrasound',
    badge: 'Planning Stage',
  },
  {
    step: '02',
    stageName: 'Antenatal Care (Trimesters 1, 2 & 3)',
    duration: 'Weeks 1 to 36',
    headline: 'Continuous Clinical Monitoring for Mother and Baby',
    description:
      'Regular comprehensive check-ups, high-risk pregnancy stratification, early pregnancy scans, anomaly detection, and growth Doppler tracking in our in-clinic FOGSI-certified sonography suite.',
    highlights: [
      'Monthly doctor consultations & routine blood monitoring',
      'FOGSI Certified 1st & 2nd trimester sonography',
      'Gestational diabetes & hypertension prevention',
      'Trimester wellness, yoga & birth education',
    ],
    recommendedScans: 'NT Scan, Anomaly Scan, Color Doppler',
    badge: 'Maternity Journey',
  },
  {
    step: '03',
    stageName: 'Painless Labor & Safe Delivery',
    duration: 'Weeks 37 to 40+',
    headline: 'Empowered, Gentle, and Scientifically Supported Childbirth',
    description:
      'Patient-centric labor suites designed for comfort. We specialize in encouraging natural normal deliveries, offering 24x7 epidural painless delivery, continuous CTG fetal heart monitoring, and swift emergency LSCS readiness.',
    highlights: [
      'Painless vaginal delivery with 24x7 anaesthesia support',
      'Active labour companion-friendly private suites',
      'Continuous electronic fetal heart (CTG) monitoring',
      'Emergency modular OT & sterile surgical readiness',
    ],
    recommendedScans: 'Fetal Biophysical Profile & Growth Scan',
    badge: 'Birth Day Care',
  },
  {
    step: '04',
    stageName: 'Postnatal & Lactation Care',
    duration: 'First 6 Weeks & Beyond',
    headline: 'Compassionate Care for Mother’s Healing & Newborn Bonding',
    description:
      'Comprehensive postpartum follow-ups focusing on maternal surgical wound healing, pelvic floor recovery, breast engorgement prevention, newborn feeding, and emotional wellbeing.',
    highlights: [
      'One-on-one certified lactation support & guidance',
      'Post-delivery wound care & pelvic muscle recovery',
      'Postpartum depression screening & emotional care',
      'Contraception & family planning counseling',
    ],
    recommendedScans: 'Pelvic Recovery Scan (if required)',
    badge: 'Mother & Baby',
  },
];

interface MaternityCarePathwayProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  stages?: CareStage[];
  phone?: string;
}

export default function MaternityCarePathway({
  badgeText = 'MATERNITY JOURNEY ROADMAP',
  title = 'Your Pathway to Motherhood — Complete Care at Every Step',
  subtitle = 'A structured, joyful, and medically rigorous continuum of care from pre-conception planning to comfortable delivery and postnatal recovery.',
  stages = DEFAULT_STAGES,
  phone = '7984882273',
}: MaternityCarePathwayProps) {
  const [activeTab, setActiveTab] = useState(0);
  const safeStages = Array.isArray(stages) && stages.length > 0 ? stages : DEFAULT_STAGES;
  const activeStage = safeStages[activeTab] || safeStages[0] || DEFAULT_STAGES[0];
  const activeHighlights =
    Array.isArray(activeStage?.highlights) && activeStage.highlights.length > 0
      ? activeStage.highlights
      : DEFAULT_STAGES[activeTab]?.highlights || DEFAULT_STAGES[0].highlights;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-teal-50/25 to-white border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 max-w-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2.5 sm:px-3 py-1 rounded-md leading-snug">
              <Baby className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-teal-600 shrink-0" />
              <span>{badgeText}</span>
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 4-Step Interactive Nav Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {safeStages.map((stg, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-brand-teal-600 text-white border-brand-teal-600 shadow-[0_6px_20px_rgba(4,150,172,0.25)] sm:scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md whitespace-nowrap shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Step {stg.step}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'text-teal-100' : 'text-slate-500'
                    }`}
                  >
                    {stg.duration}
                  </span>
                </div>
                <h3
                  className={`text-sm font-bold leading-snug ${
                    isActive ? 'text-white' : 'text-brand-slate-900'
                  }`}
                >
                  {stg.stageName}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Showcase Card */}
        <ScrollReveal key={activeTab} animation="fade-up" duration={450}>
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-[0_4px_30px_rgba(4,150,172,0.06)] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Stage Details */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                    {activeStage.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-teal-600" />
                    <span>Timeline: {activeStage.duration}</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold font-heading text-brand-slate-900 leading-snug">
                  {activeStage.headline}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeStage.description}
                </p>

                {activeHighlights.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate-800">
                      Key Clinical Inclusions:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeHighlights.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-brand-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-xs transition text-xs sm:text-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call for Consultation</span>
                  </a>
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-teal-700 hover:text-brand-teal-800 px-4 py-2.5 rounded-xl hover:bg-brand-teal-50 transition"
                  >
                    <span>Book OPD Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Diagnostic & Quality Assurance Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-teal-50/70 to-slate-50/70 rounded-2xl p-5 sm:p-6 border border-brand-teal-200/70 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal-600 text-white flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-slate-900 text-sm">
                      Recommended Diagnostics
                    </h4>
                    <p className="text-xs text-slate-500">In-clinic Ultrasound & Lab</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Sonography &amp; Tests for this stage:
                  </span>
                  <p className="text-xs font-semibold text-brand-teal-800">
                    {activeStage.recommendedScans}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Personally performed by Dr. Kairavi Yagnik & Dr. Rut Shah</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Unhurried listening, compassionate answers to every question</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Flexible OPD timings with dedicated emergency coverage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

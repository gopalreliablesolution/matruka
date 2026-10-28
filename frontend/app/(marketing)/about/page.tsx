import React from 'react';
import Link from 'next/link';
import { Heart, Stethoscope, ShieldCheck, CheckCircle2, Phone, ArrowRight } from 'lucide-react';

async function getAboutData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/public/pages/about`, {
    next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export default async function AboutPage() {
  const page = await getAboutData();

  return (
    <div className="space-y-16 py-12 sm:py-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          About Matruka
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          {page?.heroTitle || 'About Matruka — Complete Care for Her'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
          {page?.heroSubtitle ||
            'Dedicated to women’s health, maternity excellence, and compassionate gynaecological care in Surat.'}
        </p>
      </section>

      {/* Main Philosophy & Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-brand-slate-900 font-heading">
              Our Vision & Medical Approach
            </h2>
            <p>
              Matruka was founded with a clear, patient-centric mission: to provide every woman in Surat with dignified, comprehensive, and scientifically grounded healthcare. Led by <strong>Dr. Kairavi Yagnik</strong> and <strong>Dr. Rut Shah</strong>—both Consultant Obstetricians, Gynaecologists, and fellowship-trained laparoscopic surgeons—our clinic combines clinical rigor with deep empathy.
            </p>
            <p>
              Whether guiding an expectant couple through the wonder of their first pregnancy, supporting high-risk pregnancies, performing minimally invasive keyhole surgeries, or counselling through the menopause transition, we provide an unhurried, reassuring clinical environment.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-brand-teal-50/60 rounded-xl border border-brand-teal-100">
                <h3 className="font-bold text-brand-teal-900 text-sm">Natural Birth Centric</h3>
                <p className="text-xs text-slate-600 mt-1">Spontaneous, supported normal deliveries prioritized with surgical readiness.</p>
              </div>
              <div className="p-4 bg-brand-gold-50/60 rounded-xl border border-brand-gold-200">
                <h3 className="font-bold text-brand-slate-900 text-sm">Minimally Invasive</h3>
                <p className="text-xs text-slate-600 mt-1">Laparoscopic keyhole procedures for rapid healing and minimal scarring.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-teal text-white p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-heading">The Matruka Promise</h3>
            <ul className="space-y-4 text-xs sm:text-sm text-brand-teal-100">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5" />
                <span>Zero fabricated claims — only verified clinical diagnostics and evidence-based treatments.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5" />
                <span>Direct consultations with Dr. Kairavi Yagnik and Dr. Rut Shah for every visit.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5" />
                <span>In-clinic high-resolution ultrasound (FOGSI certified) for immediate diagnostic answers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5" />
                <span>24x7 emergency medical readiness for obstetric onset and acute gynaecology.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-brand-teal-500/50">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-slate-900 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
              >
                <span>Read Doctor Profiles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2, Phone, Clock, ArrowLeft, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

const ALIAS_MAP: Record<string, string> = {
  'gynecological-endoscopic-surgeries': 'gynec-laparoscopic-surgeries',
  'gynec-laparoscopic-surgeries': 'gynecological-endoscopic-surgeries',
  'fertility-evaluation-workup': 'infertility-evaluation-management',
  'infertility-evaluation-management': 'fertility-evaluation-workup',
};

const FALLBACK_SERVICES: Record<string, any> = {
  'personalized-antenatal-care': {
    name: 'Personalized Antenatal Care (ANC)',
    slug: 'personalized-antenatal-care',
    category: 'Pregnancy & Maternity Care',
    shortDescription:
      'Structured, compassionate medical monitoring for expecting mothers from first trimester through to term.',
    fullDescription: `Every pregnancy is a unique and precious journey. At Matruka, our Personalized Antenatal Care is designed to support both mother and baby at every milestone.

We provide continuous clinical assessments, dietary and lifestyle counselling, vital monitoring, routine screening protocols, and early identification of gestational variations to ensure a safe, joyful pregnancy.

With direct oversight by Dr. Kairavi Yagnik & Dr. Rut Shah, mothers receive unhurried consultations where every question is answered with medical clarity and warmth.`,
    treatments: [
      'First trimester vitality and dating scans',
      'Nutritional and micronutrient guidance',
      'Blood pressure and gestational diabetes screening',
      'Fetal growth velocity evaluations',
      'Birth planning and emotional reassurance',
      'High-resolution ultrasound scans (NT & Anomaly)',
    ],
    benefits: [
      'Evidence-based maternal and fetal monitoring',
      'Direct consultation with senior MS Obstetricians',
      'Calm, unhurried checkup sessions in Surat',
      'Complete lab & sonography coordination under one roof',
    ],
  },
  'normal-delivery-cesarean-section': {
    name: 'Normal Delivery & Cesarean Section',
    slug: 'normal-delivery-cesarean-section',
    category: 'Pregnancy & Maternity Care',
    shortDescription:
      'Comprehensive intrapartum care prioritizing natural, dignified birth with complete surgical capability for emergency C-sections.',
    fullDescription: `At Matruka, we believe in supporting spontaneous normal delivery whenever clinically indicated while maintaining state-of-the-art surgical readiness for elective or emergency Cesarean sections.

Our labor rooms are equipped with modern fetal cardiotocography (CTG) monitors and staffed by dedicated obstetric teams ensuring maximum safety and respect for the mother.

We adhere strictly to evidence-based obstetric protocols, prioritizing skin-to-skin bonding and immediate lactation support in the golden hour after birth.`,
    treatments: [
      'Natural vaginal birth support in dedicated labor suites',
      'Continuous fetal electronic heart rate monitoring (CTG)',
      'Elective and emergency Cesarean section capability',
      'Immediate newborn care & golden hour skin-to-skin',
      'Perineal integrity preservation protocols',
    ],
    benefits: [
      'Patient-centered birth philosophy',
      '24x7 emergency obstetric readiness',
      'Clean, supportive delivery suites in Surat',
    ],
  },
  'painless-vaginal-delivery': {
    name: 'Painless Vaginal Delivery (Epidural Analgesia)',
    slug: 'painless-vaginal-delivery',
    category: 'Pregnancy & Maternity Care',
    shortDescription:
      'Modern labour analgesia (epidural) enabling comfortable, pain-managed vaginal childbirth under expert anaesthetic supervision.',
    fullDescription: `Labour pain should never prevent a mother from experiencing a calm, conscious, and empowered childbirth.

Painless vaginal delivery utilizing continuous lumbar epidural analgesia allows mothers to rest and conserve stamina through contractions while actively participating in the final delivery phase with significantly reduced discomfort.

Administered by board-certified anesthesiologists, our epidural protocols ensure continuous safety for both maternal blood pressure and fetal well-being.`,
    treatments: [
      'Pre-labour anaesthetic evaluation and consultation',
      'Continuous low-dose epidural infusion',
      'Active mobility and comfort preservation',
      'Real-time maternal-fetal parameter monitoring',
    ],
    benefits: [
      'Significant reduction in labour exhaustion',
      'Conscious, alert, and empowered birth experience',
      'Seamless conversion to surgical anaesthesia if C-section becomes necessary',
    ],
  },
  'high-risk-pregnancy-management': {
    name: 'High Risk Pregnancy Management',
    slug: 'high-risk-pregnancy-management',
    category: 'Pregnancy & Maternity Care',
    shortDescription:
      'Specialized vigilance for pregnancies complicated by hypertension, diabetes, multiple gestation, or previous obstetric difficulties.',
    fullDescription: `Certain pregnancies require advanced medical oversight. Whether due to gestational diabetes, pre-eclampsia, recurrent pregnancy loss, advanced maternal age, thyroid disorders, or twin pregnancies, our team at Matruka utilizes evidence-based risk stratification and frequent sonographic assessment to safeguard both mother and child.

We collaborate closely with maternal-fetal medicine principles to anticipate complications, plan timed interventions, and provide continuous reassurance to expectant families.`,
    treatments: [
      'Gestational diabetes mellitus (GDM) control',
      'Pregnancy-induced hypertension & pre-eclampsia protocols',
      'Cervical cerclage for cervical incompetence',
      'Intrauterine growth restriction (IUGR) surveillance with Doppler',
      'Multiple gestation monitoring',
    ],
    benefits: [
      'Intensive maternal & fetal surveillance',
      'Consultant-led decision making at every stage',
      'Close coordination with neonatal intensive care backup',
    ],
  },
  'gynecological-endoscopic-surgeries': {
    name: 'Gynecological Endoscopic & Laparoscopic Surgeries',
    slug: 'gynecological-endoscopic-surgeries',
    category: 'Laparoscopic Surgery',
    shortDescription:
      'Keyhole minimally invasive surgical techniques for fibroids, ovarian cysts, endometriosis, and tubal procedures with rapid recovery.',
    fullDescription: `Both Dr. Kairavi Yagnik and Dr. Rut Shah hold specialized Fellowships in Advanced Laparoscopic Surgery.

Through precision keyhole incisions of just 5mm to 10mm, complex gynaecological conditions are addressed with minimal tissue trauma, significantly reduced blood loss, lesser postoperative pain, and rapid return to everyday life.

Our modular operating theatre is equipped with high-definition endoscopic camera towers, electrosurgical generators, and HEPA laminar air filtration.`,
    treatments: [
      'Laparoscopic myomectomy (uterine fibroid removal)',
      'Laparoscopic ovarian cystectomy (dermoid, chocolate, or serous cysts)',
      'Advanced endometriosis excision and adhesiolysis',
      'Diagnostic laparoscopy & hysteroscopy for infertility evaluation',
      'Ectopic pregnancy laparoscopic management',
    ],
    benefits: [
      'Cosmetic 5mm micro-incisions with virtually invisible scars',
      'Discharge within 24 to 48 hours for most procedures',
      'Minimal blood loss and faster return to active routines',
    ],
  },
  'fertility-evaluation-workup': {
    name: 'Fertility Evaluation & Conception Workup',
    slug: 'fertility-evaluation-workup',
    category: 'Infertility & Conception',
    shortDescription:
      'Scientific, empathetic investigation of female and male factors, ovulation induction, and follicular monitoring.',
    fullDescription: `Facing conception challenges can be emotionally taxing. At Matruka, Dr. Kairavi Yagnik and Dr. Rut Shah conduct thorough diagnostic investigations into tubal patency, ovulatory function, uterine cavity health, and semen parameters to provide clear, honest medical pathways.

We emphasize natural conception optimization, structured ovulation induction, and endoscopic correction of barriers like polyps or tubal blocks before escalating to complex interventions.`,
    treatments: [
      'Baseline hormone evaluation and ovarian reserve (AMH) testing',
      'Serial sonographic follicular tracking',
      'Tubal patency assessment (HSG / Sonosalpingography)',
      'Ovulation induction protocols & timed intercourse planning',
      'Diagnostic hysteroscopy & laparoscopic tubal recanalization',
    ],
    benefits: [
      'Transparent, compassionate guidance without commercial pressure',
      'Personalized cycle tracking by female and male specialist surgeons',
      'High-resolution ultrasound imaging in-clinic',
    ],
  },
};

// Aliases mapped into FALLBACK_SERVICES
FALLBACK_SERVICES['gynec-laparoscopic-surgeries'] = FALLBACK_SERVICES['gynecological-endoscopic-surgeries'];
FALLBACK_SERVICES['infertility-evaluation-management'] = FALLBACK_SERVICES['fertility-evaluation-workup'];

async function getServiceDetail(slug: string) {
  // 1. Try fetching primary slug from backend API
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/services/${slug}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.service) {
        return data.data;
      }
    }
  } catch {
    // API failed or offline
  }

  // 2. Try fetching alias if available
  const aliasSlug = ALIAS_MAP[slug];
  if (aliasSlug) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/public/services/${aliasSlug}`, {
        next: { revalidate: 30 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.service) {
          return data.data;
        }
      }
    } catch {
      // Alias fetch failed
    }
  }

  // 3. Robust fallback: Return built-in comprehensive clinical service data
  const fallback = FALLBACK_SERVICES[slug] || (aliasSlug ? FALLBACK_SERVICES[aliasSlug] : null);
  if (fallback) {
    // Generate related services from fallback pool
    const related = Object.values(FALLBACK_SERVICES)
      .filter((s: any) => s.slug !== slug && s.slug !== aliasSlug)
      .slice(0, 3);
    return { service: fallback, related };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getServiceDetail(slug);
  const service = detail?.service;

  if (!service) {
    return {
      title: 'Clinical Services | Matruka Women’s Hospital Surat',
    };
  }

  return {
    title: `${service.name} | Matruka Women’s Hospital Surat`,
    description: service.shortDescription || `Comprehensive care for ${service.name} at Matruka Women’s Hospital, Surat.`,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getServiceDetail(slug);

  if (!detail || !detail.service) {
    notFound();
  }

  const { service, related } = detail;

  return (
    <div className="py-10 sm:py-16 space-y-10 sm:space-y-12 bg-white min-h-[75vh]">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/#services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0496AC] hover:text-[#037A8C] transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Specialities</span>
        </Link>
      </div>

      {/* Service Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3.5 max-w-4xl">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0496AC] bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-md">
            {service.category || 'Specialized Women’s Healthcare'}
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-900 leading-tight">
            {service.name}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Clinical Overview &amp; Care Methodology
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                {service.fullDescription}
              </div>

              {service.treatments && service.treatments.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-base font-bold font-heading text-slate-900">
                    Procedures &amp; Clinical Care Included
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.treatments.map((t: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#0496AC] flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.benefits && service.benefits.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-base font-bold font-heading text-slate-900">
                    Benefits &amp; Approach at Matruka
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.benefits.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 p-3.5 bg-teal-50/50 border border-teal-100/80 rounded-xl text-xs sm:text-sm text-brand-teal-900">
                        <CheckCircle2 className="w-4 h-4 text-[#0496AC] flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Consultation Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-[#0496AC] via-[#037A8C] to-[#025E6C] text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-4">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#F7CE6E] text-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">
                Direct OPD Desk
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                Consultation Info
              </h3>
              <p className="text-xs text-white/90 leading-relaxed">
                Consult directly with Dr. Kairavi Yagnik &amp; Dr. Rut Shah for this speciality during official clinic hours.
              </p>

              <div className="space-y-3 pt-2 text-xs border-t border-white/15">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#F7CE6E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">OPD Timings:</p>
                    <p className="text-white/85">10:00 AM - 1:00 PM &amp; 5:00 PM - 7:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#F7CE6E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Helpline / Inquiry:</p>
                    <a href="tel:7984882273" className="font-bold text-white hover:text-[#F7CE6E] transition">
                      +91 79848 82273
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 space-y-2">
                <a
                  href="tel:7984882273"
                  className="w-full flex items-center justify-center gap-2 bg-[#F7CE6E] hover:bg-[#F4BD42] text-slate-900 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call to Inquire</span>
                </a>

                <Link
                  href="/book-appointment"
                  className="w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm border border-white/20 transition-all active:scale-95"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Book Appointment Online</span>
                </Link>
              </div>
            </div>

            {/* Related Services */}
            {related && related.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-sm font-heading">
                  Related Specialities
                </h4>
                <div className="divide-y divide-slate-100">
                  {related.map((rel: any) => (
                    <Link
                      key={rel.slug || rel._id}
                      href={`/services/${rel.slug}`}
                      className="py-2.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:text-[#0496AC] transition group"
                    >
                      <span className="truncate max-w-[15rem] group-hover:translate-x-0.5 transition-transform">{rel.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0496AC] shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

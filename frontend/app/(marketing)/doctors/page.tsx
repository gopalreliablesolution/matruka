import React from 'react';
import Link from 'next/link';
import { Stethoscope, Clock, Phone, Award, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

async function getDoctorsData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/doctors`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export default async function DoctorsPage() {
  const doctors = await getDoctorsData();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Medical Leadership
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          Our Expert Doctors
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Meet Dr. Kairavi Yagnik & Dr. Rut Shah — Consultant Obstetricians, Gynaecologists, and Fellowship-trained Laparoscopic Surgeons in Surat.
        </p>
      </section>

      {/* Doctors Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {doctors.map((doc: any) => (
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
                    <h2 className="text-xl font-bold text-brand-slate-900 font-heading">
                      {doc.name}
                    </h2>
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

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-[11px] font-bold text-brand-slate-800 uppercase tracking-wider">
                    Fellowships & Certifications:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {(doc.fellowshipsAndCertifications || []).map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

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
                  <span>Detailed Biography</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${doc.phone || '7984882273'}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 px-3 py-1.5 rounded-lg transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Doctor</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



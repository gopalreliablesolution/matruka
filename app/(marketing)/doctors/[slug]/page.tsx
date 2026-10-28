import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Stethoscope, Clock, Phone, Award, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

async function getDoctorDetail(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/public/doctors/${slug}`, {
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

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorDetail(slug);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal-700 hover:text-brand-teal-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Doctors</span>
        </Link>
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-teal flex items-center justify-center font-bold text-3xl sm:text-4xl text-white flex-shrink-0 shadow-lg shadow-brand-teal-500/20">
              {doctor.name[4] || 'D'}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-brand-gold-600 bg-brand-gold-50 px-2.5 py-0.5 rounded border border-brand-gold-200">
                {doctor.qualifications}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-heading text-brand-slate-900">
                {doctor.name}
              </h1>
              <p className="text-sm font-semibold text-brand-teal-700">
                {doctor.designation}
              </p>
              <p className="text-xs text-slate-500">
                Specialization: {doctor.specialization} • {doctor.experienceYears}+ Years Clinical Dedication
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold font-heading text-brand-slate-900">
              Biography & Medical Background
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {doctor.bio}
            </p>
          </div>

          {doctor.areasOfExpertise && doctor.areasOfExpertise.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold font-heading text-brand-slate-900">
                Areas of Expertise & Focus
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.areasOfExpertise.map((exp: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doctor.fellowshipsAndCertifications && doctor.fellowshipsAndCertifications.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold font-heading text-brand-slate-900">
                Specialized Fellowships & Certifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.fellowshipsAndCertifications.map((cert: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-brand-teal-50/50 rounded-xl text-xs sm:text-sm text-brand-teal-900">
                    <Award className="w-4 h-4 text-brand-gold-500 flex-shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <Clock className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
              <span>Consultation Hours: <strong>{doctor.opdTimings}</strong></span>
            </div>

            <a
              href={`tel:${doctor.phone || '7984882273'}`}
              className="inline-flex items-center justify-center gap-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition"
            >
              <Phone className="w-4 h-4" />
              <span>Consult at Clinic: {doctor.phone || '7984882273'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Stethoscope, Clock, Phone, Award, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';
import DoctorAvatar from '@/components/DoctorAvatar';

async function getDoctorDetail(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/doctors/${slug}`, {
      cache: 'no-store',
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
            <DoctorAvatar
              name={doctor.name}
              profileImage={doctor.profileImage}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-lg shadow-brand-teal-500/20"
              textSize="text-3xl sm:text-4xl"
              showBadge={true}
            />

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
                Specialized Fellowships &amp; Certifications
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

          {/* Experience & Medical Journey Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold font-heading text-brand-slate-900">
                Experience &amp; Clinical Journey
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-brand-teal-800 border border-teal-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>{doctor.experienceYears || 10}+ Years Clinical Experience</span>
              </span>
            </div>

            {Array.isArray(doctor.experienceJourney) && doctor.experienceJourney.length > 0 ? (
              <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-brand-teal-500 before:to-teal-100">
                {doctor.experienceJourney.map((step: any, i: number) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-white border-[3px] border-brand-teal-600 shadow-xs" />
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-brand-teal-300 transition space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-brand-slate-900 font-heading">
                          {step.role}
                        </h4>
                        {step.year && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                            {step.year}
                          </span>
                        )}
                      </div>
                      {step.institution && (
                        <p className="text-xs font-semibold text-brand-teal-700">{step.institution}</p>
                      )}
                      {step.description && (
                        <p className="text-xs text-slate-600 leading-relaxed pt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-600">
                {doctor.experienceYears || 10}+ years of dedicated clinical practice in {doctor.specialization}.
              </div>
            )}
          </div>

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


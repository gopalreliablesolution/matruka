'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Check, CheckCircle2, ChevronDown, Clock, Loader2, Phone, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { publicApi } from '@/lib/api';

type Doctor = { _id?: string; name: string; specialization?: string };

const TIME_SLOTS = [
  'Morning OPD (10:00 AM - 1:00 PM)',
  'Evening OPD (5:00 PM - 7:00 PM)',
  'Flexible / Call to Confirm',
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BookAppointmentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    patientName: '',
    phone: '',
    email: '',
    city: 'Surat',
    doctor: 'Any Available Specialist',
    preferredDate: '',
    preferredTime: TIME_SLOTS[0],
    message: '',
  });

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(e.target as Node)) {
        setDoctorOpen(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target as Node)) {
        setTimeOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDoctorOpen(false);
        setTimeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const docRes = await publicApi.get('/doctors');
        if (!mounted) return;
        const list = docRes?.data?.data || docRes?.data || [];
        setDoctors(Array.isArray(list) ? list : []);
      } catch {
        // optional data; form still works without it
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    const name = form.patientName.trim();
    const phoneDigits = form.phone.replace(/\D/g, '');
    const email = form.email.trim();
    const city = form.city.trim();
    const message = form.message.trim();

    if (!name) next.patientName = 'Patient name is required.';
    else if (name.length < 2) next.patientName = 'Please enter a valid name (at least 2 characters).';
    else if (name.length > 100) next.patientName = 'Name must be 100 characters or less.';

    if (!phoneDigits) next.phone = 'Mobile number is required.';
    else if (!/^[6-9]\d{9}$/.test(phoneDigits)) next.phone = 'Enter a valid 10-digit Indian mobile number.';

    if (email && !isValidEmail(email)) next.email = 'Enter a valid email address.';
    else if (email.length > 120) next.email = 'Email must be 120 characters or less.';

    if (city.length > 60) next.city = 'City must be 60 characters or less.';

    if (form.preferredDate) {
      const min = todayYMD();
      if (form.preferredDate < min) next.preferredDate = 'Preferred date cannot be in the past.';
    }

    if (!form.preferredTime.trim()) next.preferredTime = 'Please select a preferred time slot.';

    if (message.length > 500) next.message = 'Message must be 500 characters or less.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patientName: form.patientName.trim(),
        phone: form.phone.replace(/\D/g, ''),
        email: form.email.trim().toLowerCase(),
        city: form.city.trim() || 'Surat',
        department: 'Obstetrics & Normal Delivery',
        doctor: form.doctor.trim() || 'Any Available Specialist',
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        message: form.message.trim(),
      };

      const res = await publicApi.post('/appointments', payload);
      if (res.data?.success) {
        setSuccess(true);
        toast.success(res.data?.message || 'Appointment request submitted successfully.');
        setForm({
          patientName: '',
          phone: '',
          email: '',
          city: 'Surat',
          doctor: 'Any Available Specialist',
          preferredDate: '',
          preferredTime: TIME_SLOTS[0],
          message: '',
        });
        setErrors({});
      } else {
        toast.error(res.data?.error || 'Unable to submit appointment request.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to submit appointment request. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-14">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center rounded-md bg-[#EAF8F8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#037B8D]">
                Book Consultation
              </span>
              <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-[#1A2C30] leading-tight">
                Book an Appointment
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">
                Submit your consultation request online. Our team will review your details and contact you to confirm the appointment slot.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-[#1A2C30]">Before you book</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 text-[#0496AC]" /><span>For urgent concerns, please call the clinic directly for faster assistance.</span></li>
                <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 text-[#0496AC]" /><span>Preferred date/time is a request. Final slot confirmation will be provided by the clinic.</span></li>
                <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-[#0496AC]" /><span>Share only basic details online. Avoid submitting sensitive medical records through this form.</span></li>
              </ul>
              <div className="rounded-xl bg-[#F0FBFB] border border-[#B9EBEE] p-4 text-sm text-[#09535B]">
                Need help now? <Link href="/contact" className="font-semibold underline underline-offset-2">Visit contact page</Link> for phone, WhatsApp, and directions.
              </div>
            </div>

            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">Request submitted successfully</h3>
                    <p className="mt-1 text-sm text-emerald-800 leading-6">
                      Thank you. Your appointment request has been received with status <strong>Pending</strong>. Our team will contact you to confirm the consultation.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Book another appointment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF8F8]">
                  <CalendarDays className="h-5 w-5 text-[#0496AC]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading text-[#1A2C30]">Appointment Request Form</h2>
                  <p className="text-sm text-slate-500">Fields marked with * are required.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="patientName">Patient Name *</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="patientName"
                        name="patientName"
                        value={form.patientName}
                        onChange={onChange}
                        maxLength={100}
                        className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition ${errors.patientName ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15'}`}
                        placeholder="Enter full name"
                        autoComplete="name"
                      />
                    </div>
                    {errors.patientName && <p className="mt-1 text-xs text-red-600">{errors.patientName}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="phone">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        inputMode="numeric"
                        maxLength={15}
                        className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition ${errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15'}`}
                        placeholder="10-digit mobile number"
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="email">Email (optional)</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      maxLength={120}
                      className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15'}`}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={onChange}
                      maxLength={60}
                      className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition ${errors.city ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15'}`}
                      placeholder="Surat"
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                  </div>
                </div>

                <div ref={doctorDropdownRef} className="relative">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="doctor">Preferred Doctor</label>
                  <button
                    id="doctor"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={doctorOpen}
                    onClick={() => setDoctorOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left text-sm outline-none transition focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15"
                  >
                    <span className="truncate text-slate-800">{form.doctor}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                        doctorOpen ? 'rotate-180 text-[#0496AC]' : ''
                      }`}
                    />
                  </button>

                  {doctorOpen && (
                    <div
                      role="listbox"
                      aria-label="Preferred Doctor"
                      className="absolute left-0 right-0 z-30 mt-1.5 max-h-60 w-full overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={form.doctor === 'Any Available Specialist'}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, doctor: 'Any Available Specialist' }));
                          setDoctorOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                          form.doctor === 'Any Available Specialist'
                            ? 'bg-[#0496AC]/10 font-semibold text-[#0496AC]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="break-words">Any Available Specialist</span>
                        {form.doctor === 'Any Available Specialist' && <Check className="h-4 w-4 shrink-0 text-[#0496AC]" />}
                      </button>

                      {doctors.map((d) => {
                        const isSelected = form.doctor === d.name;
                        return (
                          <button
                            key={d._id || d.name}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setForm((prev) => ({ ...prev, doctor: d.name }));
                              setDoctorOpen(false);
                            }}
                            className={`flex w-full items-start justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                              isSelected
                                ? 'bg-[#0496AC]/10 text-[#0496AC]'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className={`break-words ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                                {d.name}
                              </div>
                              {d.specialization && (
                                <div className="text-xs text-slate-500 break-words leading-snug mt-0.5">
                                  {d.specialization}
                                </div>
                              )}
                            </div>
                            {isSelected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0496AC]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="preferredDate">Preferred Date</label>
                    <input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={form.preferredDate}
                      onChange={onChange}
                      min={todayYMD()}
                      className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition ${errors.preferredDate ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15'}`}
                    />
                    {errors.preferredDate && <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p>}
                  </div>

                  <div ref={timeDropdownRef} className="relative">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="preferredTime">Preferred Time Slot *</label>
                    <button
                      id="preferredTime"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={timeOpen}
                      onClick={() => setTimeOpen((v) => !v)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-sm outline-none transition ${errors.preferredTime ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15'}`}
                    >
                      <span className="truncate text-slate-800">{form.preferredTime}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                          timeOpen ? 'rotate-180 text-[#0496AC]' : ''
                        }`}
                      />
                    </button>

                    {timeOpen && (
                      <div
                        role="listbox"
                        aria-label="Preferred Time Slot"
                        className="absolute left-0 right-0 z-30 mt-1.5 max-h-60 w-full overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                      >
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = form.preferredTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setForm((prev) => ({ ...prev, preferredTime: slot }));
                                setTimeOpen(false);
                              }}
                              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                                isSelected
                                  ? 'bg-[#0496AC]/10 font-semibold text-[#0496AC]'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="break-words">{slot}</span>
                              {isSelected && <Check className="h-4 w-4 shrink-0 text-[#0496AC]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {errors.preferredTime && <p className="mt-1 text-xs text-red-600">{errors.preferredTime}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="message">Message / Concern (optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={4}
                    maxLength={500}
                    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-[#0496AC] focus:ring-2 focus:ring-[#0496AC]/15'}`}
                    placeholder="Briefly describe your concern or preferred consultation reason (optional)."
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {errors.message ? <p className="text-xs text-red-600">{errors.message}</p> : <span />}
                    <p className="text-xs text-slate-400">{form.message.length}/500</p>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                  Please do not include emergency symptoms or sensitive medical history in detail here. In case of emergency, contact the clinic immediately.
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-1">
                  <p className="text-xs text-slate-500">By submitting, you agree to be contacted by Matruka Clinic for appointment confirmation.</p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0496AC] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#037B8D] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
                    <span>{loading ? 'Submitting...' : 'Submit Appointment Request'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

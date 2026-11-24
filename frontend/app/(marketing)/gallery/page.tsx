import React from 'react';
import { Camera } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';
import GalleryClient from '@/components/GalleryClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hospital Gallery & Virtual Tour | Matruka Women’s Hospital Surat',
  description:
    'Explore photographs of Matruka Women’s Hospital in Surat, featuring our advanced laparoscopic operation theatre, comfortable patient suites, ultrasound unit, and maternity amenities.',
};

async function getGalleryData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/gallery`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error('Failed to fetch public gallery:', e);
  }
  return { items: [], albums: [] };
}

export default async function GalleryPage() {
  const { items } = await getGalleryData();

  return (
    <div className="py-8 sm:py-12 space-y-8 min-h-[60vh]">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3.5 py-1.5 rounded-full border border-brand-teal-100">
          <Camera className="w-3.5 h-3.5 text-brand-teal-600" />
          <span>Hospital Tour & Facilities</span>
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-brand-slate-900 tracking-tight">
          Matruka Hospital Gallery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Take a visual tour inside our modern facility at Solaris Cure, VIP Road Surat, including our consultation suites, ultrasound room, modular OT, and patient suites.
        </p>
      </section>

      {/* Interactive Gallery Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryClient items={items || []} />
      </section>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';
import MediaClient from '@/components/MediaClient';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/pages/media`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data?.data) {
        return {
          title: data.data.seoTitle || `${data.data.heroTitle || 'Media & Video Centre'} | Matruka Women’s Hospital`,
          description:
            data.data.seoDescription ||
            data.data.heroSubtitle ||
            'Explore educational healthcare videos and clinical walkthroughs by our specialists in Surat.',
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  return {
    title: 'Media & Video Centre | Matruka Women’s Hospital Surat',
    description:
      'Watch educational healthcare videos and clinical walkthroughs by Dr. Kairavi Yagnik & Dr. Rut Shah at Matruka Women’s Hospital, Surat.',
  };
}

const DEFAULT_VIDEOS = [
  {
    _id: 'default-v1',
    title: 'Advanced Gynec Laparoscopic Surgery: Benefits of Keyhole Surgery',
    youtubeId: 'p7_A_kE0t_o',
    youtubeUrl: 'https://www.youtube.com',
    category: 'Laparoscopic Surgery',
    description:
      'Understanding how minimally invasive 3D laparoscopic surgery enables quick healing, minimal scarring, and rapid discharge.',
  },
  {
    _id: 'default-v2',
    title: 'Essential Antenatal Care & Ultrasound Scans During Pregnancy',
    youtubeId: 'p7_A_kE0t_o',
    youtubeUrl: 'https://www.youtube.com',
    category: 'Pregnancy Care',
    description:
      'A comprehensive guide on anomaly scans, fetal Doppler, and nutrition planning for a safe and joyful delivery.',
  },
  {
    _id: 'default-v3',
    title: 'Painless Delivery (Epidural Analgesia): Myths vs Facts',
    youtubeId: 'p7_A_kE0t_o',
    youtubeUrl: 'https://www.youtube.com',
    category: 'Normal Delivery',
    description:
      'Expert insights into labour analgesia, ensuring patient comfort and safety during normal vaginal birth.',
  },
];

async function getMediaData() {
  let videos: any[] = [];
  let galleryItems: any[] = [];
  let pageData: any = null;

  try {
    const [videosRes, galleryRes, pageRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/public/videos`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/gallery`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/pages/media`, { cache: 'no-store' }),
    ]);

    if (videosRes.ok) {
      const vData = await videosRes.json();
      videos = vData.data || [];
    }

    if (galleryRes.ok) {
      const gData = await galleryRes.json();
      galleryItems = gData.data?.items || [];
    }

    if (pageRes.ok) {
      const pData = await pageRes.json();
      pageData = pData.data || null;
    }
  } catch (err) {
    console.error('Failed to fetch media data:', err);
  }

  return {
    videos: videos.length > 0 ? videos : DEFAULT_VIDEOS,
    galleryItems,
    pageData,
  };
}

export default async function MediaPage() {
  const { videos, galleryItems, pageData } = await getMediaData();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner with Matruka Signature Teal Gradient */}
      <section className="bg-gradient-to-r from-[#0496AC] via-[#037A8C] to-[#025E6C] text-white py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#F7CE6E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F7CE6E]" />
            <span>Hospital Media &amp; Resources</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-white">
            {pageData?.heroTitle || 'MatruKa Media Centre'}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {pageData?.heroSubtitle ||
              'Explore educational video guides by our specialists, hospital infrastructure walkthroughs, and clinical awareness resources in Surat.'}
          </p>
        </div>
      </section>

      {/* Main Interactive Media Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <MediaClient videos={videos} galleryItems={galleryItems} />
      </div>
    </div>
  );
}

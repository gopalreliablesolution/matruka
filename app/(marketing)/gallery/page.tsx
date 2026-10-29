import React from 'react';
import { Image as ImageIcon, Camera } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

async function getGalleryData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/gallery`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error(e);
  }
  return { items: [], albums: [] };
}

export default async function GalleryPage() {
  const { items, albums } = await getGalleryData();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Clinic Tour
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          Matruka Clinic Gallery
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Take a look inside our modern facility at Solaris Cure, VIP Road Surat, including our consultation suites, ultrasound room, and maternity amenities.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm bg-slate-50 rounded-3xl border border-slate-200">
            No gallery photographs published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="h-52 bg-slate-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      item.imageUrl && item.imageUrl.startsWith('/')
                        ? `${BACKEND_URL}${item.imageUrl}`
                        : item.imageUrl || '/images/hero/maternity-cutout.png'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-brand-slate-900 text-sm font-heading">{item.title}</h3>
                  {item.caption && <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}



import React from 'react';
import { MessageSquareQuote, Star } from 'lucide-react';

async function getTestimonialsData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/public/testimonials`, {
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

export default async function TestimonialsPage() {
  const testimonials = await getTestimonialsData();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Patient Stories
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          Patient Experiences & Reviews
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Read genuine feedback and experiences shared by mothers and patients treated by Dr. Kairavi Yagnik & Dr. Rut Shah.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {testimonials.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm bg-slate-50 rounded-3xl border border-slate-200">
            No testimonials published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t: any) => (
              <div
                key={t._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-brand-teal-300 transition"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-brand-gold-500">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold-500 text-brand-gold-500" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{t.story}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100">
                  <h3 className="font-bold text-brand-slate-900 text-sm font-heading">{t.patientName}</h3>
                  <p className="text-xs text-slate-500">{t.location}</p>
                  <p className="text-xs font-semibold text-brand-teal-700 mt-1">
                    Care: {t.treatmentReceived}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}



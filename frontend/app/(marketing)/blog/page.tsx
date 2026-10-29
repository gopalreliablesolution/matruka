import React from 'react';
import Link from 'next/link';
import { BookOpen, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BACKEND_URL, resolveImageUrl } from '@/lib/api';

async function getBlogsData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/blogs`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.error(e);
  }
  return { blogs: [], categories: [] };
}

export default async function BlogPage() {
  const { blogs, categories } = await getBlogsData();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          Health Knowledge
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900">
          Pregnancy & Women’s Health Articles
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Medically reviewed guides on antenatal care, nutrition, high-risk pregnancy, minimally invasive laparoscopic surgery, and menstrual wellness.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {blogs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm bg-slate-50 rounded-3xl border border-slate-200">
            No articles published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((b: any) => (
              <article
                key={b._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="h-48 bg-slate-100 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveImageUrl(b.featuredImage)}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-brand-teal-800 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {b.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{b.author}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{b.readTime || '4 min read'}</span>
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-brand-slate-900 font-heading group-hover:text-brand-teal-600 transition-colors line-clamp-2">
                      {b.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/blog/${b.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}



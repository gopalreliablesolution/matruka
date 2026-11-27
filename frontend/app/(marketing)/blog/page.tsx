import React from 'react';
import Link from 'next/link';
import { BookOpen, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BACKEND_URL, resolveImageUrl } from '@/lib/api';
import { parseBlogItem } from '@/lib/blogUtils';
import SafeImage from '@/components/SafeImage';

async function getBlogsData() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/blogs`, {
      cache: 'no-store',
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
  const { blogs: rawBlogs } = await getBlogsData();
  const blogs = (rawBlogs || []).map(parseBlogItem);

  return (
    <div className="py-6 sm:py-8 space-y-6">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3.5 py-1.5 rounded-full border border-brand-teal-100">
          BLOGS
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-brand-slate-900 leading-tight">
          Pregnancy &amp; Women&apos;s Health Blogs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Medically reviewed health blogs and clinical guides on antenatal care, nutrition, high-risk pregnancy, minimally invasive laparoscopic surgery, and menstrual wellness.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {blogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-200">
            No articles published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b: any) => {
              const isImageOnly = b.showImage && !b.showContent;
              const isContentOnly = !b.showImage && b.showContent;
              const cleanExcerpt = (b.excerpt || '').replace(/<[^>]*>/g, '').trim();

              return isImageOnly ? (
                /* CASE 1: ONLY IMAGE (Infographic / Poster - Full Card Coverage like Gallery) */
                <article
                  key={b._id}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:border-brand-teal-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative min-h-[280px]"
                >
                  <Link
                    href={`/blog/${b.slug}`}
                    className="relative w-full h-full flex-1 overflow-hidden block"
                    title={b.title}
                  >
                    <SafeImage
                      src={resolveImageUrl(b.featuredImage, '/logo.png')}
                      fallbackSrc="/logo.png"
                      alt={b.title || 'Health Education Poster'}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      fallbackClassName="w-full h-full object-contain p-6 bg-slate-50"
                    />

                    {b.category && (
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-teal-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-xs z-10">
                        {b.category}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/60 px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/20 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span>Read Blog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </article>
              ) : isContentOnly ? (
                /* CASE 2: ONLY CONTENT (Text Article without Image) */
                <article
                  key={b._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between h-full p-6 group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {b.category && (
                        <span className="text-xs font-bold uppercase tracking-wider bg-brand-teal-50 border border-brand-teal-200/80 text-brand-teal-800 px-2.5 py-1 rounded-md">
                          {b.category}
                        </span>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-brand-teal-600" />
                          <span>{b.author}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{b.readTime || '4 min read'}</span>
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-brand-slate-900 font-heading group-hover:text-brand-teal-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${b.slug}`}>{b.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-4 leading-relaxed">
                      {cleanExcerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <Link
                      href={`/blog/${b.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 group-hover:translate-x-1 transition-all"
                    >
                      <span>Read Full Blog</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ) : (
                /* CASE 3: STANDARD (Image + Content) */
                <article
                  key={b._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="h-48 bg-slate-100 overflow-hidden relative">
                      <SafeImage
                        src={resolveImageUrl(b.featuredImage, '/logo.png')}
                        fallbackSrc="/logo.png"
                        alt={b.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        fallbackClassName="w-full h-full object-contain p-6 bg-slate-50"
                      />
                      {b.category && (
                        <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider bg-white/90 text-brand-teal-800 px-2.5 py-1 rounded-md backdrop-blur-xs">
                          {b.category}
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
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
                        <Link href={`/blog/${b.slug}`}>{b.title}</Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {cleanExcerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <Link
                      href={`/blog/${b.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 group-hover:translate-x-1 transition-all"
                    >
                      <span>Read Full Blog</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}



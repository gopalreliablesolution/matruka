'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import { parseBlogItem, ParsedBlog } from '@/lib/blogUtils';
import ScrollReveal from './ScrollReveal';

export interface BlogPostData {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  imageAlt?: string;
  author?: string;
  category?: string;
  publishedAt?: string | Date;
  readTime?: string;
  displayMode?: 'both' | 'image_only' | 'content_only';
  showContent?: boolean;
  showImage?: boolean;
}

interface LatestBlogsSectionProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  btnText?: string;
  btnLink?: string;
  blogs?: BlogPostData[];
}

const DEFAULT_BLOGS: BlogPostData[] = [
  {
    title: 'Essential Antenatal Tests & Ultrasound Scans: A Trimester Guide',
    slug: 'essential-antenatal-tests-ultrasound-scans',
    excerpt:
      'Understanding why NT scans, anomaly detection, and growth Doppler are crucial during your pregnancy journey for maternal and fetal safety.',
    author: 'Dr. Kairavi Yagnik',
    category: 'Pregnancy Care',
    publishedAt: new Date().toISOString(),
    readTime: '5 min read',
    featuredImage: '/images/blogs/antenatal-guide.jpg',
  },
  {
    title: 'Painless Delivery (Epidural Analgesia): Myths vs. Facts',
    slug: 'painless-delivery-epidural-myths-facts',
    excerpt:
      'Everything expecting mothers should know about pain relief during labor, epidural safety, and maintaining full control during birth.',
    author: 'Dr. Rut Shah',
    category: 'Childbirth',
    publishedAt: new Date().toISOString(),
    readTime: '4 min read',
    featuredImage: '/images/blogs/painless-delivery.jpg',
  },
  {
    title: 'Advanced Gynec Laparoscopy: Benefits of Keyhole Surgery',
    slug: 'advanced-gynec-laparoscopy-benefits',
    excerpt:
      'How minimally invasive 3D laparoscopic techniques enable faster healing, minimal scarring, and quick recovery for ovarian cysts and fibroids.',
    author: 'Dr. Rut Shah',
    category: 'Laparoscopic Surgery',
    publishedAt: new Date().toISOString(),
    readTime: '6 min read',
    featuredImage: '/images/blogs/laparoscopy-guide.jpg',
  },
];

export default function LatestBlogsSection({
  badgeText = 'BLOGS',
  title = 'Doctor-Authored Health Blogs & Tips',
  subtitle = 'Evidence-based advice on trimester wellness, gynaecological health, and post-delivery care written directly by our clinic specialists in Surat.',
  btnText = 'Explore All Health Blogs',
  btnLink = '/blog',
  blogs = [],
}: LatestBlogsSectionProps) {
  const displayBlogs = (
    blogs && blogs.length > 0 ? blogs.slice(0, 3) : DEFAULT_BLOGS
  ).map(parseBlogItem);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
              <BookOpen className="w-3.5 h-3.5 text-brand-teal-600" />
              <span>{badgeText}</span>
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-heading text-brand-slate-900 mt-2 leading-snug">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-2 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Blogs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {displayBlogs.map((b, idx) => {
            const isImageOnly = b.showImage && !b.showContent;
            const isContentOnly = !b.showImage && b.showContent;
            const cleanExcerpt = (b.excerpt || '').replace(/<[^>]*>/g, '').trim();

            return (
              <ScrollReveal key={b._id || idx} animation="fade-up" delay={idx * 100} duration={500}>
                {/* CASE 1: ONLY IMAGE (Infographic / Poster - Full Card Coverage like Gallery) */}
                {isImageOnly ? (
                  <article className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:border-brand-teal-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative min-h-[280px]">
                    <Link
                      href={`/blog/${b.slug}`}
                      className="relative w-full h-full flex-1 overflow-hidden block"
                      title={b.title}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveImageUrl(b.featuredImage)}
                        alt={b.title || 'Health Education Poster'}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/images/banners/maternity-hero.jpg';
                        }}
                      />

                      {b.category && (
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs z-10">
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
                  <article className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:border-brand-teal-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full p-6">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {b.category && (
                          <span className="bg-brand-teal-50 border border-brand-teal-200/80 text-brand-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                            {b.category}
                          </span>
                        )}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-brand-teal-600" />
                            <span>{b.author || 'Dr. Kairavi Yagnik'}</span>
                          </span>
                          {b.readTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{b.readTime}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-brand-slate-900 text-base sm:text-lg leading-snug group-hover:text-brand-teal-700 transition-colors">
                        <Link href={`/blog/${b.slug}`}>{b.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">
                        {cleanExcerpt}
                      </p>
                    </div>

                    <div className="px-0 pb-0 pt-4 border-t border-slate-100 mt-4">
                      <Link
                        href={`/blog/${b.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal-700 hover:text-brand-teal-800 group-hover:translate-x-1 transition-all"
                      >
                        <span>Read Full Blog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ) : (
                  /* CASE 3: STANDARD (Image + Content) */
                  <article className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:border-brand-teal-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveImageUrl(b.featuredImage)}
                          alt={b.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/images/banners/maternity-hero.jpg';
                          }}
                        />
                        {b.category && (
                          <span className="absolute top-3 left-3 bg-white/95 text-brand-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                            {b.category}
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-brand-teal-600" />
                            <span>{b.author || 'Dr. Kairavi Yagnik'}</span>
                          </span>
                          {b.readTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{b.readTime}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-brand-slate-900 text-base leading-snug group-hover:text-brand-teal-700 transition-colors">
                          <Link href={`/blog/${b.slug}`}>
                            {b.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {cleanExcerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 mt-2">
                      <Link
                        href={`/blog/${b.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal-700 hover:text-brand-teal-800 group-hover:translate-x-1 transition-all"
                      >
                        <span>Read Full Blog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                )}
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Articles */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="text-center mt-10 sm:mt-12">
            <Link
              href={btnLink}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal-700 hover:text-brand-teal-800 group bg-white hover:bg-brand-teal-50 px-6 py-3 rounded-xl border border-brand-teal-200 transition shadow-xs"
            >
              <span>{btnText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

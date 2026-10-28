import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { User, Clock, ArrowLeft, ArrowRight, Share2, Eye } from 'lucide-react';

async function getBlogDetail(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/public/blogs/${slug}`, {
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

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getBlogDetail(slug);

  if (!detail || !detail.blog) {
    notFound();
  }

  const { blog, related } = detail;

  return (
    <article className="py-12 sm:py-16 space-y-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal-700 hover:text-brand-teal-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-md">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-brand-slate-900 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
          <span className="flex items-center gap-1.5 font-semibold text-brand-slate-800">
            <User className="w-4 h-4 text-brand-teal-600" />
            <span>By {blog.author}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{blog.readTime || '4 min read'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-slate-400" />
            <span>{blog.views || 1} views</span>
          </span>
        </div>
      </header>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden h-72 sm:h-96 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                blog.featuredImage && blog.featuredImage.startsWith('/')
                  ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + blog.featuredImage
                  : blog.featuredImage || '/images/hero/maternity-cutout.png'
              }
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
            {blog.content}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Tags:</span>
              {blog.tags.map((t: string, i: number) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Posts */}
      {related && related.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <h3 className="text-lg font-bold font-heading text-brand-slate-900 mb-4">
            Related Health Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel: any) => (
              <Link
                key={rel._id}
                href={`/blog/${rel.slug}`}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-brand-teal-300 transition space-y-1 group"
              >
                <span className="text-[10px] font-bold uppercase text-brand-teal-700">
                  {rel.category}
                </span>
                <h4 className="font-bold text-sm text-brand-slate-900 group-hover:text-brand-teal-600 transition-colors line-clamp-1">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}


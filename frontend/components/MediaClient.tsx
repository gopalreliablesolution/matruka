'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Video as VideoIcon,
  Camera,
  Play,
  X,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import GalleryLightbox from './GalleryLightbox';

export interface VideoItem {
  _id?: string;
  title: string;
  youtubeUrl?: string;
  youtubeId: string;
  thumbnailUrl?: string;
  category?: string;
  description?: string;
}

export interface GalleryItem {
  _id?: string;
  title?: string;
  imageUrl: string;
  category?: string;
  caption?: string;
}

interface MediaClientProps {
  videos: VideoItem[];
  galleryItems: GalleryItem[];
}

export default function MediaClient({ videos = [], galleryItems = [] }: MediaClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'gallery'>('all');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayVideos = videos;
  const displayGallery = galleryItems;

  return (
    <div className="space-y-12">
      {/* Category Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xs ${
            activeTab === 'all'
              ? 'bg-[#0496AC] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles size={15} />
          <span>All Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xs ${
            activeTab === 'videos'
              ? 'bg-[#0496AC] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <VideoIcon size={15} />
          <span>Video Guides ({displayVideos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xs ${
            activeTab === 'gallery'
              ? 'bg-[#0496AC] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Camera size={15} />
          <span>Hospital Tour ({displayGallery.length})</span>
        </button>
      </div>

      {/* SECTION 1: VIDEOS */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
                <VideoIcon className="text-[#0496AC] w-5 h-5 sm:w-6 sm:h-6" />
                <span>Doctor Video Guides &amp; Awareness</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Medical advice on prenatal care, keyhole laparoscopic surgery, and women’s health.
              </p>
            </div>
            {displayVideos.length > 0 && (
              <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 bg-teal-50 text-brand-teal-800 rounded-full border border-teal-200">
                {displayVideos.length} Videos
              </span>
            )}
          </div>

          {displayVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayVideos.map((v) => {
                const thumb =
                  v.thumbnailUrl ||
                  (v.youtubeId
                    ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`
                    : '/images/banners/maternity-hero.jpg');

                return (
                  <div
                    key={v._id || v.youtubeId}
                    className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Thumbnail with Play Button */}
                    <div
                      onClick={() => setActiveVideoId(v.youtubeId)}
                      className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={v.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/icon.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0496AC] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={20} className="fill-white translate-x-0.5" />
                        </div>
                      </div>
                      {v.category && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white px-2.5 py-1 rounded-md backdrop-blur-xs">
                          {v.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-[#0496AC] transition-colors">
                          {v.title}
                        </h3>
                        {v.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                            {v.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveVideoId(v.youtubeId)}
                          className="text-xs font-bold text-[#0496AC] hover:text-[#037A8C] flex items-center gap-1 cursor-pointer"
                        >
                          <Play size={12} className="fill-[#0496AC]" />
                          <span>Watch Video</span>
                        </button>
                        {v.youtubeUrl && (
                          <a
                            href={v.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
                          >
                            <span>YouTube</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-600">Video guides are being updated. Check back soon!</p>
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: PHOTO GALLERY */}
      {(activeTab === 'all' || activeTab === 'gallery') && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
                <Camera className="text-[#0496AC] w-5 h-5 sm:w-6 sm:h-6" />
                <span>Hospital Infrastructure Tour</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visual walkthrough of our sterile modular OT, ultrasound suite, consultation chambers, and patient suites.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0496AC] hover:text-[#037A8C] transition group shrink-0"
            >
              <span>Full Gallery</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayGallery.slice(0, 8).map((img, idx) => (
              <div
                key={img._id || idx}
                onClick={() => setLightboxIndex(idx)}
                className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(img.imageUrl, '/icon.png')}
                    alt={img.title || 'Hospital Photo'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/icon.png';
                    }}
                  />
                  {img.category && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {img.category}
                    </span>
                  )}
                </div>
                {img.title && (
                  <div className="p-3">
                    <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-[#0496AC] transition-colors">
                      {img.title}
                    </h4>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-teal-50 hover:bg-brand-teal-100 text-[#0496AC] border border-brand-teal-200 font-bold text-xs sm:text-sm transition shadow-xs hover:shadow"
            >
              <Camera size={16} />
              <span>Explore All Hospital Photographs</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Video Lightbox Modal */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div
            onClick={() => setActiveVideoId(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveVideoId(null)}
              aria-label="Close video"
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          isOpen={lightboxIndex !== null}
          items={displayGallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : displayGallery.length - 1))
          }
          onNext={() =>
            setLightboxIndex((prev) => (prev! < displayGallery.length - 1 ? prev! + 1 : 0))
          }
        />
      )}
    </div>
  );
}

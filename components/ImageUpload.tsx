'use client';

import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  altText?: string;
}

export default function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  altText = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);

    try {
      setUploading(true);
      const res = await adminApi.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const fileUrl = res.data.data.url;
        setPreview(fileUrl);
        onChange(fileUrl);
        toast.success('File stored directly on server disk!');
      } else {
        toast.error(res.data.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.error || 'Failed to upload image to server');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-brand-slate-700">{label}</label>}

      {preview ? (
        <div className="relative inline-block border-2 border-slate-200 rounded-xl overflow-hidden group bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.startsWith('/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${preview}` : preview}
            alt="Preview"
            className="w-48 h-32 object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="p-1.5 text-[11px] text-slate-500 truncate max-w-[12rem] bg-white border-t border-slate-100">
            {preview}
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 hover:border-brand-teal-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-brand-teal-50/20 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            {uploading ? (
              <div className="flex items-center gap-2 text-brand-teal-600 font-medium text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving directly to server disk...</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 text-brand-teal-600" />
                <p className="text-xs text-brand-slate-600 font-medium">
                  <span className="font-semibold text-brand-teal-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP, SVG (Max 10MB - Local Server Storage)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp, image/svg+xml, application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}


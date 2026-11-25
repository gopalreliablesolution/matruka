'use client';

import React, { useEffect, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { adminApi, resolveImageUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  altText?: string;
  isDarkPreview?: boolean;
}

export default function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  altText = '',
  isDarkPreview = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');

  // Keep internal preview state in sync with incoming value prop
  useEffect(() => {
    setPreview(value || '');
  }, [value]);

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
        toast.success('Image uploaded successfully!');
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
      {label && <label className="block text-xs font-semibold text-gray-700">{label}</label>}

      {preview ? (
        <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden group shadow-xs">
          {/* Preview Container with dark mode support for white logos */}
          <div className={`p-4 flex items-center justify-center min-w-[220px] min-h-[90px] ${isDarkPreview ? 'bg-[#0496AC]' : 'bg-slate-50'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageUrl(preview, '/logo.png')}
              alt="Preview"
              className="h-16 w-auto max-w-[220px] object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.png';
              }}
            />
          </div>

          {/* Remove / Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md cursor-pointer z-10"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* URL Tag */}
          <div className={`px-2.5 py-1 text-[11px] truncate max-w-[220px] border-t font-mono ${isDarkPreview ? 'bg-[#037A8C] text-white border-teal-700' : 'bg-white text-slate-500 border-slate-100'}`}>
            {preview}
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full min-h-[110px] border-2 border-dashed border-slate-300 hover:border-brand-teal-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-brand-teal-50/20 transition-colors">
          <div className="flex flex-col items-center justify-center py-4 text-center px-4">
            {uploading ? (
              <div className="flex items-center gap-2 text-brand-teal-600 font-medium text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to server...</span>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 mb-1.5 text-brand-teal-600" />
                <p className="text-xs text-brand-slate-600 font-medium">
                  <span className="font-semibold text-brand-teal-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, SVG (Max 10MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}

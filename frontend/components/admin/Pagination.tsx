'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = '',
}: PaginationProps) {
  if (totalItems <= 0) return null;

  const validTotalPages = Math.max(totalPages, 1);
  const startRecord = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endRecord = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col items-center justify-between gap-3 border-t border-[#D8E1E4] bg-white px-4 py-3 sm:flex-row rounded-b-2xl ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-[#637C85]">
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="rounded-md border border-[#D8E1E4] bg-white px-2 py-1 text-xs font-semibold text-[#344B53] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              aria-label="Rows per page"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <span>
          Showing <strong className="font-semibold text-[#344B53]">{startRecord}</strong> to{' '}
          <strong className="font-semibold text-[#344B53]">{endRecord}</strong> of{' '}
          <strong className="font-semibold text-[#344B53]">{totalItems}</strong> records
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs text-[#637C85]">
          Page <strong className="font-semibold text-[#344B53]">{currentPage}</strong> of{' '}
          <strong className="font-semibold text-[#344B53]">{validTotalPages}</strong>
        </span>

        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-[#D8E1E4] bg-white px-3 py-1.5 text-xs font-semibold text-[#637C85] shadow-xs transition hover:bg-[#F6F8F9] hover:text-[#344B53] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        {/* Quick page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: validTotalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === validTotalPages || Math.abs(p - currentPage) <= 1)
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;

              return (
                <React.Fragment key={p}>
                  {showEllipsis && <span className="px-1 text-xs text-slate-400">...</span>}
                  <button
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      p === currentPage
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          type="button"
          disabled={currentPage >= validTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-[#D8E1E4] bg-white px-3 py-1.5 text-xs font-semibold text-[#637C85] shadow-xs transition hover:bg-[#F6F8F9] hover:text-[#344B53] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useId, useRef } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const variantColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    info: 'bg-primary hover:bg-primary-dark text-white',
  };

  const iconColors = {
    danger: 'text-red-600 bg-red-50 ring-red-100',
    warning: 'text-amber-600 bg-amber-50 ring-amber-100',
    info: 'text-primary bg-primary-light/20 ring-primary-light/40',
  };

  return (
    <div
      className="admin-fade-in fixed inset-0 z-[10001] !m-0 !mt-0 flex items-center justify-center bg-[#0B2227]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="admin-zoom-in w-full max-w-sm overflow-hidden rounded-2xl border border-[#E1E9EB] bg-white shadow-[0_24px_70px_rgba(6,35,40,0.24)]"
      >
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className={`rounded-full p-2.5 ring-1 ${iconColors[variant]}`}>
              <AlertTriangle size={22} />
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-1.5 text-[#8AA3AD] transition hover:bg-[#F0F4F5] hover:text-[#344B53] disabled:opacity-50"
              aria-label="Close confirmation dialog"
            >
              <X size={19} />
            </button>
          </div>

          <h3
            id={titleId}
            className="font-heading text-xl font-bold text-[#1A2C30]"
          >
            {title}
          </h3>
          <p
            id={messageId}
            className="mt-2 text-sm leading-relaxed text-[#637C85]"
          >
            {message}
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 border-t border-[#E7EDEF] bg-[#F8FAFB] p-4">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:flex-1 inline-flex items-center justify-center rounded-lg border border-[#D8E1E4] bg-white px-4 py-2 text-[13px] sm:text-sm font-semibold text-[#4D636B] shadow-sm transition hover:bg-[#F6F8F9] disabled:opacity-50 whitespace-nowrap min-h-[2.375rem]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] sm:text-sm font-semibold shadow-sm transition disabled:opacity-50 whitespace-nowrap min-h-[2.375rem] ${variantColors[variant]}`}
          >
            {loading && <Loader2 size={15} className="animate-spin shrink-0" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

import Link from 'next/link';
import { Home, Phone, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-teal-50/50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-100 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand-teal-50 flex items-center justify-center text-brand-teal-700 mb-6">
          <Search className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          The page or medical information you are looking for does not exist or may have been moved.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#0496AC] hover:bg-[#037A8C] text-white font-semibold text-sm transition shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/#services"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
          >
            <span>View Clinical Services</span>
          </Link>
          <a
            href="tel:+917984882273"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-brand-teal-700 hover:text-brand-teal-800 font-medium text-xs transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Need assistance? Call +91 79848 82273</span>
          </a>
        </div>
      </div>
    </div>
  );
}

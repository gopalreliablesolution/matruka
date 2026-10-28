import Link from 'next/link';
import { Home, ArrowLeft, Phone, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-matruka-lightAqua/40 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-100 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-matruka-lightAqua flex items-center justify-center text-matruka-teal mb-6">
          <Search className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-matruka-gold bg-amber-50 px-3 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="text-3xl font-bold font-serif text-matruka-tealDark mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          The page or medical information you are looking for does not exist or may have been moved.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-matruka-teal hover:bg-matruka-tealDark text-white font-semibold text-sm transition shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
          <Link
            href="/services"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition"
          >
            View Clinical Services
          </Link>
          <a
            href="tel:+917984882273"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-matruka-teal hover:text-matruka-tealDark font-medium text-xs transition"
          >
            <Phone className="w-3.5 h-3.5" />
            Need assistance? Call +91 79848 82273
          </a>
        </div>
      </div>
    </div>
  );
}


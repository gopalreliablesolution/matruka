import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Matruka — Complete Care for Her | Obstetrician & Gynaecology Clinic Surat',
  description:
    'Dedicated women’s healthcare, pregnancy, and laparoscopic surgery clinic in Surat led by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road.',
  keywords: [
    'gynecologist surat',
    'maternity clinic surat',
    'Dr Kairavi Yagnik',
    'Dr Rut Shah',
    'normal delivery surat',
    'laparoscopic hysterectomy surat',
    'infertility clinic surat',
  ],
  authors: [{ name: 'Matruka Clinic' }],
  metadataBase: new URL('https://www.matruka.in'),
  icons: {
    icon: [
      { url: '/favicon.png?v=2', type: 'image/png' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    shortcut: '/favicon.png?v=2',
    apple: '/apple-icon.png?v=2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-white text-brand-slate-700 font-sans antialiased selection:bg-brand-teal-100 selection:text-brand-teal-700">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}


import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BACKEND_URL } from '@/lib/api';

// Fetch settings on server for initial render
async function getSettings() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/settings`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // fallback defaults
  }
  return {
    clinicName: 'Matruka',
    gujaratiName: 'માતૃકા',
    appointmentPhone: '7984882273',
    opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
    address: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
  };
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}



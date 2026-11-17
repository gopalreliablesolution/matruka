import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BACKEND_URL } from '@/lib/api';

async function getLayoutData() {
  try {
    const [settingsRes, navRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/public/settings`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/navigation`, { cache: 'no-store' }),
    ]);

    const settingsData = settingsRes.ok ? await settingsRes.json() : null;
    const navData = navRes.ok ? await navRes.json() : null;

    return {
      settings: settingsData?.data || {},
      navigation: navData?.data || { header: [], footer: [] },
    };
  } catch (err) {
    console.error('Error fetching layout data:', err);
  }
  return {
    settings: {
      clinicName: 'Matruka',
      gujaratiName: 'માતૃકા',
      appointmentPhone: '7984882273',
      opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
      address: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
    },
    navigation: { header: [], footer: [] },
  };
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, navigation } = await getLayoutData();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} menus={navigation.header} />
      <main className="flex-1 pt-[4.5rem] lg:pt-20">{children}</main>
      <Footer settings={settings} footerMenus={navigation.footer} />
    </div>
  );
}

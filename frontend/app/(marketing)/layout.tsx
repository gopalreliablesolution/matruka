import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ConsultationModal from '@/components/ConsultationModal';
import { BACKEND_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getLayoutData() {
  try {
    const [settingsRes, navRes, homeRes, servicesRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/public/settings`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/navigation`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/home-data`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/v1/public/services`, { cache: 'no-store' }),
    ]);

    const settingsData = settingsRes.ok ? await settingsRes.json() : null;
    const navData = navRes.ok ? await navRes.json() : null;
    const homeData = homeRes.ok ? await homeRes.json() : null;
    const servicesData = servicesRes.ok ? await servicesRes.json() : null;
    const servicesList = servicesData?.data?.services || homeData?.data?.featuredServices || [];
    const doctorsList = homeData?.data?.featuredDoctors || [];

    const contactSec = homeData?.data?.sections?.find((s: any) => s.sectionKey === 'location_contact');
    const footerLogo = contactSec?.settings?.footerLogo || settingsData?.data?.logoWhiteUrl || '';
    const footerAboutText = contactSec?.settings?.footerAboutText || settingsData?.data?.footerAboutText || '';
    const footerBadge1 = contactSec?.settings?.footerBadge1 || settingsData?.data?.footerBadge1 || '';
    const footerBadge2 = contactSec?.settings?.footerBadge2 || settingsData?.data?.footerBadge2 || '';
    const featuredServices = homeData?.data?.featuredServices || [];
    const rawSettings = settingsData?.data || homeData?.data?.settings || {};
    const popupFromSec = contactSec?.settings?.popup;
    const finalPopup =
      settingsData?.data?.popup?.isActive !== undefined
        ? settingsData.data.popup
        : (popupFromSec?.isActive !== undefined ? popupFromSec : (homeData?.data?.settings?.popup || rawSettings.popup));

    return {
      settings: {
        ...rawSettings,
        popup: finalPopup,
        logoWhiteUrl: footerLogo,
        footerAboutText,
        footerBadge1,
        footerBadge2,
        featuredServices,
      },
      navigation: navData?.data || {
        header: homeData?.data?.headerMenus || [],
        footer: homeData?.data?.footerMenus || [],
      },
      servicesList,
      doctorsList,
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
      logoWhiteUrl: '',
    },
    navigation: { header: [], footer: [] },
    servicesList: [],
    doctorsList: [],
  };
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, navigation, servicesList, doctorsList } = await getLayoutData();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} menus={navigation.header} services={servicesList} />
      <main className="flex-1 pt-[4.5rem] lg:pt-20">{children}</main>
      <Footer settings={settings} footerMenus={navigation.footer} services={servicesList} />
      <ConsultationModal settings={settings} services={servicesList} doctors={doctorsList} />
    </div>
  );
}

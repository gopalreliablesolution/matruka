const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: 'Matruka' },
    gujaratiName: { type: String, default: 'માતૃકા' },
    tagline: { type: String, default: 'Complete Care for Her' },
    appointmentPhone: { type: String, default: '7984882273' },
    emergencyPhone: { type: String, default: '7984882273' },
    whatsappNumber: { type: String, default: '917984882273' },
    email: { type: String, default: 'info@matruka.in' },
    website: { type: String, default: 'www.matruka.in' },
    address: {
      type: String,
      default: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
    },
    landmark: { type: String, default: 'Besides Ratnajyoti Apartment, VIP Road' },
    city: { type: String, default: 'Surat' },
    state: { type: String, default: 'Gujarat' },
    pincode: { type: String, default: '395007' },
    googleMapsEmbedUrl: {
      type: String,
      default:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2223847847953!2d72.825!3d21.145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4c!2sSolaris+Cure+VIP+Road+Surat!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin',
    },
    googleMapsDirectionsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007',
    },
    opdTimings: {
      type: String,
      default: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
    },
    sundayTimings: { type: String, default: 'Closed (Emergency Only 24*7)' },
    emergencyHours: { type: String, default: '24*7 Available for Obstetrics & Emergency' },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/matrukasurat' },
      instagram: { type: String, default: 'https://instagram.com/matruka_surat' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    copyrightText: {
      type: String,
      default: '© 2026 Matruka — Complete Care for Her. All rights reserved.',
    },
    footerAboutText: {
      type: String,
      default:
        'Surat’s dedicated women’s healthcare, pregnancy, and advanced gynaecological laparoscopy clinic. Led with compassion and clinical rigor by Dr. Kairavi Yagnik & Dr. Rut Shah.',
    },
    footerBadge1: {
      type: String,
      default: 'FOGSI Certified Ultrasound',
    },
    footerBadge2: {
      type: String,
      default: 'Laparoscopic Surgeons',
    },
    logoUrl: { type: String, default: '/logo.png' },
    logoWhiteUrl: { type: String, default: '/logo-white.png' },
    faviconUrl: { type: String, default: '/favicon.ico' },
    announcementBarText: {
      type: String,
      default:
        'OPD Timings: 10:00 AM - 1:00 PM & 5:00 PM - 7:00 PM (Mon-Sat) | 24*7 Emergency Care Available',
    },
    isAnnouncementActive: { type: Boolean, default: true },
    popup: {
      isActive: { type: Boolean, default: true },
      title: { type: String, default: 'Matruka Women’s Hospital' },
      subtitle: { type: String, default: 'Complete Care for Her • Surat' },
      showHeader: { type: Boolean, default: true },
      description: {
        type: String,
        default:
          'Welcome to Matruka. For any clinical inquiries, maternity care, or emergency help, contact our care desk directly:',
      },
      showDescription: { type: Boolean, default: true },
      imageUrl: { type: String, default: '' },
      showImage: { type: Boolean, default: false },
      showInfo: { type: Boolean, default: true },
      showOpd: { type: Boolean, default: true },
      opdText: {
        type: String,
        default: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
      },
      showAddress: { type: Boolean, default: true },
      addressText: {
        type: String,
        default: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
      },
      showWhatsapp: { type: Boolean, default: true },
      whatsappText: { type: String, default: 'Connect on WhatsApp' },
      whatsappNumber: { type: String, default: '917984882273' },
      whatsappMessage: {
        type: String,
        default: 'Hello Matruka, I would like to inquire regarding clinic consultation and facilities.',
      },
      showCall: { type: Boolean, default: true },
      callText: { type: String, default: 'Call Helpline' },
      callNumber: { type: String, default: '7984882273' },
      showDismiss: { type: Boolean, default: true },
      dismissText: { type: String, default: 'Continue to website →' },
      delaySeconds: { type: Number, default: 3.5 },
      showOncePerSession: { type: Boolean, default: true },
    },
    seoDefaults: {
      metaTitle: {
        type: String,
        default: 'Matruka — Complete Care for Her | Best OBGYN & Maternity Clinic in Surat',
      },
      metaDescription: {
        type: String,
        default:
          'Expert Obstetrics & Gynaecology, Advanced Laparoscopic Surgery, and Infertility Care in Surat led by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road.',
      },
      ogImage: { type: String, default: '/images/brand/og-image.jpg' },
      keywords: {
        type: String,
        default:
          'gynecologist in surat, maternity clinic surat, Dr Kairavi Yagnik, Dr Rut Shah, normal delivery, laparoscopic surgery surat, infertility clinic surat',
      },
    },
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('Setting', settingSchema);


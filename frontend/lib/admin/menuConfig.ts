import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Sparkles,
  Building2,
  FileText,
  Video,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Globe,
  Settings,
  Users,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

export interface SubLink {
  name: string;
  href: string;
  query?: string;
  superAdminOnly?: boolean;
}

export interface SidebarItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  subLinks?: SubLink[];
  superAdminOnly?: boolean;
}

export const menuItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Patient Consultations',
    icon: Calendar,
    subLinks: [
      { name: 'Appointments & Leads', href: '/admin/appointments' },
      { name: 'Patient Reviews & Feedback', href: '/admin/testimonials' },
    ],
  },
  {
    name: 'Clinical Team & Care',
    icon: Stethoscope,
    subLinks: [
      { name: 'Doctors & Credentials', href: '/admin/doctors' },
      { name: '14 Core Specialities', href: '/admin/services' },
      { name: 'Hospital Facilities & OT', href: '/admin/facilities' },
    ],
  },
  {
    name: 'Content & Media',
    icon: FileText,
    subLinks: [
      { name: 'Banners & Hero Sliders', href: '/admin/banners' },
      { name: 'Video Showcase (YouTube)', href: '/admin/videos' },
      { name: 'Photo Gallery & Rooms', href: '/admin/gallery' },
      { name: 'Pregnancy Blogs & Guides', href: '/admin/blogs' },
      { name: 'Patient Clinical FAQs', href: '/admin/faqs' },
    ],
  },
  {
    name: 'Website & CMS',
    icon: Globe,
    subLinks: [
      { name: 'Hospital Locations', href: '/admin/hospital-locations' },
      { name: 'Newsletter Subscribers', href: '/admin/newsletter' },
      { name: 'Homepage Sections', href: '/admin/homepage' },
      { name: 'Header & Footer Menus', href: '/admin/menus' },
      { name: 'Dynamic Pages', href: '/admin/pages' },
      { name: 'Local Media Library', href: '/admin/media' },
      { name: 'Hospital Settings & Hours', href: '/admin/settings' },
    ],
  },
  {
    name: 'System & Security',
    icon: ShieldCheck,
    subLinks: [
      { name: 'Admin Users & Roles', href: '/admin/users', superAdminOnly: true },
      { name: 'Activity Audit Logs', href: '/admin/activity-logs' },
      // { name: 'Database Backup & Health', href: '/admin/backup' },
    ],
  },
];

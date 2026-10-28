import {
  LayoutDashboard,
  Stethoscope,
  Sparkles,
  Building2,
  FileText,
  MessageSquareQuote,
  Image as ImageIcon,
  HelpCircle,
  Sliders,
  Home,
  Menu as MenuIcon,
  HardDrive,
  Settings,
  Users,
  Activity,
  ShieldCheck,
  LucideIcon,
  Globe,
} from 'lucide-react';

export interface SubLink {
  name: string;
  href: string;
  query?: string;
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
    name: 'Doctors & Team',
    icon: Stethoscope,
    subLinks: [
      { name: 'All Doctors', href: '/admin/doctors' },
      { name: 'Doctor Specialities', href: '/admin/services' },
    ],
  },
  {
    name: 'Clinical Services',
    icon: Sparkles,
    subLinks: [
      { name: '14 Core Specialities', href: '/admin/services' },
      { name: 'Facilities & Infrastructure', href: '/admin/facilities' },
    ],
  },
  {
    name: 'Content Management',
    icon: FileText,
    subLinks: [
      { name: 'Blogs & Patient Guides', href: '/admin/blogs' },
      { name: 'Patient Testimonials', href: '/admin/testimonials' },
      { name: 'Clinical Gallery & OT', href: '/admin/gallery' },
      { name: 'Patient FAQs', href: '/admin/faqs' },
      { name: 'Banners & Hero Sliders', href: '/admin/banners' },
    ],
  },
  {
    name: 'Website & CMS',
    icon: Globe,
    subLinks: [
      { name: 'Homepage Builder', href: '/admin/homepage' },
      { name: 'Header & Navigation', href: '/admin/menus' },
      { name: 'Dynamic Pages', href: '/admin/pages' },
      { name: 'Media Library (Local)', href: '/admin/media' },
      { name: 'Clinic Settings & Hours', href: '/admin/settings' },
    ],
  },
  {
    name: 'System & Security',
    icon: Users,
    subLinks: [
      { name: 'Admin Users & Roles', href: '/admin/users' },
      { name: 'Activity Audit Logs', href: '/admin/activity-logs' },
      { name: 'Backup & Server Health', href: '/admin/backup' },
    ],
  },
];


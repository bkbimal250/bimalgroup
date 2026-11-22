import type { NavigationConfig } from '@/src/types';

export const navigationConfig: NavigationConfig = {
  mainNav: [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  primaryCta: {
    label: 'Start a Project',
    href: '/contact',
  },
  footerColumns: [
    {
      heading: 'Studio',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Work', href: '/work' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      heading: 'Capabilities',
      links: [
        { label: 'Business Websites', href: '/contact?service=Business+%26+Marketing+Websites' },
        { label: 'Full-Stack Apps', href: '/contact?service=Full-Stack+Web+Applications' },
        { label: 'Custom CRM & Dashboards', href: '/contact?service=Custom+CRM+%26+Operational+Dashboards' },
        { label: 'Lead Management Websites', href: '/contact?service=Lead+Management+Websites' },
        { label: 'Website SEO', href: '/contact?service=Website+SEO+%26+Technical+Optimization' },
        { label: 'WhatsApp AI Automation', href: '/contact?service=WhatsApp+AI+Automation' },
        { label: 'Custom AI Chatbots', href: '/contact?service=Custom+AI+Chatbots' },
        { label: 'Mobile Apps', href: '/contact?service=Mobile+App+Development' },
      ],
    },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ],
};

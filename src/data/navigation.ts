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
        { label: 'UI/UX Design', href: '/contact?service=UI%2FUX+Design' },
        { label: 'Mobile Apps', href: '/contact?service=Mobile+App+Development' },
      ],
    },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ],
};

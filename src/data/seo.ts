import type { SeoCollection } from '@/src/types';

export const seoConfig: SeoCollection = {
  siteUrl: 'https://bimalglobal.com',
  siteName: 'Bimal Global',
  defaultTitle: 'Bimal Global — Software Design, Engineering & Digital Products',
  defaultDescription:
    'Bimal Global designs, builds, and maintains business websites, full-stack web applications, UI/UX systems, mobile apps, and cloud infrastructure.',
  pages: {
    home: {
      path: '/',
      title: 'Bimal Global — We Design, Build & Maintain Digital Products',
      description:
        'From business websites to full-stack platforms and mobile apps, Bimal Global turns ideas into reliable digital experiences.',
      ogType: 'website',
    },
    work: {
      path: '/work',
      title: 'Work & Case Studies — Bimal Global',
      description:
        'Explore web applications, business websites, mobile apps, and UI/UX engineering case studies by Bimal Global.',
      ogType: 'website',
    },
    about: {
      path: '/about',
      title: 'About & Engineering Team — Bimal Global',
      description:
        'Meet the engineers and designers behind Bimal Global, review technical capabilities, partnerships, and downloadable resumes.',
      ogType: 'website',
    },
    contact: {
      path: '/contact',
      title: 'Start a Project & Contact — Bimal Global',
      description:
        'Share your project requirements with Bimal Global for websites, full-stack web applications, mobile apps, or ongoing maintenance.',
      ogType: 'website',
    },
    privacy: {
      path: '/privacy',
      title: 'Privacy Policy — Bimal Global',
      description:
        'Learn how Bimal Global collects, validates, retains, and protects project enquiry data.',
      ogType: 'website',
    },
    terms: {
      path: '/terms',
      title: 'Terms of Use — Bimal Global',
      description:
        'Terms governing access to Bimal Global website content, enquiries, and intellectual property.',
      ogType: 'website',
    },
  },
};

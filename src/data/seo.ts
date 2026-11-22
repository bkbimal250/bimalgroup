import type { SeoCollection } from '@/src/types';

export const seoConfig: SeoCollection = {
  siteUrl: 'https://bimalglobal.com',
  siteName: 'Bimal Global',
  defaultTitle: 'Bimal Global — Software Design, Engineering & Digital Products',
  defaultDescription:
    'Bimal Global designs and engineers business and lead management websites, custom CRMs and dashboards, website SEO, WhatsApp AI automation, custom chatbots, mobile apps, and cloud infrastructure.',
  pages: {
    home: {
      path: '/',
      title: 'Bimal Global — We Design, Build & Maintain Digital Products',
      description:
        'From lead management websites and custom CRMs to website SEO, WhatsApp AI automation, chatbots, and mobile apps, Bimal Global builds reliable digital products.',
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
    enquiries: {
      path: '/enquiries',
      title: 'Google Sheets Enquiry Sync — Bimal Global',
      description:
        'Connect a Google Sheet to record, review, and manage Bimal Global project enquiries.',
      ogType: 'website',
      noIndex: true,
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

import type { ServiceItem } from '@/src/types';

export const servicesData: ServiceItem[] = [
  {
    id: 'business-websites',
    index: '01',
    slug: 'business-marketing-websites',
    title: 'Business & Marketing Websites',
    summary:
      'Fast, accessible, search-ready websites built to represent your company clearly and convert qualified enquiries.',
    capabilities: [
      'Responsive editorial & marketing architecture',
      'Structured SEO metadata & semantic markup',
      'Clean lead-capture forms & CRM/Sheets routing',
    ],
    ctaLabel: 'Discuss a website',
    ctaServiceParam: 'Business & Marketing Websites',
  },
  {
    id: 'full-stack-apps',
    index: '02',
    slug: 'full-stack-web-applications',
    title: 'Full-Stack Web Applications',
    summary:
      'Custom internal portals, SaaS products, and operational dashboards engineered with typed APIs and resilient data models.',
    capabilities: [
      'Next.js, React & TypeScript application architecture',
      'Role-based access, workflows & REST/RPC APIs',
      'Automated validation & clean state management',
    ],
    ctaLabel: 'Scope an application',
    ctaServiceParam: 'Full-Stack Web Applications',
  },
  {
    id: 'ui-ux-design',
    index: '03',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    summary:
      'Disciplined interface systems, user flows, and design tokens crafted for clarity, low friction, and WCAG AA legibility.',
    capabilities: [
      'Information architecture & interactive wireframes',
      'Tokenized design systems & component specs',
      'Usability audits & responsive layout refinement',
    ],
    ctaLabel: 'Plan a design system',
    ctaServiceParam: 'UI/UX Design',
  },
  {
    id: 'mobile-apps',
    index: '04',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    summary:
      'Cross-platform iOS and Android applications designed for reliable offline behavior, crisp touch ergonomics, and smooth releases.',
    capabilities: [
      'React Native & Expo mobile engineering',
      'Secure API synchronization & local persistence',
      'App Store & Play Store release preparation',
    ],
    ctaLabel: 'Discuss a mobile app',
    ctaServiceParam: 'Mobile App Development',
  },
  {
    id: 'cloud-infrastructure',
    index: '05',
    slug: 'deployment-cloud-infrastructure',
    title: 'Deployment & Cloud Infrastructure',
    summary:
      'Dependable hosting, CI/CD pipelines, domain routing, and environment hardening so releases remain calm and repeatable.',
    capabilities: [
      'Vercel, Cloud Run & containerized deployments',
      'CI/CD checks, preview environments & DNS setup',
      'Secret management, rate limiting & monitoring',
    ],
    ctaLabel: 'Review infrastructure',
    ctaServiceParam: 'Deployment & Cloud Infrastructure',
  },
  {
    id: 'maintenance-support',
    index: '06',
    slug: 'maintenance-support-improvements',
    title: 'Maintenance, Support & Improvements',
    summary:
      'Ongoing engineering stewardship for existing products—covering dependency upgrades, bug resolution, and incremental features.',
    capabilities: [
      'Scheduled framework & security dependency updates',
      'Core Web Vitals & accessibility improvements',
      'Feature iterations on legacy or active codebases',
    ],
    ctaLabel: 'Arrange ongoing support',
    ctaServiceParam: 'Maintenance, Support & Improvements',
  },
];

export const budgetOptions: string[] = [
  'Under $5,000',
  '$5,000 – $15,000',
  '$15,000 – $35,000',
  '$35,000+',
  'Ongoing Retainer / Support',
  'Not sure yet — looking for scoping',
];

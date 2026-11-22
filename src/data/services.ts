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
  {
    id: 'custom-crm-dashboards',
    index: '07',
    slug: 'custom-crm-and-dashboards',
    title: 'Custom CRM & Operational Dashboards',
    summary:
      'Bespoke CRM pipelines, executive analytics dashboards, and internal reporting tools tailored to your sales and operations workflows.',
    capabilities: [
      'Custom deal stages, role-based access & activity timelines',
      'Real-time KPI dashboards, reporting & Google Sheets sync',
      'Third-party ERP, billing & webhook integrations',
    ],
    ctaLabel: 'Scope a custom CRM',
    ctaServiceParam: 'Custom CRM & Operational Dashboards',
  },
  {
    id: 'lead-management-websites',
    index: '08',
    slug: 'lead-management-websites',
    title: 'Lead Management Websites',
    summary:
      'Conversion-focused websites engineered with structured multi-step intake, lead qualification, and automated pipeline routing.',
    capabilities: [
      'High-converting service pages & multi-step enquiry flows',
      'Automated lead routing to Google Sheets, CRM & alerts',
      'UTM attribution tracking, spam defense & deduplication',
    ],
    ctaLabel: 'Build a lead engine',
    ctaServiceParam: 'Lead Management Websites',
  },
  {
    id: 'website-seo-optimization',
    index: '09',
    slug: 'website-seo-optimization',
    title: 'Website SEO & Technical Optimization',
    summary:
      'Technical SEO architecture, structured data, and Core Web Vitals optimization built to improve organic search visibility and indexing.',
    capabilities: [
      'Per-route metadata, Open Graph, XML sitemaps & JSON-LD',
      'Core Web Vitals, crawlability & semantic HTML audits',
      'Clean URL architecture, canonicals & search console setup',
    ],
    ctaLabel: 'Audit website SEO',
    ctaServiceParam: 'Website SEO & Technical Optimization',
  },
  {
    id: 'whatsapp-ai-automation',
    index: '10',
    slug: 'whatsapp-ai-automation',
    title: 'WhatsApp AI Automation',
    summary:
      'Automated WhatsApp Business workflows that qualify incoming enquiries, handle instant replies, and log leads directly into your CRM.',
    capabilities: [
      'WhatsApp Business API webhook & message template flows',
      'AI-assisted lead qualification & instant response routing',
      'Live synchronization with Google Sheets, CRMs & team alerts',
    ],
    ctaLabel: 'Automate WhatsApp',
    ctaServiceParam: 'WhatsApp AI Automation',
  },
  {
    id: 'custom-chatbots',
    index: '11',
    slug: 'custom-ai-chatbots',
    title: 'Custom AI Chatbots',
    summary:
      'Domain-grounded web and support chatbots built around your product documentation, appointment booking, and human handoff rules.',
    capabilities: [
      'Knowledge-grounded assistants for support & lead capture',
      'Guardrailed responses with seamless human escalation',
      'Embedded website widgets synced with CRM & enquiry logs',
    ],
    ctaLabel: 'Discuss a chatbot',
    ctaServiceParam: 'Custom AI Chatbots',
  },
];

export const budgetOptions: string[] = [
  'Under ₹5,000',
  '₹5,000 – ₹10,000',
  '₹20,000 – ₹35,000',
  '₹40,000 – ₹60,000',
  '₹60,000+',
  'Monthly Retainer / Support',
  'Not sure yet — looking for scoping',
];

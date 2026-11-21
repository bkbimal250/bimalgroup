import type { SiteConfig } from '@/src/types';

/**
 * Centralized business & page configuration for Bimal Global.
 * Edit values here before deployment; reusable components consume this object directly.
 */
export const siteConfig: SiteConfig = {
  brandName: 'Bimal Global',
  legalName: 'Bimal Global',
  domain: 'https://bimalglobal.com',
  tagline: 'Software Design, Engineering & Digital Products',
  description:
    'Bimal Global designs, builds, and maintains business websites, full-stack web applications, mobile apps, and cloud infrastructure.',
  locationLabel: 'Remote-first engineering studio',
  primaryEmail: 'hello@bimalglobal.com', // Placeholder: replace with your verified studio inbox
  responseSla: 'Direct engineering response within one to two business days.',
  availabilityNote: 'Accepting new project enquiries',
  hero: {
    kicker: 'Software Design & Engineering Studio',
    headline: 'We Design, Build & Maintain Digital Products.',
    subheading:
      'From business websites to full-stack platforms and mobile apps, we turn ideas into reliable digital experiences.',
    primaryCta: {
      label: 'Start a Project',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Explore Our Work',
      href: '/work',
    },
  },
  trustSection: {
    eyebrow: 'Engineering Standards',
    title: 'Built for longevity, clarity, and straightforward handover',
    description:
      'We focus on clean architecture, maintainable codebases, and transparent communication from discovery through ongoing maintenance.',
    principles: [
      {
        id: 'direct-engineering',
        title: 'Direct senior execution',
        description:
          'You collaborate directly with the engineers and designers shipping your product—without layers of account handoffs.',
      },
      {
        id: 'maintainable-architecture',
        title: 'Clean, typed codebases',
        description:
          'Every project ships with TypeScript, modular component boundaries, clear documentation, and full repository ownership.',
      },
      {
        id: 'accessible-by-default',
        title: 'Accessible & fast by default',
        description:
          'Semantic HTML, keyboard navigation, WCAG 2.2 AA contrast targets, and disciplined asset budgets are part of every build.',
      },
      {
        id: 'long-term-stewardship',
        title: 'Long-term maintenance',
        description:
          'Launch is step one. We stay available for dependency updates, performance tuning, cloud monitoring, and iterative features.',
      },
    ],
  },
  processSection: {
    eyebrow: 'How We Work',
    title: 'A deliberate four-stage delivery cycle',
    description:
      'Structured milestones keep scope clear, architecture grounded, and deployments predictable.',
    steps: [
      {
        stepNumber: '01',
        title: 'Discovery & Scope',
        summary:
          'We align on business goals, user workflows, technical constraints, and a realistic delivery plan before writing production code.',
        deliverables: ['Technical brief', 'Information architecture', 'Milestone estimate'],
      },
      {
        stepNumber: '02',
        title: 'Interface & System Design',
        summary:
          'Design tokens, component states, and responsive layouts are reviewed early so engineering moves without ambiguity.',
        deliverables: ['Wireframes & UI system', 'Responsive specs', 'Data model'],
      },
      {
        stepNumber: '03',
        title: 'Engineering & Verification',
        summary:
          'Iterative builds in staging with typed APIs, validation, automated checks, and accessibility reviews.',
        deliverables: ['Staging preview', 'TypeScript codebase', 'QA checklist'],
      },
      {
        stepNumber: '04',
        title: 'Launch & Ongoing Support',
        summary:
          'Clean production deployment, DNS and analytics configuration, documentation handover, and optional ongoing maintenance.',
        deliverables: ['Production release', 'Runbook & handover', 'Support cadence'],
      },
    ],
  },
  ctaBanner: {
    eyebrow: 'Start a Conversation',
    title: 'Have a website, application, or product roadmap to discuss?',
    description:
      'Share your goals, timeline, and technical context. We will review your enquiry and follow up with clear next steps.',
    primaryCtaLabel: 'Start a Project',
    primaryCtaHref: '/contact',
    secondaryCtaLabel: 'Meet the Team',
    secondaryCtaHref: '/about',
  },
  contactChannels: [
    {
      id: 'email',
      label: 'Studio Email (Placeholder)',
      value: 'hello@bimalglobal.com',
      href: 'mailto:hello@bimalglobal.com',
      description: 'For new project briefs, technical scoping, and partnership enquiries.',
      isPlaceholder: true,
    },
    {
      id: 'response-window',
      label: 'Response Window',
      value: '1–2 business days',
      description: 'Every enquiry is reviewed directly by our engineering leads.',
    },
    {
      id: 'engagement',
      label: 'Engagement Models',
      value: 'Fixed-scope builds & ongoing retainers',
      description: 'Available for new greenfield builds, redesigns, and steady maintenance.',
    },
  ],
  retentionPolicy: {
    summary:
      'Enquiry submissions are stored solely to respond to your project request and manage follow-up correspondence. Records are reviewed periodically and deleted upon request or once no longer needed for active discussions.',
    consentLabel:
      'I agree that Bimal Global may store and process the information submitted in this form solely to respond to my enquiry, in accordance with the Privacy Policy.',
  },
  privacyPolicy: {
    lastUpdated: 'Placeholder template — review and update date before launch',
    intro:
      'This Privacy Policy explains how Bimal Global collects, uses, and safeguards information submitted through https://bimalglobal.com.',
    sections: [
      {
        id: 'information-collected',
        heading: '1. Information You Provide',
        paragraphs: [
          'When you submit the project enquiry form on our website, we collect your name, email address, optional phone number, selected service category, optional budget range, project message, and explicit consent confirmation.',
          'We do not require user accounts, tracking profiles, or third-party advertising cookies to browse this website.',
        ],
      },
      {
        id: 'purpose-and-storage',
        heading: '2. How We Use & Store Enquiry Data',
        paragraphs: [
          'Submitted enquiry details are validated on our server and forwarded over encrypted HTTPS to a private Google Sheet managed by Bimal Global via a protected Google Apps Script endpoint.',
          'Your information is used strictly to evaluate your project requirements, respond to your request, and maintain communication regarding potential work together. We do not sell, rent, or distribute enquiry records to third parties.',
        ],
      },
      {
        id: 'retention',
        heading: '3. Data Retention',
        paragraphs: [
          'Enquiry records are retained only for as long as necessary to conclude correspondence or manage an active client relationship. Unconverted enquiry records are reviewed periodically and removed on a regular retention schedule or promptly upon request.',
        ],
      },
      {
        id: 'theme-preference',
        heading: '4. Local Preferences',
        paragraphs: [
          'If you preview visual themes using the theme switcher, your selected theme identifier is saved locally in your browser via localStorage so the appearance persists between page visits. This preference is not transmitted to our servers.',
        ],
      },
      {
        id: 'your-rights',
        heading: '5. Access, Correction & Deletion Requests',
        paragraphs: [
          'You may request access to, correction of, or deletion of any enquiry data you have submitted by emailing our studio contact address listed on the Contact page.',
        ],
      },
    ],
  },
  termsOfUse: {
    lastUpdated: 'Placeholder template — review and update date before launch',
    intro:
      'By accessing https://bimalglobal.com, you agree to the following terms governing use of this website and its materials.',
    sections: [
      {
        id: 'informational-purpose',
        heading: '1. Informational Purpose & No Binding Offer',
        paragraphs: [
          'Content published on this website—including service descriptions, sample case studies, and technical capabilities—is provided for general informational purposes and does not constitute a binding commercial offer.',
          'All client engagements, deliverables, timelines, and pricing are governed exclusively by a written Statement of Work or Master Services Agreement signed by both parties.',
        ],
      },
      {
        id: 'intellectual-property',
        heading: '2. Intellectual Property',
        paragraphs: [
          'Unless otherwise noted, website copy, visual design systems, and proprietary documentation published on this domain belong to Bimal Global. Any downloadable resumes or public technical samples remain the property of their respective authors.',
        ],
      },
      {
        id: 'acceptable-use',
        heading: '3. Acceptable Use of Contact Endpoints',
        paragraphs: [
          'Automated scraping, spam submissions, credential testing, or abusive traffic against our enquiry endpoint is prohibited. Rate limiting and automated submission filters are enforced to protect service availability.',
        ],
      },
      {
        id: 'external-links',
        heading: '4. Third-Party Links',
        paragraphs: [
          'Case studies and team profiles may reference external websites or public repositories. Bimal Global is not responsible for the availability or content of external third-party domains.',
        ],
      },
    ],
  },
};

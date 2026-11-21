import type { ProjectFilterOption, ProjectItem } from '@/src/types';

export const projectFilterOptions: ProjectFilterOption[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'websites', label: 'Websites' },
  { value: 'full-stack', label: 'Full-Stack Applications' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'ui-ux', label: 'UI/UX' },
];

/**
 * Editable portfolio project entries.
 * NOTE: Entries marked `isPlaceholder: true` are realistic sample structures clearly
 * labeled for replacement with verified client work and real screenshot paths in /public/images/projects/.
 */
export const projectsData: ProjectItem[] = [
  {
    id: 'proj-sample-portal',
    slug: 'client-operations-portal-template',
    title: 'Operations & Document Workflow Portal (Sample Case Study)',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Applications',
    year: '2026',
    clientType: 'Sample B2B Services Engagement',
    shortSummary:
      'Placeholder case study demonstrating how Bimal Global documents full-stack portals: request intake, approval queues, and audit-ready export workflows.',
    businessProblem:
      'Placeholder problem statement: Replace this section with the actual client workflow bottleneck—such as fragmented spreadsheet tracking, manual email approvals, or slow status visibility across teams.',
    solution:
      'Placeholder engineering solution: Detail the typed web architecture, role-based views, server validation, and automated notifications implemented to replace manual steps.',
    role: 'End-to-end architecture, UI system, and full-stack TypeScript implementation',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Zod'],
    features: [
      'Role-scoped request submission and multi-step status tracking',
      'Validated form workflows with keyboard-first table filtering',
      'Structured CSV export and clean activity history',
    ],
    screenshots: [
      {
        src: '/images/projects/sample-portal-overview.png',
        alt: 'Placeholder frame for full-stack operations portal overview interface',
        caption: 'Primary operational workspace layout (add verified screenshot at /public/images/projects/)',
        aspect: '16:10',
      },
      {
        src: '/images/projects/sample-portal-detail.png',
        alt: 'Placeholder frame for request review detail view',
        caption: 'Structured review and approval drawer view',
        aspect: '16:10',
      },
    ],
    isPrivate: true,
    privateNote: 'Internal client application — live URL restricted under NDA.',
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'proj-sample-website',
    slug: 'b2b-corporate-web-platform-template',
    title: 'Corporate Web Presence & Enquiry Pipeline (Sample Case Study)',
    category: 'websites',
    categoryLabel: 'Websites',
    year: '2026',
    clientType: 'Sample Corporate Engagement',
    shortSummary:
      'Placeholder case study for a high-clarity corporate website with structured service pages, technical SEO, and server-validated enquiry routing.',
    businessProblem:
      'Placeholder problem statement: Replace with the real challenge—such as an outdated brochure site, slow mobile load times, or unvalidated contact forms missing lead attribution.',
    solution:
      'Placeholder engineering solution: Describe the semantic page hierarchy, static generation strategy, accessible color tokens, and protected enquiry API integration.',
    role: 'Information architecture, visual design, frontend engineering, and SEO setup',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Google Apps Script'],
    features: [
      'Modular content files separated cleanly from presentation components',
      'Per-route Open Graph metadata, sitemap, and Schema.org structured data',
      'Server-side enquiry validation with spam protection and sheet sync',
    ],
    screenshots: [
      {
        src: '/images/projects/sample-corporate-home.png',
        alt: 'Placeholder frame for corporate marketing homepage layout',
        caption: 'Editorial homepage hierarchy and service overview (replace with real capture)',
        aspect: '16:10',
      },
    ],
    liveUrl: 'https://bimalglobal.com',
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'proj-sample-mobile',
    slug: 'field-inspection-mobile-app-template',
    title: 'Field Inspection Companion App (Sample Case Study)',
    category: 'mobile',
    categoryLabel: 'Mobile Apps',
    year: '2026',
    clientType: 'Sample Field Operations Engagement',
    shortSummary:
      'Placeholder case study for an offline-capable mobile application supporting structured field checklists and deferred background sync.',
    businessProblem:
      'Placeholder problem statement: Replace with real field constraints—such as unreliable site connectivity, paper checklists, or delayed reporting back to headquarters.',
    solution:
      'Placeholder engineering solution: Outline local-first storage, conflict-safe synchronization queues, and large touch-friendly inspection controls.',
    role: 'Mobile UX architecture, cross-platform development, and API sync layer',
    stack: ['React Native', 'TypeScript', 'Expo', 'SQLite', 'REST API'],
    features: [
      'Offline checklist capture with local persistence queue',
      'Structured photo attachment metadata and timestamping',
      'Automatic background retry when connectivity resumes',
    ],
    screenshots: [
      {
        src: '/images/projects/sample-mobile-screens.png',
        alt: 'Placeholder frame for mobile inspection workflow screens',
        caption: 'Offline checklist capture and sync queue view (replace with real capture)',
        aspect: '16:10',
      },
    ],
    isPrivate: true,
    privateNote: 'Enterprise distribution build — source and binary remain private.',
    featured: true,
    isPlaceholder: true,
  },
  {
    id: 'proj-sample-design-system',
    slug: 'multi-theme-design-system-template',
    title: 'Tokenized Multi-Brand UI System (Sample Case Study)',
    category: 'ui-ux',
    categoryLabel: 'UI/UX',
    year: '2026',
    clientType: 'Sample Product Design Engagement',
    shortSummary:
      'Placeholder case study for a unified component library and CSS variable token architecture supporting accessible light and dark palettes.',
    businessProblem:
      'Placeholder problem statement: Replace with real design debt challenges—such as inconsistent form controls, contrast failures, or duplicated UI code across products.',
    solution:
      'Placeholder engineering solution: Summarize the semantic token matrix, Radix UI accessible primitives, and documented component states delivered to the product team.',
    role: 'Design tokens, accessibility audit, and component library engineering',
    stack: ['Figma', 'Tailwind CSS', 'Radix UI', 'TypeScript', 'WCAG 2.2 AA'],
    features: [
      'Semantic background, surface, border, and foreground contrast tokens',
      'Keyboard-navigable dialogs, selects, and validated form controls',
      'Reduced-motion safe transitions and consistent spacing scale',
    ],
    screenshots: [
      {
        src: '/images/projects/sample-ui-system.png',
        alt: 'Placeholder frame for component library and token documentation',
        caption: 'Token matrix and interactive form component states (replace with real capture)',
        aspect: '16:10',
      },
    ],
    featured: false,
    isPlaceholder: true,
  },
];

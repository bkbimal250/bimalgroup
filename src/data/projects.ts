import type { ProjectFilterOption, ProjectItem } from '@/src/types';

/**
 * Bimal Global portfolio projects.
 *
 * Editorial notes:
 * - These are real projects identified by the portfolio owner, not sample case studies.
 * - Confirm project years, exact responsibilities, technologies and production features
 *   against each project's codebase before publishing more specific claims.
 * - Add verified screenshots to /public/images/projects/ and update screenshots arrays.
 * - GitHub links are stored in sourceUrl; see the note below if ProjectItem has no sourceUrl.
 * - No invented testimonials, metrics, client contracts or private deployment URLs.
 */

export const projectFilterOptions: ProjectFilterOption[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'websites', label: 'Websites' },
  { value: 'full-stack', label: 'Full-Stack Applications' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'ui-ux', label: 'UI/UX' },
 
];

/**
 * Existing ProjectItem fields are preserved for drop-in compatibility.
 * Add desktop to the ProjectItem category union and projectFilterOptions if you
 * want a dedicated Desktop Applications filter for PIXINIT.
 */
export const projectsData: ProjectItem[] = [
 
  {
    id: 'proj-mastercall',
    slug: 'mastercall-lead-management',
    title: 'MasterCall – Call Tracking & Lead Management',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Applications',
    year: '2026', // TODO: Confirm launch year
    clientType: 'Business Communications & CRM',
    shortSummary:
      'A live business platform focused on call tracking and lead management.',
    businessProblem:
      'Businesses need a more structured way to follow up on incoming calls and customer leads.',
    solution:
      'A dedicated call-tracking and lead-management web experience. Specific integrations, reporting and automation capabilities should be confirmed before publication.',
    role: 'Web application development; confirm specific responsibilities',
    stack: [

      'Python', 'PostgreSQL', 'JavaScript', 'React', 'Django REST Framework', 'Celery', 'Redis', 'Docker', 'Nginx', 'Git', 'GitHub Actions', 'Twilio', 'firebase', 'kotlin','jetpack compose', 'android studio', 'java', 'kotlin coroutines', 'kotlin flow', 'koin', 'retrofit', 'okhttp', 'glide', 'room database', 'firebase cloud messaging'

    ], // TODO: Confirm from repository
    features: [
      'Call-tracking-focused business workflow',
      'Lead management and follow-up automation',
      'Lead management positioning',
      'Business-oriented web interface',
      'Mobile application for call tracking and lead management',
      'multi-tenant architecture for multiple businesses to manage their leads and calls separately',
    ],
    screenshots: [
      {
        src: '/images/projects/dashboardanalytics.png',
        alt: 'MasterCall dashboard analytics',
        caption: 'Dashboard analytics',
      },
      {
        src: '/images/projects/MasterCall Glassmorphism Features Grid.png',
        alt: 'MasterCall Glassmorphism Features Grid',
        caption: 'Glassmorphism Features Grid',
      }
    ],
    liveUrl: 'https://mastercall.in/',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'proj-spaadvisor',
    slug: 'spaadvisor-wellness-discovery',
    title: 'SpaAdvisor – Spa & Wellness Discovery',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Applications',
    year: '2025', // TODO: Confirm launch year
    clientType: 'Spa & Wellness Industry',
    shortSummary:
      'A live spa discovery platform helping customers explore wellness businesses, services and booking options.',
    businessProblem:
      'Customers need an easier way to find and compare spa services, while businesses need a discoverable online presence.',
    solution:
      'Built a spa-focused platform centered on business listings, service discovery and enquiry or booking-oriented customer journeys.',
    role: 'Web application development; confirm specific responsibilities',
    stack: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux', 'Material-UI', 'AWS S3', 'Docker', 'Nginx', 'Git', 'GitHub Actions','socket.io','payment gateway integration','sms gateway integration','email gateway integration','crm integration,whatsapp integration'
    ], // Based on previously discussed SpaAdvisor codebase; verify current deployment
    features: [
      'Spa business listings and detail pages',
      'Service and location-oriented discovery',
      'Search and listing navigation',
      'Booking or enquiry calls to action',
    ],
    screenshots: [
      {
        src: '/images/projects/spaadvisor.png',
        alt: 'SpaAdvisor dashboard',
        caption: 'SpaAdvisor dashboard',
      }
      
    ],
    liveUrl: 'https://spaadvisor.in/',
    featured: true,
    isPlaceholder: false,
  },

   {
    id: 'proj-bookby247',
    slug: 'bookby247-booking-platform',
    title: 'BookBy247 – Booking & Business Management Platform',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Applications',
    year: '2026', // TODO: Confirm launch year
    clientType: 'Beauty, Spa & Wellness Businesses',
    shortSummary:
      'A live booking-oriented platform for spa, salon and beauty businesses, bringing service discovery and appointment-related experiences together.',
    businessProblem:
      'Service businesses need a convenient digital way to present their offerings and support customer booking journeys instead of relying entirely on manual enquiries.',
    solution:
      'Developed a business-focused booking platform with service discovery and appointment-oriented workflows. Confirm the exact production management modules before expanding this description.',
    role: 'Web application development; confirm specific ownership and responsibilities',
    stack: [], // TODO: Confirm from repository
    features: [
      'Spa, salon and beauty service discovery',
      'Booking-oriented customer experience',
      'Business and service presentation',
      'Responsive web interface',
    ],
    screenshots: [],
    liveUrl: 'https://bookby247.com/',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'proj-workspa',
    slug: 'workspa-spa-recruitment',
    title: 'WorkSpa – Spa Jobs & Recruitment',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Applications',
    year: '2026', // TODO: Confirm launch year
    clientType: 'Recruitment & Spa Industry',
    shortSummary:
      'A live recruitment platform connecting spa and wellness employers with job seekers through searchable job listings and application journeys.',
    businessProblem:
      'Spa businesses need to reach suitable candidates, while job seekers need role- and location-specific vacancies in one place.',
    solution:
      'Created a sector-focused jobs experience with role and location discovery, vacancy details and candidate-facing application pathways.',
    role: 'Web application development; confirm specific responsibilities',
    stack: ['React', 'Node.js', 'MongoDB'], // Based on previously discussed SPA jobs project; verify this is the deployed WorkSpa stack
    features: [
      'Job listings and detail pages',
      'Role and location-based job discovery',
      'Spa therapist, receptionist and management job categories',
      'Candidate application journeys',
      'Employer-facing recruitment information',
    ],
    screenshots: [],
    liveUrl: 'https://workspa.in/',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'proj-disha-attendance',
    slug: 'disha-employee-attendance-crm',
    title: 'Disha Online Solution – Employee Attendance CRM',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Applications',
    year: '2026', // TODO: Confirm year
    clientType: 'Internal Company Operations',
    shortSummary:
      'An employee attendance management system designed for company attendance records, biometric punch integration and operational visibility.',
    businessProblem:
      'Organizations using attendance devices need a consistent way to associate device punches with employees and review attendance records.',
    solution:
      'Developed an attendance application with employee mapping, device data synchronization and attendance management workflows.',
    role: 'Backend, integration and deployment engineering; confirm final project scope',
    stack: ['Python', 'Django', 'SQL Server', 'WebSockets'], // Based on previously discussed attendance system; verify repository
    features: [
      'Employee attendance records',
      'Biometric device punch synchronization',
      'Employee and device identity mapping',
      'Attendance history and reporting workflows',
      'Real-time attendance updates where enabled',
    ],
    screenshots: [],
    // Source repository is provided below in a comment because ProjectItem's
    // original type does not advertise a sourceUrl or githubUrl field.
    // GitHub: https://github.com/bkbimal250/hrpayroll#employee-attendance-system
    isPrivate: true,
    privateNote: 'Company attendance application; public source reference available, but production access is not listed.',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'proj-internal-chat',
    slug: 'internal-business-chat-application',
    title: 'Internal Chat – Business Messaging Application',
    category: 'full-stack',
    categoryLabel: 'Full-Stack Applications',
    year: '2026', // TODO: Confirm year
    clientType: 'Internal Team Communication',
    shortSummary:
      'An internal chat application project focused on communication between team members.',
    businessProblem:
      'Teams need a dedicated space for work-related conversations and coordination.',
    solution:
      'Developed an internal messaging application. Confirm the deployed architecture and supported chat features from the repository before publishing detailed claims.',
    role: 'Application development; confirm exact responsibilities',
    stack: [], // TODO: Verify from GitHub repository
    features: [
      'Internal team messaging workflow',
      'Business-focused communication interface',
    ],
    screenshots: [],
    // GitHub: https://github.com/bkbimal250/internal_chat_app
    isPrivate: true,
    privateNote: 'Internal application; repository provided, public deployment not confirmed.',
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'proj-pixinit',
    slug: 'pixinit-ssd-testing-utility',
    title: 'PIXINIT – SSD & NVMe Testing Utility',
    category: 'full-stack', // Compatibility fallback; ideally use a new 'desktop' category
    categoryLabel: 'Desktop Applications',
    year: '2026', // TODO: Confirm release year
    clientType: 'Windows Desktop Utility',
    shortSummary:
      'A Windows desktop utility project for SSD health information and storage performance benchmarking.',
    businessProblem:
      'Users need understandable SSD health information and repeatable storage performance tests without manually combining multiple utilities.',
    solution:
      'Built a desktop-oriented workflow for reviewing drive information and running sequential and random storage benchmark tests.',
    role: 'Desktop application development and benchmarking implementation',
    stack: ['C#', 'WPF', '.NET'], // Confirm current target framework and release details
    features: [
      'SSD and NVMe information display',
      'Sequential read and write benchmark workflows',
      'Random read and write benchmark workflows',
      'Benchmark results presentation',
    ],
    screenshots: [],
    // GitHub: https://github.com/bkbimal250/ssdtestingapp/blob/main/README.md
    featured: true,
    isPlaceholder: false,
  },
  {
    id: 'proj-bimalglobal',
    slug: 'bimal-global-corporate-website',
    title: 'Bimal Global – Corporate Website',
    category: 'websites',
    categoryLabel: 'Websites',
    year: '2026', // TODO: Confirm launch year
    clientType: 'Own Business Website',
    shortSummary:
      'The official Bimal Global website showcasing web development, digital services and business enquiry channels.',
    businessProblem:
      'A growing digital services business needs a clear online presence that explains its offerings and captures enquiries.',
    solution:
      'Created a responsive business website with service information and contact enquiry functionality.',
    role: 'Website development and maintenance',
    stack: ['React', 'Vite', 'TypeScript'], // Based on the existing project described in this conversation
    features: [
      'Business service presentation',
      'Responsive website experience',
      'Contact enquiry form',
      'Deployment on Vercel',
    ],
    screenshots: [],
    liveUrl: 'https://bimalglobal.com/',
    featured: false,
    isPlaceholder: false,
  },
  {
    id: 'proj-royal-oaks-thane',
    slug: 'royal-oaks-spa-thane-website',
    title: 'Royal Oaks Spa Thane – Business Website',
    category: 'websites',
    categoryLabel: 'Websites',
    year: '2026', // TODO: Confirm launch year
    clientType: 'Spa Business – India',
    shortSummary:
      'A spa business website for Royal Oaks Spa Thane, part of the wider collection of wellness websites developed for Indian businesses.',
    businessProblem:
      'A local spa business needs a discoverable website to present its brand, services and contact information.',
    solution:
      'Delivered a dedicated spa web presence. Verify the live page content and current features before adding detailed claims.',
    role: 'Website development; confirm project scope',
    stack: [], // TODO: Confirm
    features: [
      'Dedicated spa business website',
      'Brand and service presentation',
      'Customer contact journey',
    ],
    screenshots: [],
    liveUrl: 'https://royaloakspathane.com/',
    // Alternate domain supplied by owner: https://royaloakspathane.in/
    featured: false,
    isPlaceholder: false,
  },
  {
    id: 'proj-manchester-spa-dubai',
    slug: 'manchester-spa-dubai-website',
    title: 'Manchester Spa Dubai – Business Website',
    category: 'websites',
    categoryLabel: 'Websites',
    year: '2026', // TODO: Confirm launch year
    clientType: 'Spa Business – Dubai, UAE',
    shortSummary:
      'A spa and wellness business website serving customers in Dubai, showcasing services and customer contact options.',
    businessProblem:
      'A spa business in a competitive local market needs an online destination for service discovery and customer enquiries.',
    solution:
      'Developed a spa-focused marketing website with business information and enquiry-oriented calls to action.',
    role: 'Website development; confirm project scope',
    stack: [], // TODO: Confirm
    features: [
      'Spa service presentation',
      'Business information and contact pathways',
      'Customer enquiry or booking calls to action',
    ],
    screenshots: [],
    liveUrl: 'https://www.manchesterspadubai.com/',
    featured: false,
    isPlaceholder: false,
  },
  {
    id: 'proj-royal-bliss-dubai',
    slug: 'royal-bliss-spa-dubai-website',
    title: 'Royal Bliss Spa Dubai – Wellness Landing Page',
    category: 'websites',
    categoryLabel: 'Websites',
    year: '2026', // TODO: Confirm launch year
    clientType: 'Spa Business – Dubai, UAE',
    shortSummary:
      'A Dubai-focused spa landing page presenting wellness services and customer booking or contact options.',
    businessProblem:
      'A local wellness business needs a clear digital page for prospective customers searching for spa services in Dubai.',
    solution:
      'Created a focused spa service page with treatment information and customer enquiry pathways.',
    role: 'Website development; confirm project scope',
    stack: [], // TODO: Confirm
    features: [
      'Spa and wellness service content',
      'Location-oriented service landing page',
      'Customer contact and booking calls to action',
    ],
    screenshots: [],
    liveUrl: 'https://royalblissspa.com/spa-in-dubai/',
    featured: false,
    isPlaceholder: false,
  },
];

import type { TeamMember } from '@/src/types';

/**
 * Centralized team & resume directory.
 * Replace placeholder entries with verified team member profiles, photos in /public/images/team/,
 * and PDF resumes in /public/resumes/. Avoid exposing personal phone numbers or private addresses.
 */
export const teamData: TeamMember[] = [
  {
    id: 'team-lead-engineering',
    name: 'Studio Engineering Lead (Placeholder)',
    role: 'Principal Full-Stack Engineer & Architect',
    location: 'Remote',
    photoPath: '/images/team/lead-engineer.jpg',
    photoAlt: 'Portrait placeholder for Principal Full-Stack Engineer',
    skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Cloud Architecture'],
    biography:
      'Placeholder biography: Replace with verified background covering production web platforms, API architecture, database modeling, and long-term system stewardship.',
    experience: 'Replace with verified years of software delivery & domain focus',
    githubUrl: 'https://github.com/bimalglobal',
    linkedinUrl: 'https://linkedin.com/company/bimalglobal',
    resumePath: '/resumes/bimal-global-engineering-lead-placeholder.pdf',
    resumeLabel: 'Download Resume (Sample PDF)',
    isPlaceholder: true,
  },
  {
    id: 'team-product-design',
    name: 'Product & UI/UX Lead (Placeholder)',
    role: 'Lead Product Designer & Frontend Engineer',
    location: 'Remote',
    photoPath: '/images/team/product-designer.jpg',
    photoAlt: 'Portrait placeholder for Lead Product Designer',
    skills: ['UI/UX Systems', 'Design Tokens', 'Figma', 'Tailwind CSS', 'Accessibility (WCAG 2.2)'],
    biography:
      'Placeholder biography: Replace with verified background covering B2B interface design, design systems, responsive frontends, and usability research.',
    experience: 'Replace with verified product design & frontend engineering background',
    githubUrl: 'https://github.com/bimalglobal',
    linkedinUrl: 'https://linkedin.com/company/bimalglobal',
    resumePath: '/resumes/bimal-global-product-design-placeholder.pdf',
    resumeLabel: 'Download Resume (Sample PDF)',
    isPlaceholder: true,
  },
  {
    id: 'team-mobile-cloud',
    name: 'Mobile & Cloud Specialist (Placeholder)',
    role: 'Mobile Application & DevOps Engineer',
    location: 'Remote',
    photoPath: '/images/team/mobile-cloud-engineer.jpg',
    photoAlt: 'Portrait placeholder for Mobile & Cloud Engineer',
    skills: ['React Native', 'Expo', 'Docker', 'CI/CD', 'Vercel', 'Cloud Infrastructure'],
    biography:
      'Placeholder biography: Replace with verified background covering cross-platform mobile releases, automated deployment pipelines, and runtime observability.',
    experience: 'Replace with verified mobile & infrastructure delivery background',
    githubUrl: 'https://github.com/bimalglobal',
    linkedinUrl: 'https://linkedin.com/company/bimalglobal',
    isPlaceholder: true,
  },
];

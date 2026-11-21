import type { FaqItem } from '@/src/types';

export const faqsData: FaqItem[] = [
  {
    id: 'faq-engagement',
    question: 'What types of engagements does Bimal Global take on?',
    answer:
      'We build new business websites, custom full-stack web applications, UI/UX design systems, mobile applications, cloud deployments, and ongoing maintenance retainers for existing products.',
  },
  {
    id: 'faq-ownership',
    question: 'Do we receive full source code and infrastructure ownership?',
    answer:
      'Yes. All repositories, cloud environments, domains, and design assets created for your project are provisioned under your organization accounts with complete handover documentation.',
  },
  {
    id: 'faq-process',
    question: 'How do you handle project scoping and estimates?',
    answer:
      'Every engagement starts with a structured scoping review. Once goals, key user flows, and technical integrations are clear, we provide a milestone breakdown and timeline before build work begins.',
  },
  {
    id: 'faq-maintenance',
    question: 'Can you maintain or improve an existing codebase?',
    answer:
      'Yes. We regularly audit, stabilize, upgrade dependencies, improve performance and accessibility, and ship new features on active React, Next.js, Node.js, and mobile codebases.',
  },
];

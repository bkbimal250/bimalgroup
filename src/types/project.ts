export type ProjectCategory =
  | 'websites'
  | 'full-stack'
  | 'mobile'
  | 'ui-ux';

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
  aspect?: '16:10' | '4:3' | '16:9';
}

export interface ProjectOutcome {
  label: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  clientType: string;
  shortSummary: string;
  businessProblem: string;
  solution: string;
  role: string;
  stack: string[];
  features: string[];
  screenshots: ProjectScreenshot[];
  liveUrl?: string;
  repositoryUrl?: string;
  outcomes?: ProjectOutcome[];
  isPrivate?: boolean;
  privateNote?: string;
  featured?: boolean;
  isPlaceholder?: boolean;
}

export interface ProjectFilterOption {
  value: 'all' | ProjectCategory;
  label: string;
}

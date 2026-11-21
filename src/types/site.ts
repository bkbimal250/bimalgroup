export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href?: string;
  description: string;
  isPlaceholder?: boolean;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  summary: string;
  deliverables: string[];
}

export interface TrustPrinciple {
  id: string;
  title: string;
  description: string;
}

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface SiteConfig {
  brandName: string;
  legalName: string;
  domain: string;
  tagline: string;
  description: string;
  locationLabel: string;
  primaryEmail: string;
  responseSla: string;
  availabilityNote: string;
  hero: {
    kicker: string;
    headline: string;
    subheading: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  trustSection: {
    eyebrow: string;
    title: string;
    description: string;
    principles: TrustPrinciple[];
  };
  processSection: {
    eyebrow: string;
    title: string;
    description: string;
    steps: ProcessStep[];
  };
  ctaBanner: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  contactChannels: ContactChannel[];
  retentionPolicy: {
    summary: string;
    consentLabel: string;
  };
  privacyPolicy: {
    lastUpdated: string;
    intro: string;
    sections: LegalSection[];
  };
  termsOfUse: {
    lastUpdated: string;
    intro: string;
    sections: LegalSection[];
  };
}

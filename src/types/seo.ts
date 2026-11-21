export interface PageSeoConfig {
  path: string;
  title: string;
  description: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}

export interface SeoCollection {
  siteUrl: string;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  twitterHandle?: string;
  pages: Record<
    'home' | 'work' | 'about' | 'contact' | 'privacy' | 'terms',
    PageSeoConfig
  >;
}

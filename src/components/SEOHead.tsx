import { useEffect } from 'react';
import { seoConfig } from '@/src/data/seo';

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  structuredData?: Record<string, unknown>[];
}

function upsertMeta(attrName: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`meta[${attrName}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function SEOHead({
  title,
  description,
  path,
  ogType = 'website',
  noIndex = false,
  structuredData = [],
}: SEOHeadProps) {
  useEffect(() => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${seoConfig.siteUrl}${normalizedPath === '/' ? '/' : normalizedPath}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:site_name', seoConfig.siteName);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    const existingScripts = document.querySelectorAll('script[data-bimal-jsonld="true"]');
    existingScripts.forEach((node) => node.remove());

    for (const schema of structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-bimal-jsonld', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, path, ogType, noIndex, structuredData]);

  return null;
}

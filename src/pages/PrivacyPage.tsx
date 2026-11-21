import { SEOHead } from '@/src/components/SEOHead';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { seoConfig } from '@/src/data/seo';
import { siteConfig } from '@/src/data/site';

export function PrivacyPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${seoConfig.siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Privacy Policy',
          item: `${seoConfig.siteUrl}/privacy`,
        },
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.pages.privacy.title}
        description={seoConfig.pages.privacy.description}
        path={seoConfig.pages.privacy.path}
        structuredData={structuredData}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />

        <header className="space-y-3 border-b border-[var(--border)] pb-8">
          <p className="text-xs font-medium text-[var(--accent)]">Legal</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--muted)]">
            {siteConfig.privacyPolicy.lastUpdated}
          </p>
          <p className="pt-2 text-base leading-relaxed text-[var(--muted)]">
            {siteConfig.privacyPolicy.intro}
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {siteConfig.privacyPolicy.sections.map((section) => (
            <section key={section.id} className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--text)]">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-sm leading-relaxed text-[var(--muted)] sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}

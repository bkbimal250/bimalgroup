import { Link, useParams } from 'react-router-dom';
import { SEOHead } from '@/src/components/SEOHead';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { ProjectCaseStudy } from '@/src/components/ProjectCaseStudy';
import { EmptyState } from '@/src/components/EmptyState';
import { CTASection } from '@/src/components/CTASection';
import { Button } from '@/src/components/ui/button';
import { projectsData } from '@/src/data/projects';
import { seoConfig } from '@/src/data/seo';
import { siteConfig } from '@/src/data/site';

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData.find((item) => item.slug === slug);

  if (!project) {
    return (
      <>
        <SEOHead
          title={`Project Not Found — ${seoConfig.siteName}`}
          description="The requested project case study could not be found."
          path={`/work/${slug ?? ''}`}
        />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            title="Case study not found"
            description="This project slug does not match an active portfolio entry."
            action={
              <Button asChild>
                <Link to="/work">Return to portfolio</Link>
              </Button>
            }
          />
        </div>
      </>
    );
  }

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
          name: 'Work',
          item: `${seoConfig.siteUrl}/work`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.title,
          item: `${seoConfig.siteUrl}/work/${project.slug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.shortSummary,
      creator: {
        '@type': 'Organization',
        name: siteConfig.legalName,
      },
      url: `${seoConfig.siteUrl}/work/${project.slug}`,
    },
  ];

  return (
    <>
      <SEOHead
        title={`${project.title} — ${seoConfig.siteName}`}
        description={project.shortSummary}
        path={`/work/${project.slug}`}
        ogType="article"
        structuredData={structuredData}
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Work', href: '/work' },
            { label: project.title },
          ]}
        />

        <ProjectCaseStudy project={project} />
      </div>

      <CTASection
        eyebrow={siteConfig.ctaBanner.eyebrow}
        title={siteConfig.ctaBanner.title}
        description={siteConfig.ctaBanner.description}
        primaryCtaLabel={siteConfig.ctaBanner.primaryCtaLabel}
        primaryCtaHref={siteConfig.ctaBanner.primaryCtaHref}
      />
    </>
  );
}

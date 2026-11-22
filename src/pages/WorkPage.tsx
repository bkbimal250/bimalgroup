import { useMemo, useState } from 'react';
import { SEOHead } from '@/src/components/SEOHead';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { SectionHeading } from '@/src/components/SectionHeading';
import { ProjectFilter } from '@/src/components/ProjectFilter';
import { ProjectCard } from '@/src/components/ProjectCard';
import { EmptyState } from '@/src/components/EmptyState';
import { CTASection } from '@/src/components/CTASection';
import { Button } from '@/src/components/ui/button';
import { projectFilterOptions, projectsData } from '@/src/data/projects';
import { seoConfig } from '@/src/data/seo';
import { siteConfig } from '@/src/data/site';
import type { ProjectCategory } from '@/src/types';

export function WorkPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all');

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: projectsData.length };
    for (const project of projectsData) {
      map[project.category] = (map[project.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projectsData;
    return projectsData.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

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
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.pages.work.title}
        description={seoConfig.pages.work.description}
        path={seoConfig.pages.work.path}
        structuredData={structuredData}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Work' },
          ]}
        />

        <div className="space-y-8">
          <SectionHeading
            headingAs="h1"
            eyebrow="Portfolio"
            title="Selected projects & case studies"
            description="Browse work across business websites, full-stack web applications, mobile apps, and UI/UX systems. Template entries are clearly labeled for replacement with verified project assets."
          />

          <ProjectFilter
            options={projectFilterOptions}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={counts}
          />

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects in this category yet"
              description="There are currently no published entries under this filter. View all projects or reach out to discuss relevant experience."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveCategory('all')}
                >
                  Show all projects
                </Button>
              }
            />
          )}
        </div>
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

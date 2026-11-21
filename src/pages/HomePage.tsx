import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEOHead } from '@/src/components/SEOHead';
import { Hero } from '@/src/components/Hero';
import { SectionHeading } from '@/src/components/SectionHeading';
import { ServiceCard } from '@/src/components/ServiceCard';
import { ProjectCard } from '@/src/components/ProjectCard';
import { PartnerLogo } from '@/src/components/PartnerLogo';
import { TestimonialCard } from '@/src/components/TestimonialCard';
import { TeamCard } from '@/src/components/TeamCard';
import { CTASection } from '@/src/components/CTASection';
import { Button } from '@/src/components/ui/button';
import { seoConfig } from '@/src/data/seo';
import { siteConfig } from '@/src/data/site';
import { servicesData } from '@/src/data/services';
import { projectsData } from '@/src/data/projects';
import { partnersData } from '@/src/data/partners';
import { testimonialsData } from '@/src/data/testimonials';
import { teamData } from '@/src/data/team';

export function HomePage() {
  const featuredProjects = projectsData.filter((p) => p.featured).slice(0, 3);
  const teamPreview = teamData.slice(0, 3);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.domain,
      description: siteConfig.description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.brandName,
      url: siteConfig.domain,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      provider: {
        '@type': 'Organization',
        name: siteConfig.legalName,
        url: siteConfig.domain,
      },
      serviceType: servicesData.map((s) => s.title),
      areaServed: 'Worldwide',
      description: siteConfig.description,
    },
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.pages.home.title}
        description={seoConfig.pages.home.description}
        path={seoConfig.pages.home.path}
        structuredData={structuredData}
      />

      <Hero
        kicker={siteConfig.hero.kicker}
        headline={siteConfig.hero.headline}
        subheading={siteConfig.hero.subheading}
        primaryCta={siteConfig.hero.primaryCta}
        secondaryCta={siteConfig.hero.secondaryCta}
        locationLabel={siteConfig.locationLabel}
        availabilityNote={siteConfig.availabilityNote}
      />

      {/* Services */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Services"
              title="Capabilities structured around real product delivery"
              description="Every engagement is scoped clearly across design, engineering, deployment, and ongoing maintenance."
            />
            <Button asChild variant="outline" className="self-start md:self-auto">
              <Link to="/contact">Request scoping</Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Selected Work"
              title="Architecture and interface case studies"
              description="Data-driven project templates ready for verified client launches, live URLs, and NDA-aware private builds."
            />
            <Button asChild variant="outline" className="self-start md:self-auto">
              <Link to="/work">
                <span>View all work</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Engineering Principles */}
      <section className="border-t border-[var(--border)] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={siteConfig.trustSection.eyebrow}
            title={siteConfig.trustSection.title}
            description={siteConfig.trustSection.description}
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.trustSection.principles.map((principle, idx) => (
              <div
                key={principle.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3"
              >
                <span className="font-mono text-xs text-[var(--accent)] tabular-nums">
                  0{idx + 1}
                </span>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  {principle.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners (auto-hides when partnersData is empty) */}
      {partnersData.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)]/30 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Partnerships"
              title="Partner relationships & ecosystem collaboration"
              description="Verified delivery and infrastructure relationships configured from centralized partner data."
            />

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {partnersData.map((partner) => (
                <PartnerLogo key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials (auto-hides when testimonialsData is empty) */}
      {testimonialsData.length > 0 && (
        <section className="border-t border-[var(--border)] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Client Feedback"
              title="Direct perspectives from partner teams"
            />
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonialsData.map((item) => (
                <TestimonialCard key={item.id} testimonial={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Preview */}
      <section className="border-t border-[var(--border)] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="People"
              title="Engineering and design specialists"
              description="Meet the team behind our builds and download individual capability resumes."
            />
            <Button asChild variant="outline" className="self-start md:self-auto">
              <Link to="/about">
                <span>About the studio</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamPreview.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={siteConfig.processSection.eyebrow}
            title={siteConfig.processSection.title}
            description={siteConfig.processSection.description}
          />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {siteConfig.processSection.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5"
              >
                <div className="space-y-3">
                  <span className="font-mono text-xs font-semibold text-[var(--accent)] tabular-nums">
                    Step {step.stepNumber}
                  </span>
                  <h3 className="text-base font-semibold text-[var(--text)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">
                    {step.summary}
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-xs font-medium text-[var(--text)]">
                    Outputs
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                    {step.deliverables.join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <CTASection
        eyebrow={siteConfig.ctaBanner.eyebrow}
        title={siteConfig.ctaBanner.title}
        description={siteConfig.ctaBanner.description}
        primaryCtaLabel={siteConfig.ctaBanner.primaryCtaLabel}
        primaryCtaHref={siteConfig.ctaBanner.primaryCtaHref}
        secondaryCtaLabel={siteConfig.ctaBanner.secondaryCtaLabel}
        secondaryCtaHref={siteConfig.ctaBanner.secondaryCtaHref}
      />
    </>
  );
}

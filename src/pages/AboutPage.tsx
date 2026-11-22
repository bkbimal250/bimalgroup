import { SEOHead } from '@/src/components/SEOHead';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { SectionHeading } from '@/src/components/SectionHeading';
import { TeamCard } from '@/src/components/TeamCard';
import { PartnerLogo } from '@/src/components/PartnerLogo';
import { CTASection } from '@/src/components/CTASection';
import { seoConfig } from '@/src/data/seo';
import { siteConfig } from '@/src/data/site';
import { teamData } from '@/src/data/team';
import { servicesData } from '@/src/data/services';
import { partnersData } from '@/src/data/partners';
import { faqsData } from '@/src/data/faqs';

export function AboutPage() {
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
          name: 'About',
          item: `${seoConfig.siteUrl}/about`,
        },
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.pages.about.title}
        description={seoConfig.pages.about.description}
        path={seoConfig.pages.about.path}
        structuredData={structuredData}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 space-y-20">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About' },
            ]}
          />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeading
                headingAs="h1"
                eyebrow="About Bimal Global"
                title="A focused software studio built on clear engineering and direct accountability"
                description="We partner with founders, operators, and growing teams to design, ship, and maintain reliable websites, web applications, and mobile products."
              />
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
                <p className="text-xs font-medium text-[var(--accent)]">
                  Studio Approach
                </p>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {siteConfig.trustSection.description}
                </p>
                <p className="text-xs text-[var(--muted)] pt-2 border-t border-[var(--border)]">
                  {siteConfig.locationLabel} · {siteConfig.responseSla}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Resumes */}
        <section className="space-y-8 border-t border-[var(--border)] pt-14">
          <SectionHeading
            eyebrow="Team & Resumes"
            title="Engineers & designers"
            description="Profiles and downloadable PDF resumes are configured in src/data/team.ts and served directly from /resumes/."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamData.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Core Capabilities Matrix */}
        <section className="space-y-8 border-t border-[var(--border)] pt-14">
          <SectionHeading
            eyebrow="Technical Capabilities"
            title="End-to-end disciplines under one roof"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2"
              >
                <p className="font-mono text-xs text-[var(--accent)] tabular-nums">
                  {service.index}
                </p>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {service.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Partnerships */}
        {partnersData.length > 0 && (
          <section className="space-y-8 border-t border-[var(--border)] pt-14">
            <SectionHeading
              eyebrow="Partnerships"
              title="Partner network"
              description="Verified partner relationships configured in src/data/partners.ts."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {partnersData.map((partner) => (
                <PartnerLogo key={partner.id} partner={partner} />
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="space-y-8 border-t border-[var(--border)] pt-14">
          <SectionHeading
            eyebrow="Frequently Asked"
            title="Common questions before starting"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {faqsData.map((faq) => (
              <div
                key={faq.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2"
              >
                <h3 className="text-base font-semibold text-[var(--text)]">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
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

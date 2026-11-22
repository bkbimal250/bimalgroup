import { useSearchParams } from 'react-router-dom';
import { Mail, Clock, Briefcase, Phone } from 'lucide-react';
import { SEOHead } from '@/src/components/SEOHead';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { SectionHeading } from '@/src/components/SectionHeading';
import { ContactForm } from '@/src/components/ContactForm';
import { seoConfig } from '@/src/data/seo';
import { siteConfig } from '@/src/data/site';
import { budgetOptions, servicesData } from '@/src/data/services';

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  'response-window': Clock,
  engagement: Briefcase,
};

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') ?? undefined;
  const serviceOptions = servicesData.map((s) => s.title);

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
          name: 'Contact',
          item: `${seoConfig.siteUrl}/contact`,
        },
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.pages.contact.title}
        description={seoConfig.pages.contact.description}
        path={seoConfig.pages.contact.path}
        structuredData={structuredData}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact' },
          ]}
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-5">
            <SectionHeading
              headingAs="h1"
              eyebrow="Start a Project"
              title="Tell us what you are building"
              description="Share your scope, target timeline, and technical context. We review every enquiry directly and respond with practical next steps."
            />

            <div className="space-y-4">
              {siteConfig.contactChannels.map((channel) => {
                const IconComponent = channelIcons[channel.id] ?? Mail;
                return (
                  <div
                    key={channel.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent)]">
                      <IconComponent className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{channel.label}</span>
                    </div>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="block text-base font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-[var(--text)]">
                        {channel.value}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed text-[var(--muted)]">
                      {channel.description}
                    </p>
                    {channel.id === 'phone' && (
                      <a
                        href="https://wa.me/919116458453"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block pt-1 text-xs font-medium text-[var(--accent)] underline underline-offset-4 hover:text-[var(--accent-hover)]"
                      >
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div id="enquiry" className="lg:col-span-7">
            <ContactForm
              serviceOptions={serviceOptions}
              budgetOptions={budgetOptions}
              initialService={initialService}
              consentLabel={siteConfig.retentionPolicy.consentLabel}
              retentionSummary={siteConfig.retentionPolicy.summary}
              fallbackEmail={siteConfig.primaryEmail}
            />
          </div>
        </div>
      </div>
    </>
  );
}

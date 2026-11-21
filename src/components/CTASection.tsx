import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface CTASectionProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export function CTASection({
  eyebrow,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-12 sm:px-12 sm:py-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-medium tracking-wider text-[var(--accent)]">
                {eyebrow}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl [text-wrap:balance]">
                {title}
              </h2>
              <p className="text-base leading-relaxed text-[var(--muted)]">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild size="lg">
                <Link to={primaryCtaHref}>
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              {secondaryCtaLabel && secondaryCtaHref && (
                <Button asChild variant="outline" size="lg">
                  <Link to={secondaryCtaHref}>{secondaryCtaLabel}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Code2, Layers, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ThemeSwitcher } from '@/src/components/ThemeSwitcher';

interface HeroProps {
  kicker: string;
  headline: string;
  subheading: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  locationLabel: string;
  availabilityNote: string;
}

export function Hero({
  kicker,
  headline,
  subheading,
  primaryCta,
  secondaryCta,
  locationLabel,
  availabilityNote,
}: HeroProps) {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center space-y-6 lg:col-span-7"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted)]">
              <span className="text-[var(--accent)]">{kicker}</span>
              <span aria-hidden="true">·</span>
              <span>{locationLabel}</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.1] [text-wrap:balance]">
              {headline}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {subheading}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg">
                <Link to={primaryCta.href}>
                  <span>{primaryCta.label}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>

            <p className="text-xs text-[var(--muted)]">{availabilityNote}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
              <div className="space-y-1 border-b border-[var(--border)] pb-5">
                <p className="text-xs font-medium text-[var(--accent)]">
                  Product Engineering Scope
                </p>
                <p className="text-lg font-semibold text-[var(--text)]">
                  End-to-end delivery architecture
                </p>
              </div>

              <div className="my-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                    <Layers className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      Websites & Design Systems
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                      Semantic markup, accessible contrast, and structured SEO architecture.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                    <Code2 className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      Full-Stack Platforms
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                      Typed APIs, validated workflows, and clean repository ownership.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      Mobile & Cloud Releases
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                      Cross-platform apps, dependable CI/CD, and long-term maintenance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                  <span>TypeScript & WCAG 2.2 AA Focus</span>
                </span>
                <span className="font-mono">01 — 06</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <ThemeSwitcher variant="compact" />
        </div>
      </div>
    </section>
  );
}

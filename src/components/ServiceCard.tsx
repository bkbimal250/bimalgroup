import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { ServiceItem } from '@/src/types';

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors duration-150 hover:border-[var(--accent)]/60">
      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] pb-3">
          <span className="font-mono text-xs font-medium text-[var(--accent)] tabular-nums">
            {service.index}
          </span>
          <span className="text-xs text-[var(--muted)]">Capability</span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">
          {service.title}
        </h3>

        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {service.summary}
        </p>

        <ul className="space-y-2 pt-1">
          {service.capabilities.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--text)]/90"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-[var(--border)] pt-4">
        <Link
          to={`/contact?service=${encodeURIComponent(service.ctaServiceParam)}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
        >
          <span>{service.ctaLabel}</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

import { useState } from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import type { PartnerItem } from '@/src/types';

interface PartnerLogoProps {
  partner: PartnerItem;
}

export function PartnerLogo({ partner }: PartnerLogoProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(partner.logoPath) && !logoFailed;

  return (
    <article className="flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex h-11 items-center gap-3">
            {showLogo ? (
              <img
                src={partner.logoPath}
                alt={partner.logoAlt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setLogoFailed(true)}
                className="h-8 w-auto max-w-[140px] object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-[var(--text)]">
                {partner.companyName}
              </h3>
              <p className="text-xs text-[var(--muted)]">
                {partner.relationshipType}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {partner.description}
        </p>
      </div>

      {partner.website && (
        <div className="mt-5 border-t border-[var(--border)] pt-3">
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            <span>Visit partner website</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}

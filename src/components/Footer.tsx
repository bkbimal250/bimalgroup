import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '@/src/components/ThemeSwitcher';
import type { FooterColumn, NavLinkItem } from '@/src/types';

interface FooterProps {
  brandName: string;
  legalName: string;
  description: string;
  locationLabel: string;
  primaryEmail: string;
  primaryPhone?: string;
  primaryPhoneHref?: string;
  columns: FooterColumn[];
  legalLinks: NavLinkItem[];
}

export function Footer({
  brandName,
  legalName,
  description,
  locationLabel,
  primaryEmail,
  primaryPhone,
  primaryPhoneHref,
  columns,
  legalLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <Link
              to="/"
              className="inline-block text-lg font-bold tracking-tight text-[var(--text)]"
            >
              {brandName}
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {description}
            </p>
            <div className="space-y-1 text-xs text-[var(--muted)]">
              <p>{locationLabel}</p>
              <p>
                <a
                  href={`mailto:${primaryEmail}`}
                  className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                >
                  {primaryEmail}
                </a>
              </p>
              {primaryPhone && (
                <p>
                  <a
                    href={primaryPhoneHref || `tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                  >
                    {primaryPhone}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 sm:grid-cols-2 lg:pl-12">
            {columns.map((column) => (
              <div key={column.heading} className="space-y-3">
                <h2 className="text-xs font-semibold tracking-wider text-[var(--text)]">
                  {column.heading}
                </h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <ThemeSwitcher variant="inline" />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="transition-colors hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { MobileNav } from '@/src/components/MobileNav';
import type { NavLinkItem } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface HeaderProps {
  brandName: string;
  links: NavLinkItem[];
  primaryCta: NavLinkItem;
}

export function Header({ brandName, links, primaryCta }: HeaderProps) {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-[var(--text)] whitespace-nowrap shrink-0"
        >
          {brandName}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {links.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 underline-offset-8',
                  isActive
                    ? 'text-[var(--text)] underline decoration-[var(--accent)] decoration-2'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:underline',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <MobileNav
            brandName={brandName}
            links={links}
            primaryCta={primaryCta}
          />
        </div>
      </div>
    </header>
  );
}

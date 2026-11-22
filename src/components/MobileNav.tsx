import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import type { NavLinkItem } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface MobileNavProps {
  brandName: string;
  links: NavLinkItem[];
  primaryCta: NavLinkItem;
}

export function MobileNav({ brandName, links, primaryCta }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] md:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-base font-bold tracking-tight text-[var(--text)]">
          {brandName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Primary mobile navigation links
        </DialogDescription>
        <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-2">
          {links.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--surface)] text-[var(--text)]'
                    : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-[var(--border)]">
          <Button asChild className="w-full">
            <Link to={primaryCta.href} onClick={() => setOpen(false)}>
              {primaryCta.label}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

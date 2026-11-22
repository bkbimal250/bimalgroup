import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Percent, X } from 'lucide-react';
import { ContactForm } from '@/src/components/ContactForm';
import { budgetOptions, servicesData } from '@/src/data/services';
import { siteConfig } from '@/src/data/site';

const POPUP_DELAY_MS = 20_000;
const POPUP_SEEN_KEY = 'bimal-global-enquiry-popup-seen';

export function EnquiryPopup() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isSuppressedRoute =
    pathname === '/contact' || pathname === '/enquiries';

  useEffect(() => {
    if (isSuppressedRoute) {
      setOpen(false);
      return;
    }

    try {
      if (window.sessionStorage.getItem(POPUP_SEEN_KEY) === 'true') {
        return;
      }
    } catch {
      // Continue if sessionStorage is unavailable
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
      try {
        window.sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
      } catch {
        // Ignore storage errors
      }
    }, POPUP_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isSuppressedRoute]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      try {
        window.sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
      } catch {
        // Ignore storage errors
      }
    }
  };

  const serviceOptions = servicesData.map((s) => s.title);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-2xl focus:outline-none">
          <div className="border-b border-[var(--border)] bg-[var(--bg)]/80 px-6 py-5 pr-12 sm:px-8">
            <div className="inline-flex items-center gap-2 border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-[var(--accent)]">
              <Percent className="h-3.5 w-3.5" aria-hidden="true" />
              <span>20% DISCOUNT · VALID TILL 2027</span>
            </div>

            <DialogPrimitive.Title className="mt-3 text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
              Start Your Project &amp; Save 20%
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
              Get 20% off milestone pricing till 2027 on business websites,
              custom CRMs &amp; dashboards, SEO, WhatsApp AI automation, and
              custom chatbots.
            </DialogPrimitive.Description>
          </div>

          <div
            className="p-6 sm:p-8"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest('a[href]')) {
                handleOpenChange(false);
              }
            }}
          >
            <ContactForm
              embedded
              idPrefix="popup-enquiry"
              serviceOptions={serviceOptions}
              budgetOptions={budgetOptions}
              consentLabel={siteConfig.retentionPolicy.consentLabel}
              retentionSummary={siteConfig.retentionPolicy.summary}
              fallbackEmail={siteConfig.primaryEmail}
              onSubmitted={() => {
                try {
                  window.sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
                } catch {
                  // Ignore storage errors
                }
              }}
            />
          </div>

          <DialogPrimitive.Close
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            aria-label="Close enquiry popup"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

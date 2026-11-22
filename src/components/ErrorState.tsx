import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

interface ErrorStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-left',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
          aria-hidden="true"
        />
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {description}
          </p>
          {action && <div className="pt-2">{action}</div>}
        </div>
      </div>
    </div>
  );
}

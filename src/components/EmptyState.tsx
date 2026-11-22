import type { ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--muted)]">
        <FolderOpen className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

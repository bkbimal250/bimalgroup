import * as React from 'react';
import { cn } from '@/src/lib/utils';

export function Separator({ className }: { className?: string }) {
  return (
    <hr
      className={cn('border-0 border-t border-[var(--border)] my-0', className)}
    />
  );
}

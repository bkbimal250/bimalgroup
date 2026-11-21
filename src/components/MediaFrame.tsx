import { useState } from 'react';
import { Layers } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface MediaFrameProps {
  src?: string;
  alt: string;
  caption?: string;
  aspect?: '16:10' | '4:3' | '16:9' | '1:1';
  label?: string;
  className?: string;
}

const aspectClasses: Record<NonNullable<MediaFrameProps['aspect']>, string> = {
  '16:10': 'aspect-[16/10]',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '1:1': 'aspect-square',
};

export function MediaFrame({
  src,
  alt,
  caption,
  aspect = '16:10',
  label,
  className,
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <figure className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]',
          aspectClasses[aspect],
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
                <Layers className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span>{label ?? 'Preview Frame'}</span>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                {aspect}
              </span>
            </div>

            <div className="my-auto grid grid-cols-12 gap-3 py-4">
              <div className="col-span-4 space-y-2">
                <div className="h-2.5 w-3/4 rounded bg-[var(--surface-elevated)]" />
                <div className="h-2 w-full rounded bg-[var(--border)]" />
                <div className="h-2 w-5/6 rounded bg-[var(--border)]" />
              </div>
              <div className="col-span-8 space-y-2 rounded-lg border border-[var(--border)] bg-[var(--bg)]/60 p-3">
                <div className="h-2.5 w-1/3 rounded bg-[var(--accent)]/40" />
                <div className="h-2 w-full rounded bg-[var(--surface-elevated)]" />
                <div className="h-2 w-4/5 rounded bg-[var(--surface-elevated)]" />
              </div>
            </div>

            <p className="text-xs text-[var(--muted)] line-clamp-1">
              {alt}
            </p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-xs text-[var(--muted)]">{caption}</figcaption>
      )}
    </figure>
  );
}

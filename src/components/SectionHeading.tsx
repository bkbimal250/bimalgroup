import { cn } from '@/src/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  headingAs?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  headingAs = 'h2',
}: SectionHeadingProps) {
  const HeadingTag = headingAs;

  return (
    <div
      className={cn(
        'max-w-2xl space-y-3',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-medium tracking-wider text-[var(--accent)]">
          {eyebrow}
        </p>
      )}
      <HeadingTag className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl [text-wrap:balance]">
        {title}
      </HeadingTag>
      {description && (
        <p className="text-base leading-relaxed text-[var(--muted)]">
          {description}
        </p>
      )}
    </div>
  );
}

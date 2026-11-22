import type { TestimonialItem } from '@/src/types';

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <blockquote className="text-sm leading-relaxed text-[var(--text)]">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-5 border-t border-[var(--border)] pt-4">
        <p className="text-sm font-semibold text-[var(--text)]">
          {testimonial.authorName}
        </p>
        <p className="text-xs text-[var(--muted)]">
          {[testimonial.authorRole, testimonial.organization]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {testimonial.projectContext && (
          <p className="mt-1 text-xs text-[var(--muted)]">
            {testimonial.projectContext}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

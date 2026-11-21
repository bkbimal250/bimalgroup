import type { ProjectCategory, ProjectFilterOption } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface ProjectFilterProps {
  options: ProjectFilterOption[];
  activeCategory: 'all' | ProjectCategory;
  onSelectCategory: (category: 'all' | ProjectCategory) => void;
  counts?: Record<string, number>;
}

export function ProjectFilter({
  options,
  activeCategory,
  onSelectCategory,
  counts,
}: ProjectFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className="flex flex-wrap items-center gap-2"
    >
      {options.map((option) => {
        const isActive = option.value === activeCategory;
        const count = counts?.[option.value];
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelectCategory(option.value)}
            aria-pressed={isActive}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer',
              isActive
                ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--text)]',
            )}
          >
            <span>{option.label}</span>
            {typeof count === 'number' && (
              <span
                className={cn(
                  'font-mono text-xs tabular-nums',
                  isActive ? 'opacity-90' : 'opacity-70',
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

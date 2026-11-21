import { Check, Palette } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { cn } from '@/src/lib/utils';

interface ThemeSwitcherProps {
  variant?: 'inline' | 'compact';
  className?: string;
}

export function ThemeSwitcher({
  variant = 'inline',
  className,
}: ThemeSwitcherProps) {
  const { themeId, allThemes, setThemeId } = useTheme();

  if (variant === 'compact') {
    return (
      <div
        className={cn('flex flex-wrap items-center gap-2', className)}
        role="group"
        aria-label="Preview color theme"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
          <Palette className="h-3.5 w-3.5" aria-hidden="true" />
          Theme:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {allThemes.map((theme) => {
            const active = theme.id === themeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                aria-pressed={active}
                title={`${theme.name} — ${theme.description}`}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer',
                  active
                    ? 'border-[var(--accent)] bg-[var(--surface)] text-[var(--text)]'
                    : 'border-[var(--border)] bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--muted)]',
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 rounded-sm border border-white/20"
                  style={{ backgroundColor: theme.tokens.accent }}
                />
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('space-y-3', className)}
      role="group"
      aria-label="Studio color theme selector"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
        <Palette className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Theme Preview</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {allThemes.map((theme) => {
          const active = theme.id === themeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setThemeId(theme.id)}
              aria-pressed={active}
              className={cn(
                'flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer',
                active
                  ? 'border-[var(--accent)] bg-[var(--surface-elevated)] text-[var(--text)]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--text)]',
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-4 w-4 shrink-0 overflow-hidden rounded border border-[var(--border)]"
                  >
                    <span
                      className="h-full w-1/2"
                      style={{ backgroundColor: theme.tokens.bg }}
                    />
                    <span
                      className="h-full w-1/2"
                      style={{ backgroundColor: theme.tokens.accent }}
                    />
                  </span>
                  <span className="truncate text-xs font-semibold text-[var(--text)]">
                    {theme.name}
                  </span>
                </div>
              </div>
              {active && (
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

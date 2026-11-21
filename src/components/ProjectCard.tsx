import { Link } from 'react-router-dom';
import { ArrowUpRight, Lock } from 'lucide-react';
import { MediaFrame } from '@/src/components/MediaFrame';
import type { ProjectItem } from '@/src/types';

interface ProjectCardProps {
  project: ProjectItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const leadScreenshot = project.screenshots[0];

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-150 hover:border-[var(--accent)]/60">
      <div className="space-y-4">
        <Link
          to={`/work/${project.slug}`}
          className="block focus:outline-none"
          aria-label={`Read case study: ${project.title}`}
        >
          <MediaFrame
            src={leadScreenshot?.src}
            alt={leadScreenshot?.alt ?? project.title}
            aspect="16:10"
            label={project.categoryLabel}
          />
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <span className="font-medium text-[var(--accent)]">
            {project.categoryLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{project.year}</span>
          {project.isPrivate && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Private Build
              </span>
            </>
          )}
          {project.isPlaceholder && (
            <>
              <span aria-hidden="true">·</span>
              <span>Sample Template</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">
          <Link
            to={`/work/${project.slug}`}
            className="transition-colors hover:text-[var(--accent)]"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {project.shortSummary}
        </p>
      </div>

      <div className="mt-6 space-y-4 border-t border-[var(--border)] pt-4">
        <p className="text-xs font-mono text-[var(--muted)]">
          {project.stack.join(' · ')}
        </p>
        <Link
          to={`/work/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--accent)]"
        >
          <span>View case study</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

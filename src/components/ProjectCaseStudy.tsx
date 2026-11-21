import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Lock } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { MediaFrame } from '@/src/components/MediaFrame';
import type { ProjectItem } from '@/src/types';

interface ProjectCaseStudyProps {
  project: ProjectItem;
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  return (
    <article className="space-y-12">
      <header className="space-y-6 border-b border-[var(--border)] pb-10">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--muted)]">
          <span className="font-medium text-[var(--accent)]">
            {project.categoryLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.clientType}</span>
          {project.isPlaceholder && (
            <>
              <span aria-hidden="true">·</span>
              <span>Editable Sample Case Study</span>
            </>
          )}
        </div>

        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl [text-wrap:balance]">
          {project.title}
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {project.shortSummary}
        </p>

        {project.isPrivate && (
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)] max-w-2xl">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
            <span>
              {project.privateNote ??
                'This engagement is a private client build; live deployment access is restricted.'}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl && (
            <Button asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Visit Live Project</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          )}
          {project.repositoryUrl && (
            <Button asChild variant="outline">
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>View Repository</span>
              </a>
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link to={`/contact?service=${encodeURIComponent(project.categoryLabel)}`}>
              Discuss a similar build
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 border-b border-[var(--border)] pb-10 md:grid-cols-12">
        <div className="space-y-2 md:col-span-6">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--muted)]">
            Role & Scope
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text)]">
            {project.role}
          </p>
        </div>
        <div className="space-y-2 md:col-span-6">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--muted)]">
            Technology Stack
          </h2>
          <p className="font-mono text-sm leading-relaxed text-[var(--text)]">
            {project.stack.join(' · ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="space-y-3 lg:col-span-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
            Business Context & Problem
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted)]">
            {project.businessProblem}
          </p>
        </section>

        <section className="space-y-3 lg:col-span-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
            Engineering Solution
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted)]">
            {project.solution}
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">
          Key Capabilities Delivered
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {project.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--muted)]"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {project.outcomes && project.outcomes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
            Verified Outcomes
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.outcomes.map((outcome) => (
              <div
                key={outcome.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <p className="text-sm font-semibold text-[var(--text)]">
                  {outcome.label}
                </p>
                <p className="mt-1.5 text-sm text-[var(--muted)]">
                  {outcome.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {project.screenshots.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
            Interface Previews
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {project.screenshots.map((shot, idx) => (
              <MediaFrame
                key={`${shot.src}-${idx}`}
                src={shot.src}
                alt={shot.alt}
                caption={shot.caption}
                aspect={shot.aspect ?? '16:10'}
                label={`Capture 0${idx + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-[var(--border)] pt-8">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to all projects</span>
        </Link>
      </div>
    </article>
  );
}

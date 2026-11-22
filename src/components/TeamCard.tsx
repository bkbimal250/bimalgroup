import { useState } from 'react';
import { FileDown, Github, Linkedin } from 'lucide-react';
import type { TeamMember } from '@/src/types';

interface TeamCardProps {
  member: TeamMember;
}

function getInitials(name: string): string {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function TeamCard({ member }: TeamCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]">
            {member.photoPath && !imgError ? (
              <img
                src={member.photoPath}
                alt={member.photoAlt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                aria-label={member.photoAlt}
                className="flex h-full w-full items-center justify-center font-mono text-sm font-semibold text-[var(--accent)]"
              >
                {getInitials(member.name)}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <h3 className="text-base font-semibold tracking-tight text-[var(--text)]">
              {member.name}
            </h3>
            <p className="text-sm text-[var(--accent)]">{member.role}</p>
            {(member.location || member.isPlaceholder) && (
              <p className="text-xs text-[var(--muted)]">
                {[member.location, member.isPlaceholder ? 'Editable profile' : null]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {member.biography}
        </p>

        <div className="space-y-1.5 border-t border-[var(--border)] pt-3">
          <p className="text-xs font-medium text-[var(--text)]">Experience</p>
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            {member.experience}
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[var(--text)]">Core Stack</p>
          <p className="font-mono text-xs leading-relaxed text-[var(--muted)]">
            {member.skills.join(' · ')}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-3">
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on GitHub`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          )}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>

        {member.resumePath && (
          <a
            href={member.resumePath}
            download
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{member.resumeLabel ?? 'Download Resume'}</span>
          </a>
        )}
      </div>
    </article>
  );
}

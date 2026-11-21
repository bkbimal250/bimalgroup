export interface TeamMember {
  id: string;
  name: string;
  role: string;
  location?: string;
  photoPath: string;
  photoAlt: string;
  skills: string[];
  biography: string;
  experience: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumePath?: string;
  resumeLabel?: string;
  isPlaceholder?: boolean;
}

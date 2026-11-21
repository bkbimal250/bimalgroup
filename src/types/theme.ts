export type ThemeId =
  | 'midnight-tech'
  | 'clean-corporate'
  | 'emerald-studio'
  | 'slate-violet'
  | 'warm-editorial';

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  accent: string;
  accentHover: string;
  accentForeground: string;
  text: string;
  muted: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  mode: 'dark' | 'light';
  tokens: ThemeTokens;
}

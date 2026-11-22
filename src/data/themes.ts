import type { ThemeDefinition, ThemeId } from '@/src/types';

export const DEFAULT_THEME_ID: ThemeId = 'midnight-tech';

export const THEME_STORAGE_KEY = 'bimal-global-theme';

export const themes: ThemeDefinition[] = [
  {
    id: 'midnight-tech',
    name: 'Midnight Tech',
    description: 'Deep navy slate with crisp electric blue accents',
    mode: 'dark',
    tokens: {
      bg: '#0B1220',
      surface: '#162238',
      surfaceElevated: '#1D2C47',
      border: '#243554',
      accent: '#3B82F6',
      accentHover: '#60A5FA',
      accentForeground: '#0B1220',
      text: '#F8FAFC',
      muted: '#94A3B8',
    },
  },
  {
    id: 'clean-corporate',
    name: 'Clean Corporate',
    description: 'Crisp pure white canvas with high-contrast cobalt',
    mode: 'light',
    tokens: {
      bg: '#FFFFFF',
      surface: '#F1F5F9',
      surfaceElevated: '#E2E8F0',
      border: '#CBD5E1',
      accent: '#2563EB',
      accentHover: '#1D4ED8',
      accentForeground: '#FFFFFF',
      text: '#0F172A',
      muted: '#64748B',
    },
  },
  {
    id: 'emerald-studio',
    name: 'Emerald Studio',
    description: 'Premium dark evergreen engineering studio',
    mode: 'dark',
    tokens: {
      bg: '#0C1715',
      surface: '#172824',
      surfaceElevated: '#1F3630',
      border: '#253D37',
      accent: '#34D399',
      accentHover: '#6EE7B7',
      accentForeground: '#0C1715',
      text: '#F0FDF4',
      muted: '#9DB5AC',
    },
  },
  {
    id: 'slate-violet',
    name: 'Slate & Violet',
    description: 'Charcoal obsidian with refined violet highlights',
    mode: 'dark',
    tokens: {
      bg: '#11111B',
      surface: '#202035',
      surfaceElevated: '#282842',
      border: '#2E2E4A',
      accent: '#A78BFA',
      accentHover: '#C4B5FD',
      accentForeground: '#11111B',
      text: '#F8F7FF',
      muted: '#A5A3BC',
    },
  },
  {
    id: 'warm-editorial',
    name: 'Warm Editorial',
    description: 'Warm archival paper with earthy terracotta ink',
    mode: 'light',
    tokens: {
      bg: '#FAF8F4',
      surface: '#F0EBE3',
      surfaceElevated: '#E7DFD3',
      border: '#DDD3C5',
      accent: '#A65E39',
      accentHover: '#8E4E2E',
      accentForeground: '#FAF8F4',
      text: '#292524',
      muted: '#78716C',
    },
  },
];

export const themeMap: Record<ThemeId, ThemeDefinition> = themes.reduce(
  (acc, theme) => {
    acc[theme.id] = theme;
    return acc;
  },
  {} as Record<ThemeId, ThemeDefinition>,
);

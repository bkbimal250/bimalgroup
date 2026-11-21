import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY, themeMap, themes } from '@/src/data/themes';
import type { ThemeDefinition, ThemeId } from '@/src/types';

interface ThemeContextValue {
  themeId: ThemeId;
  activeTheme: ThemeDefinition;
  allThemes: ThemeDefinition[];
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isValidThemeId(value: string | null): value is ThemeId {
  return value !== null && Object.prototype.hasOwnProperty.call(themeMap, value);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME_ID;
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      return isValidThemeId(stored) ? stored : DEFAULT_THEME_ID;
    } catch {
      return DEFAULT_THEME_ID;
    }
  });

  useEffect(() => {
    const active = themeMap[themeId] ?? themeMap[DEFAULT_THEME_ID];
    const root = document.documentElement;
    root.setAttribute('data-theme', active.id);
    if (active.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, active.id);
    } catch {
      // Storage may be unavailable in restricted contexts
    }
  }, [themeId]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      activeTheme: themeMap[themeId] ?? themeMap[DEFAULT_THEME_ID],
      allThemes: themes,
      setThemeId: (nextId: ThemeId) => {
        if (isValidThemeId(nextId)) {
          setThemeIdState(nextId);
        }
      },
    }),
    [themeId],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}

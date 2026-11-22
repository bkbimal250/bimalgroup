import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import {
  clearCachedAccessToken,
  googleSignIn,
  initAuth,
  logout,
} from '@/src/lib/googleAuth';
import type { ConnectedSheetConfig } from '@/src/types';

const SHEET_CONFIG_STORAGE_KEY = 'bimal-global-sheet-config';

function readStoredSheetConfig(): ConnectedSheetConfig | null {
  try {
    const raw = window.localStorage.getItem(SHEET_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConnectedSheetConfig>;
    if (
      typeof parsed.spreadsheetId === 'string' &&
      parsed.spreadsheetId.trim() &&
      typeof parsed.sheetName === 'string' &&
      parsed.sheetName.trim()
    ) {
      return {
        spreadsheetId: parsed.spreadsheetId,
        spreadsheetTitle: parsed.spreadsheetTitle || 'Connected Google Sheet',
        spreadsheetUrl:
          parsed.spreadsheetUrl ||
          `https://docs.google.com/spreadsheets/d/${parsed.spreadsheetId}/edit`,
        sheetName: parsed.sheetName,
        sheets: Array.isArray(parsed.sheets) ? parsed.sheets : [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

interface SheetsContextValue {
  user: User | null;
  accessToken: string | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  authError: string | null;
  appsScriptConfigured: boolean;
  connectedSheet: ConnectedSheetConfig | null;
  handleSignIn: () => Promise<string | null>;
  handleLogout: () => Promise<void>;
  markTokenExpired: () => void;
  setConnectedSheetConfig: (config: ConnectedSheetConfig | null) => void;
  updateSelectedTab: (sheetName: string) => void;
  disconnectSheet: () => void;
}

const SheetsContext = createContext<SheetsContextValue | null>(null);

export function SheetsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [appsScriptConfigured, setAppsScriptConfigured] = useState<boolean>(false);
  const [connectedSheet, setConnectedSheet] =
    useState<ConnectedSheetConfig | null>(() =>
      typeof window !== 'undefined' ? readStoredSheetConfig() : null,
    );

  useEffect(() => {
    const unsubscribe = initAuth(
      (signedInUser, token) => {
        setUser(signedInUser);
        setAccessToken(token);
        setNeedsAuth(false);
        setAuthError(null);
      },
      (signedInUser) => {
        setUser(signedInUser);
        setAccessToken(null);
        setNeedsAuth(true);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { appsScriptConfigured?: boolean } | null) => {
        if (active && data && typeof data.appsScriptConfigured === 'boolean') {
          setAppsScriptConfigured(data.appsScriptConfigured);
        }
      })
      .catch(() => {
        // Ignore transient health errors
      });
    return () => {
      active = false;
    };
  }, []);

  const persistSheetConfig = useCallback(
    (config: ConnectedSheetConfig | null) => {
      setConnectedSheet(config);
      try {
        if (config) {
          window.localStorage.setItem(
            SHEET_CONFIG_STORAGE_KEY,
            JSON.stringify(config),
          );
        } else {
          window.localStorage.removeItem(SHEET_CONFIG_STORAGE_KEY);
        }
      } catch {
        // Ignore storage errors
      }
    },
    [],
  );

  const handleSignIn = useCallback(async (): Promise<string | null> => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setAccessToken(result.accessToken);
      setNeedsAuth(false);
      return result.accessToken;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign-in was cancelled or could not complete.';
      setAuthError(message);
      return null;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setAccessToken(null);
    setUser(null);
    setNeedsAuth(true);
    setAuthError(null);
  }, []);

  const markTokenExpired = useCallback(() => {
    clearCachedAccessToken();
    setAccessToken(null);
    setNeedsAuth(true);
  }, []);

  const updateSelectedTab = useCallback(
    (sheetName: string) => {
      if (!connectedSheet) return;
      persistSheetConfig({ ...connectedSheet, sheetName });
    },
    [connectedSheet, persistSheetConfig],
  );

  const disconnectSheet = useCallback(() => {
    persistSheetConfig(null);
  }, [persistSheetConfig]);

  const value = useMemo<SheetsContextValue>(
    () => ({
      user,
      accessToken,
      needsAuth,
      isLoggingIn,
      authError,
      appsScriptConfigured,
      connectedSheet,
      handleSignIn,
      handleLogout,
      markTokenExpired,
      setConnectedSheetConfig: persistSheetConfig,
      updateSelectedTab,
      disconnectSheet,
    }),
    [
      user,
      accessToken,
      needsAuth,
      isLoggingIn,
      authError,
      appsScriptConfigured,
      connectedSheet,
      handleSignIn,
      handleLogout,
      markTokenExpired,
      persistSheetConfig,
      updateSelectedTab,
      disconnectSheet,
    ],
  );

  return (
    <SheetsContext.Provider value={value}>{children}</SheetsContext.Provider>
  );
}

export function useSheets() {
  const ctx = useContext(SheetsContext);
  if (!ctx) {
    throw new Error('useSheets must be used within a SheetsProvider');
  }
  return ctx;
}

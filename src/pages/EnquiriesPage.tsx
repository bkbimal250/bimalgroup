import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  FolderPlus,
  Link2,
  LogOut,
  RefreshCw,
  Send,
  Trash2,
  Unlink,
} from 'lucide-react';
import { SEOHead } from '@/src/components/SEOHead';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { SectionHeading } from '@/src/components/SectionHeading';
import { GoogleSignInButton } from '@/src/components/GoogleSignInButton';
import { ConfirmSheetActionDialog } from '@/src/components/ConfirmSheetActionDialog';
import { ErrorState } from '@/src/components/ErrorState';
import { EmptyState } from '@/src/components/EmptyState';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { useSheets } from '@/src/context/SheetsContext';
import { seoConfig } from '@/src/data/seo';
import type {
  ConnectedSheetConfig,
  EnquiryStatusOption,
  SheetEnquiryRow,
  SheetTabInfo,
} from '@/src/types';

const STATUS_OPTIONS: EnquiryStatusOption[] = [
  'New',
  'In Review',
  'Replied',
  'Archived',
];

type PendingAction =
  | {
      type: 'prepareHeaders';
      spreadsheetId: string;
      spreadsheetTitle: string;
      spreadsheetUrl: string;
      sheetName: string;
      sheetId: number;
      sheets: SheetTabInfo[];
      existingHeaders: string[];
    }
  | {
      type: 'updateStatus';
      row: SheetEnquiryRow;
      nextStatus: EnquiryStatusOption;
    }
  | {
      type: 'deleteRow';
      row: SheetEnquiryRow;
    };

function formatDateLabel(raw: string): string {
  if (!raw) return '—';
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function EnquiriesPage() {
  const {
    user,
    accessToken,
    needsAuth,
    isLoggingIn,
    authError,
    connectedSheet,
    handleSignIn,
    handleLogout,
    markTokenExpired,
    setConnectedSheetConfig,
    updateSelectedTab,
    disconnectSheet,
  } = useSheets();

  const [newSheetTitle, setNewSheetTitle] = useState('Bimal Global Enquiries');
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [fetchedMeta, setFetchedMeta] = useState<{
    spreadsheetId: string;
    spreadsheetTitle: string;
    spreadsheetUrl: string;
    sheets: SheetTabInfo[];
  } | null>(null);
  const [selectedExistingTab, setSelectedExistingTab] = useState('');

  const [enquiries, setEnquiries] = useState<SheetEnquiryRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | EnquiryStatusOption>('All');
  const [isCreating, setIsCreating] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isConnectingTab, setIsConnectingTab] = useState(false);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [isMutatingRow, setIsMutatingRow] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);
  const [pageSuccess, setPageSuccess] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const handleApiAuthError = useCallback(
    (code?: string, fallbackMsg?: string) => {
      if (code === 'AUTH_EXPIRED' || code === 'AUTH_REQUIRED') {
        markTokenExpired();
        setPageError(
          'Your Google Sheets session expired. Please sign in with Google again to continue.',
        );
        return true;
      }
      if (fallbackMsg) {
        setPageError(fallbackMsg);
      }
      return false;
    },
    [markTokenExpired],
  );

  const loadEnquiries = useCallback(
    async (sheetConfig: ConnectedSheetConfig, token: string) => {
      setIsLoadingRows(true);
      setPageError(null);
      try {
        const params = new URLSearchParams({
          spreadsheetId: sheetConfig.spreadsheetId,
          sheetName: sheetConfig.sheetName,
        });
        const res = await fetch(`/api/sheets/enquiries?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await res.json()) as {
          ok: boolean;
          code?: string;
          error?: string;
          enquiries?: SheetEnquiryRow[];
        };

        if (!res.ok || !data.ok) {
          handleApiAuthError(
            data.code,
            data.error || 'Could not load enquiries from Google Sheets.',
          );
          return;
        }

        setEnquiries(data.enquiries ?? []);
      } catch {
        setPageError('Network error while loading enquiries from Google Sheets.');
      } finally {
        setIsLoadingRows(false);
      }
    },
    [handleApiAuthError],
  );

  useEffect(() => {
    if (accessToken && connectedSheet) {
      void loadEnquiries(connectedSheet, accessToken);
    } else if (!accessToken) {
      setEnquiries([]);
    }
  }, [accessToken, connectedSheet, loadEnquiries]);

  const handleCreateSheet = async () => {
    if (!accessToken) return;
    setIsCreating(true);
    setPageError(null);
    setPageSuccess(null);

    try {
      const res = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: newSheetTitle.trim() || 'Bimal Global Enquiries',
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        code?: string;
        error?: string;
        spreadsheetId?: string;
        spreadsheetTitle?: string;
        spreadsheetUrl?: string;
        sheetName?: string;
        sheets?: SheetTabInfo[];
      };

      if (!res.ok || !data.ok || !data.spreadsheetId || !data.sheetName) {
        handleApiAuthError(
          data.code,
          data.error || 'Could not create a new Google Sheet.',
        );
        return;
      }

      const nextConfig: ConnectedSheetConfig = {
        spreadsheetId: data.spreadsheetId,
        spreadsheetTitle: data.spreadsheetTitle || 'Bimal Global Enquiries',
        spreadsheetUrl:
          data.spreadsheetUrl ||
          `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
        sheetName: data.sheetName,
        sheets: data.sheets ?? [{ sheetId: 0, title: data.sheetName }],
      };

      setConnectedSheetConfig(nextConfig);
      setFetchedMeta(null);
      setSheetUrlInput('');
      setPageSuccess(
        `Created and connected "${nextConfig.spreadsheetTitle}" (${nextConfig.sheetName} tab).`,
      );
    } catch {
      setPageError('Network error while creating Google Sheet.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFetchMetadata = async () => {
    if (!accessToken || !sheetUrlInput.trim()) return;
    setIsFetchingMeta(true);
    setPageError(null);
    setPageSuccess(null);
    setFetchedMeta(null);

    try {
      const params = new URLSearchParams({
        spreadsheetId: sheetUrlInput.trim(),
      });
      const res = await fetch(`/api/sheets/metadata?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = (await res.json()) as {
        ok: boolean;
        code?: string;
        error?: string;
        spreadsheetId?: string;
        spreadsheetTitle?: string;
        spreadsheetUrl?: string;
        sheets?: SheetTabInfo[];
      };

      if (!res.ok || !data.ok || !data.spreadsheetId || !data.sheets?.length) {
        handleApiAuthError(
          data.code,
          data.error || 'Could not load tabs from that Google Sheet.',
        );
        return;
      }

      setFetchedMeta({
        spreadsheetId: data.spreadsheetId,
        spreadsheetTitle: data.spreadsheetTitle || 'Google Sheet',
        spreadsheetUrl:
          data.spreadsheetUrl ||
          `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
        sheets: data.sheets,
      });

      const preferred =
        data.sheets.find((s) => s.title.toLowerCase() === 'enquiries') ||
        data.sheets[0];
      setSelectedExistingTab(preferred.title);
    } catch {
      setPageError('Network error while inspecting the Google Sheet.');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const connectExistingTab = async (insertHeaders: boolean) => {
    if (!accessToken || !fetchedMeta || !selectedExistingTab) return;
    const matchedTab = fetchedMeta.sheets.find(
      (s) => s.title === selectedExistingTab,
    );
    if (!matchedTab) return;

    setIsConnectingTab(true);
    setPageError(null);
    setPageSuccess(null);

    try {
      const res = await fetch('/api/sheets/prepare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          spreadsheetId: fetchedMeta.spreadsheetId,
          sheetName: matchedTab.title,
          sheetId: matchedTab.sheetId,
          insertHeaders,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        code?: string;
        error?: string;
        needsConfirmation?: boolean;
        existingHeaders?: string[];
      };

      if (data.needsConfirmation) {
        setPendingAction({
          type: 'prepareHeaders',
          spreadsheetId: fetchedMeta.spreadsheetId,
          spreadsheetTitle: fetchedMeta.spreadsheetTitle,
          spreadsheetUrl: fetchedMeta.spreadsheetUrl,
          sheetName: matchedTab.title,
          sheetId: matchedTab.sheetId,
          sheets: fetchedMeta.sheets,
          existingHeaders: data.existingHeaders ?? [],
        });
        return;
      }

      if (!res.ok || !data.ok) {
        handleApiAuthError(
          data.code,
          data.error || 'Could not prepare the selected tab for enquiries.',
        );
        return;
      }

      const nextConfig: ConnectedSheetConfig = {
        spreadsheetId: fetchedMeta.spreadsheetId,
        spreadsheetTitle: fetchedMeta.spreadsheetTitle,
        spreadsheetUrl: fetchedMeta.spreadsheetUrl,
        sheetName: matchedTab.title,
        sheets: fetchedMeta.sheets,
      };
      setConnectedSheetConfig(nextConfig);
      setFetchedMeta(null);
      setSheetUrlInput('');
      setPageSuccess(
        `Connected "${nextConfig.spreadsheetTitle}" (${nextConfig.sheetName} tab).`,
      );
    } catch {
      setPageError('Network error while connecting the Google Sheet tab.');
    } finally {
      setIsConnectingTab(false);
    }
  };

  const handleConfirmDialog = async () => {
    if (!pendingAction || !accessToken) return;

    if (pendingAction.type === 'prepareHeaders') {
      setIsMutatingRow(true);
      try {
        const res = await fetch('/api/sheets/prepare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            spreadsheetId: pendingAction.spreadsheetId,
            sheetName: pendingAction.sheetName,
            sheetId: pendingAction.sheetId,
            insertHeaders: true,
          }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          code?: string;
          error?: string;
        };

        if (!res.ok || !data.ok) {
          handleApiAuthError(
            data.code,
            data.error || 'Could not insert enquiry headers.',
          );
          setPendingAction(null);
          return;
        }

        setConnectedSheetConfig({
          spreadsheetId: pendingAction.spreadsheetId,
          spreadsheetTitle: pendingAction.spreadsheetTitle,
          spreadsheetUrl: pendingAction.spreadsheetUrl,
          sheetName: pendingAction.sheetName,
          sheets: pendingAction.sheets,
        });
        setFetchedMeta(null);
        setSheetUrlInput('');
        setPageSuccess(
          `Inserted enquiry headers and connected "${pendingAction.spreadsheetTitle}" (${pendingAction.sheetName}).`,
        );
        setPendingAction(null);
      } finally {
        setIsMutatingRow(false);
      }
      return;
    }

    if (pendingAction.type === 'updateStatus' && connectedSheet) {
      setIsMutatingRow(true);
      setPageError(null);
      try {
        const res = await fetch('/api/sheets/enquiries/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            spreadsheetId: connectedSheet.spreadsheetId,
            sheetName: connectedSheet.sheetName,
            rowNumber: pendingAction.row.rowNumber,
            status: pendingAction.nextStatus,
          }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          code?: string;
          error?: string;
        };

        if (!res.ok || !data.ok) {
          handleApiAuthError(
            data.code,
            data.error || 'Could not update enquiry status.',
          );
          setPendingAction(null);
          return;
        }

        setEnquiries((prev) =>
          prev.map((item) =>
            item.rowNumber === pendingAction.row.rowNumber
              ? { ...item, status: pendingAction.nextStatus }
              : item,
          ),
        );
        setPageSuccess(
          `Updated row ${pendingAction.row.rowNumber} (${pendingAction.row.name}) to "${pendingAction.nextStatus}".`,
        );
        setPendingAction(null);
      } finally {
        setIsMutatingRow(false);
      }
      return;
    }

    if (pendingAction.type === 'deleteRow' && connectedSheet) {
      setIsMutatingRow(true);
      setPageError(null);
      try {
        const activeTab = connectedSheet.sheets.find(
          (s) => s.title === connectedSheet.sheetName,
        );
        const sheetId = activeTab?.sheetId ?? 0;
        const res = await fetch('/api/sheets/enquiries/row', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            spreadsheetId: connectedSheet.spreadsheetId,
            sheetId,
            rowNumber: pendingAction.row.rowNumber,
          }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          code?: string;
          error?: string;
        };

        if (!res.ok || !data.ok) {
          handleApiAuthError(
            data.code,
            data.error || 'Could not delete the enquiry row.',
          );
          setPendingAction(null);
          return;
        }

        setPageSuccess(
          `Deleted row ${pendingAction.row.rowNumber} (${pendingAction.row.name}) from Google Sheets.`,
        );
        setPendingAction(null);
        await loadEnquiries(connectedSheet, accessToken);
      } finally {
        setIsMutatingRow(false);
      }
    }
  };

  const filteredEnquiries = useMemo(() => {
    if (statusFilter === 'All') return enquiries;
    return enquiries.filter((item) => item.status === statusFilter);
  }, [enquiries, statusFilter]);

  const dialogProps = useMemo(() => {
    if (!pendingAction) {
      return {
        open: false,
        title: '',
        description: '',
        details: [] as string[],
        confirmLabel: 'Confirm',
        destructive: false,
      };
    }

    if (pendingAction.type === 'prepareHeaders') {
      return {
        open: true,
        title: 'Insert enquiry column headers?',
        description: `Row 1 of "${pendingAction.sheetName}" in "${pendingAction.spreadsheetTitle}" already contains data. Confirm to insert a new header row above row 1 so enquiry fields align cleanly.`,
        details: [
          `Spreadsheet: ${pendingAction.spreadsheetTitle}`,
          `Tab: ${pendingAction.sheetName}`,
          `Existing row 1: ${pendingAction.existingHeaders.filter(Boolean).join(', ') || '(non-empty)'}`,
        ],
        confirmLabel: 'Insert Header Row',
        destructive: false,
      };
    }

    if (pendingAction.type === 'updateStatus') {
      return {
        open: true,
        title: 'Update enquiry status in Google Sheets?',
        description: `This will update the Status column (row ${pendingAction.row.rowNumber}) in your connected Google Sheet.`,
        details: [
          `Spreadsheet: ${connectedSheet?.spreadsheetTitle ?? ''}`,
          `Tab: ${connectedSheet?.sheetName ?? ''}`,
          `Client: ${pendingAction.row.name} (${pendingAction.row.email})`,
          `Change: ${pendingAction.row.status || 'New'} → ${pendingAction.nextStatus}`,
        ],
        confirmLabel: `Set Status to ${pendingAction.nextStatus}`,
        destructive: false,
      };
    }

    return {
      open: true,
      title: 'Delete enquiry row from Google Sheets?',
      description: `This will permanently remove row ${pendingAction.row.rowNumber} from "${connectedSheet?.sheetName ?? ''}" in "${connectedSheet?.spreadsheetTitle ?? ''}". This action cannot be undone.`,
      details: [
        `Client: ${pendingAction.row.name || 'Unnamed'} (${pendingAction.row.email || 'No email'})`,
        `Service: ${pendingAction.row.service || '—'}`,
        `Reference: ${pendingAction.row.referenceId || `Row ${pendingAction.row.rowNumber}`}`,
      ],
      confirmLabel: 'Delete Row',
      destructive: true,
    };
  }, [pendingAction, connectedSheet]);

  return (
    <>
      <SEOHead
        title={seoConfig.pages.enquiries.title}
        description={seoConfig.pages.enquiries.description}
        path={seoConfig.pages.enquiries.path}
        noIndex
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 space-y-10">
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact', href: '/contact' },
              { label: 'Enquiry Sheet' },
            ]}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              headingAs="h1"
              eyebrow="Google Sheets Integration"
              title="Connect Google Sheets for Enquiries"
              description="Link a spreadsheet to automatically record incoming project enquiries from the Contact form, and review or update submissions directly."
            />

            <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
              <Link to="/contact">
                <span>Open Contact Form</span>
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {(authError || pageError) && (
          <ErrorState
            title="Google Sheets notice"
            description={authError || pageError || ''}
          />
        )}

        {pageSuccess && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-[var(--accent)]/50 bg-[var(--surface)] px-5 py-4"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
              aria-hidden="true"
            />
            <p className="text-sm text-[var(--text)]">{pageSuccess}</p>
          </div>
        )}

        {/* Step 1: Google Sign-In */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-mono text-xs text-[var(--accent)]">Step 01</p>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                Google Account Permission
              </h2>
              <p className="text-sm text-[var(--muted)]">
                {needsAuth
                  ? 'Sign in with Google to authorize reading and writing enquiries to your Google Sheet.'
                  : `Signed in as ${user?.email || user?.displayName || 'Google User'}.`}
              </p>
            </div>

            {needsAuth ? (
              <GoogleSignInButton
                onClick={() => void handleSignIn()}
                disabled={isLoggingIn}
                label={isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
              />
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void handleLogout()}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Sign out</span>
              </Button>
            )}
          </div>

          {needsAuth && connectedSheet && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 px-4 py-3 text-xs text-[var(--muted)]">
              Saved sheet target:{' '}
              <span className="font-medium text-[var(--text)]">
                {connectedSheet.spreadsheetTitle}
              </span>{' '}
              ({connectedSheet.sheetName}). Sign in with Google above to resume
              syncing enquiries to this spreadsheet.
            </div>
          )}
        </section>

        {/* Step 2: Connect or Create Sheet */}
        {!needsAuth && accessToken && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-mono text-xs text-[var(--accent)]">Step 02</p>
                <h2 className="text-xl font-semibold text-[var(--text)]">
                  Target Google Sheet
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Create a ready-to-use spreadsheet or link any existing Google Sheet from your account.
                </p>
              </div>

              {connectedSheet && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={connectedSheet.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Open in Google Sheets</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={disconnectSheet}
                  >
                    <Unlink className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Disconnect</span>
                  </Button>
                </div>
              )}
            </div>

            {connectedSheet ? (
              <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--bg)]/60 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {connectedSheet.spreadsheetTitle}
                    </p>
                    <p className="font-mono text-xs text-[var(--muted)]">
                      Tab: {connectedSheet.sheetName} · ID: {connectedSheet.spreadsheetId}
                    </p>
                  </div>
                </div>

                {connectedSheet.sheets.length > 1 && (
                  <div className="w-full sm:w-56">
                    <Select
                      value={connectedSheet.sheetName}
                      onValueChange={(nextTab) => updateSelectedTab(nextTab)}
                    >
                      <SelectTrigger aria-label="Active sheet tab">
                        <SelectValue placeholder="Select tab" />
                      </SelectTrigger>
                      <SelectContent>
                        {connectedSheet.sheets.map((tab) => (
                          <SelectItem key={tab.sheetId} value={tab.title}>
                            {tab.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Create new spreadsheet */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                    <FolderPlus className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    <span>Create a new Enquiries Sheet</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    Automatically creates a Google Sheet with an &ldquo;Enquiries&rdquo; tab and formatted column headers.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="new-sheet-title">Spreadsheet Name</Label>
                    <Input
                      id="new-sheet-title"
                      value={newSheetTitle}
                      onChange={(e) => setNewSheetTitle(e.target.value)}
                      placeholder="Bimal Global Enquiries"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => void handleCreateSheet()}
                    disabled={isCreating}
                    className="w-full sm:w-auto"
                  >
                    <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {isCreating
                        ? 'Creating Google Sheet...'
                        : 'Create & Connect Sheet'}
                    </span>
                  </Button>
                </div>

                {/* Connect existing spreadsheet */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                    <Link2 className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    <span>Connect an existing Google Sheet</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    Paste any Google Sheet link or spreadsheet ID to inspect its tabs and connect one.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="existing-sheet-url">
                      Google Sheet URL or ID
                    </Label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        id="existing-sheet-url"
                        value={sheetUrlInput}
                        onChange={(e) => setSheetUrlInput(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void handleFetchMetadata()}
                        disabled={isFetchingMeta || !sheetUrlInput.trim()}
                      >
                        {isFetchingMeta ? 'Loading...' : 'Fetch Tabs'}
                      </Button>
                    </div>
                  </div>

                  {fetchedMeta && (
                    <div className="space-y-3 border-t border-[var(--border)] pt-4">
                      <p className="text-xs font-medium text-[var(--text)]">
                        Found: {fetchedMeta.spreadsheetTitle}
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Select
                          value={selectedExistingTab}
                          onValueChange={setSelectedExistingTab}
                        >
                          <SelectTrigger aria-label="Select spreadsheet tab">
                            <SelectValue placeholder="Choose tab" />
                          </SelectTrigger>
                          <SelectContent>
                            {fetchedMeta.sheets.map((tab) => (
                              <SelectItem key={tab.sheetId} value={tab.title}>
                                {tab.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={() => void connectExistingTab(false)}
                          disabled={isConnectingTab || !selectedExistingTab}
                        >
                          {isConnectingTab ? 'Connecting...' : 'Connect Tab'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Step 3: Live Enquiries Table */}
        {!needsAuth && accessToken && connectedSheet && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-mono text-xs text-[var(--accent)]">Step 03</p>
                <h2 className="text-xl font-semibold text-[var(--text)]">
                  Recorded Enquiries ({filteredEnquiries.length})
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Live rows from &ldquo;{connectedSheet.sheetName}&rdquo;. New Contact form submissions append directly here.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(val) =>
                    setStatusFilter(val as 'All' | EnquiryStatusOption)
                  }
                >
                  <SelectTrigger className="w-36" aria-label="Filter by status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void loadEnquiries(connectedSheet, accessToken)}
                  disabled={isLoadingRows}
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isLoadingRows ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <EmptyState
                title="No enquiries recorded yet"
                description="Submit a project enquiry from the Contact page to see it appear immediately in this Google Sheet."
                action={
                  <Button asChild size="sm">
                    <Link to="/contact">Submit a Project Enquiry</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((row) => (
                  <article
                    key={`${row.rowNumber}-${row.referenceId || row.email}`}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/60 p-5 space-y-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-base font-semibold text-[var(--text)]">
                            {row.name || 'Unnamed Enquiry'}
                          </h3>
                          {row.referenceId && (
                            <span className="font-mono text-xs text-[var(--accent)]">
                              {row.referenceId}
                            </span>
                          )}
                          <span className="font-mono text-xs text-[var(--muted)]">
                            Row {row.rowNumber}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted)]">
                          {row.email}
                          {row.phone ? ` · ${row.phone}` : ''} ·{' '}
                          {formatDateLabel(row.timestamp)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={
                            STATUS_OPTIONS.includes(
                              row.status as EnquiryStatusOption,
                            )
                              ? (row.status as EnquiryStatusOption)
                              : 'New'
                          }
                          onValueChange={(nextStatus) => {
                            if (nextStatus === row.status) return;
                            setPendingAction({
                              type: 'updateStatus',
                              row,
                              nextStatus: nextStatus as EnquiryStatusOption,
                            });
                          }}
                        >
                          <SelectTrigger
                            className="h-9 w-36 text-xs"
                            aria-label={`Status for ${row.name}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[var(--muted)] hover:text-red-400"
                          aria-label={`Delete enquiry from ${row.name}`}
                          onClick={() =>
                            setPendingAction({
                              type: 'deleteRow',
                              row,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[var(--muted)]">
                      <span>
                        <strong className="font-medium text-[var(--text)]">
                          Service:
                        </strong>{' '}
                        {row.service || '—'}
                      </span>
                      <span>
                        <strong className="font-medium text-[var(--text)]">
                          Budget:
                        </strong>{' '}
                        {row.budget || 'Not specified'}
                      </span>
                      {row.source && (
                        <span>
                          <strong className="font-medium text-[var(--text)]">
                            Source:
                          </strong>{' '}
                          {row.source}
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-relaxed text-[var(--text)]/90 whitespace-pre-line">
                      {row.message}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <ConfirmSheetActionDialog
        open={dialogProps.open}
        title={dialogProps.title}
        description={dialogProps.description}
        details={dialogProps.details}
        confirmLabel={dialogProps.confirmLabel}
        destructive={dialogProps.destructive}
        isLoading={isMutatingRow}
        onConfirm={() => void handleConfirmDialog()}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}

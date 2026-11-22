import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type NextFunction, type Request, type Response } from 'express';
import { submitEnquiry } from './src/server/enquiry.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const ENQUIRY_HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Phone',
  'Service',
  'Budget',
  'Message',
  'Consent',
  'Source',
  'Status',
  'Reference ID',
];

const ALLOWED_STATUSES = new Set(['New', 'In Review', 'Replied', 'Archived']);

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  return token.length > 10 ? token : null;
}

function parseSpreadsheetId(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const candidate = urlMatch ? urlMatch[1] : trimmed;
  return /^[a-zA-Z0-9-_]{10,120}$/.test(candidate) ? candidate : null;
}

function quoteSheetName(sheetName: string): string {
  const safe = sheetName.trim().slice(0, 100);
  return `'${safe.replace(/'/g, "''")}'`;
}

async function googleSheetsFetch(
  url: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<globalThis.Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(12000),
  });
}

async function fetchSpreadsheetMetadata(spreadsheetId: string, accessToken: string) {
  const fields = encodeURIComponent(
    'spreadsheetId,spreadsheetUrl,properties.title,sheets.properties(sheetId,title)',
  );
  const res = await googleSheetsFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=${fields}`,
    accessToken,
  );
  const data = (await res.json().catch(() => null)) as {
    spreadsheetId?: string;
    spreadsheetUrl?: string;
    properties?: { title?: string };
    sheets?: Array<{ properties?: { sheetId?: number; title?: string } }>;
    error?: { code?: number; message?: string; status?: string };
  } | null;

  return { status: res.status, ok: res.ok, data };
}

async function ensureEnquiryHeaderRow(
  spreadsheetId: string,
  sheetName: string,
  sheetId: number | undefined,
  accessToken: string,
  insertAtTopIfNonEmpty = false,
): Promise<{
  ok: boolean;
  status: number;
  needsConfirmation?: boolean;
  existingHeaders?: string[];
  error?: string;
}> {
  const quoted = quoteSheetName(sheetName);
  const checkRange = encodeURIComponent(`${quoted}!A1:K1`);
  const readRes = await googleSheetsFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${checkRange}`,
    accessToken,
  );
  const readJson = (await readRes.json().catch(() => null)) as {
    values?: string[][];
    error?: { message?: string };
  } | null;

  if (!readRes.ok) {
    return {
      ok: false,
      status: readRes.status,
      error: readJson?.error?.message || 'Unable to inspect target Google Sheet tab.',
    };
  }

  const firstRow = readJson?.values?.[0] ?? [];
  const hasContent = firstRow.some((cell) => String(cell ?? '').trim().length > 0);
  const matchesHeaders =
    firstRow.length >= 10 &&
    ENQUIRY_HEADERS.slice(0, 10).every(
      (header, idx) => String(firstRow[idx] ?? '').trim() === header,
    );

  if (matchesHeaders) {
    return { ok: true, status: 200 };
  }

  if (hasContent && !insertAtTopIfNonEmpty) {
    return {
      ok: false,
      status: 409,
      needsConfirmation: true,
      existingHeaders: firstRow.map((v) => String(v ?? '')),
      error: 'Selected tab already contains data in row 1.',
    };
  }

  if (hasContent && insertAtTopIfNonEmpty && typeof sheetId === 'number') {
    const insertRes = await googleSheetsFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              insertDimension: {
                range: {
                  sheetId,
                  dimension: 'ROWS',
                  startIndex: 0,
                  endIndex: 1,
                },
                inheritFromBefore: false,
              },
            },
          ],
        }),
      },
    );
    if (!insertRes.ok) {
      return {
        ok: false,
        status: insertRes.status,
        error: 'Unable to insert header row at top of sheet.',
      };
    }
  }

  const writeRange = encodeURIComponent(`${quoted}!A1:K1`);
  const writeRes = await googleSheetsFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${writeRange}?valueInputOption=USER_ENTERED`,
    accessToken,
    {
      method: 'PUT',
      body: JSON.stringify({
        range: `${quoted}!A1:K1`,
        majorDimension: 'ROWS',
        values: [ENQUIRY_HEADERS],
      }),
    },
  );

  if (!writeRes.ok) {
    return {
      ok: false,
      status: writeRes.status,
      error: 'Unable to write enquiry column headers to Google Sheet.',
    };
  }

  if (typeof sheetId === 'number') {
    await googleSheetsFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId,
                  gridProperties: { frozenRowCount: 1 },
                },
                fields: 'gridProperties.frozenRowCount',
              },
            },
            {
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: ENQUIRY_HEADERS.length,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: { bold: true },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            },
          ],
        }),
      },
    ).catch(() => null);
  }

  return { ok: true, status: 200 };
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);

  // Strict JSON body limit
  app.use(express.json({ limit: '16kb' }));

  // Malformed JSON error handler
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err) {
      res.status(400).json({
        ok: false,
        error: 'Malformed JSON request body.',
        message: 'Malformed JSON request body.',
      });
      return;
    }
    next(err);
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    const appsScriptConfigured = Boolean(
      process.env.GOOGLE_APPS_SCRIPT_URL?.trim() &&
        process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim(),
    );
    res.json({ ok: true, service: 'bimal-global', appsScriptConfigured });
  });

  app.get('/api/sheets/metadata', async (req: Request, res: Response) => {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      res.status(401).json({
        ok: false,
        code: 'AUTH_REQUIRED',
        error: 'Sign in with Google to access Google Sheets.',
      });
      return;
    }

    const rawId = String(req.query.spreadsheetId ?? '');
    const spreadsheetId = parseSpreadsheetId(rawId);
    if (!spreadsheetId) {
      res.status(400).json({
        ok: false,
        error: 'Please enter a valid Google Sheet URL or spreadsheet ID.',
      });
      return;
    }

    try {
      const meta = await fetchSpreadsheetMetadata(spreadsheetId, accessToken);
      if (!meta.ok || !meta.data) {
        const statusCode = meta.status === 401 || meta.status === 403 ? 401 : meta.status;
        res.status(statusCode >= 400 ? statusCode : 502).json({
          ok: false,
          code: statusCode === 401 ? 'AUTH_EXPIRED' : 'SHEETS_ERROR',
          error:
            meta.data?.error?.message ||
            'Could not access that Google Sheet. Check the URL and your Google account permissions.',
        });
        return;
      }

      const sheets = (meta.data.sheets ?? [])
        .map((s) => ({
          sheetId: s.properties?.sheetId ?? 0,
          title: s.properties?.title ?? '',
        }))
        .filter((s) => s.title.length > 0);

      res.json({
        ok: true,
        spreadsheetId: meta.data.spreadsheetId || spreadsheetId,
        spreadsheetTitle: meta.data.properties?.title || 'Connected Google Sheet',
        spreadsheetUrl:
          meta.data.spreadsheetUrl ||
          `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
        sheets,
      });
    } catch {
      res.status(502).json({
        ok: false,
        error: 'Unable to reach Google Sheets right now. Please try again.',
      });
    }
  });

  app.post('/api/sheets/create', async (req: Request, res: Response) => {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      res.status(401).json({
        ok: false,
        code: 'AUTH_REQUIRED',
        error: 'Sign in with Google to create a Google Sheet.',
      });
      return;
    }

    const rawTitle =
      typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const title = (rawTitle || 'Bimal Global Enquiries').slice(0, 100);
    const tabTitle = 'Enquiries';

    try {
      const createRes = await googleSheetsFetch(
        'https://sheets.googleapis.com/v4/spreadsheets',
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            properties: { title },
            sheets: [
              {
                properties: {
                  title: tabTitle,
                  gridProperties: { frozenRowCount: 1 },
                },
              },
            ],
          }),
        },
      );

      const created = (await createRes.json().catch(() => null)) as {
        spreadsheetId?: string;
        spreadsheetUrl?: string;
        properties?: { title?: string };
        sheets?: Array<{ properties?: { sheetId?: number; title?: string } }>;
        error?: { message?: string };
      } | null;

      if (!createRes.ok || !created?.spreadsheetId) {
        const statusCode =
          createRes.status === 401 || createRes.status === 403 ? 401 : createRes.status;
        res.status(statusCode >= 400 ? statusCode : 502).json({
          ok: false,
          code: statusCode === 401 ? 'AUTH_EXPIRED' : 'SHEETS_ERROR',
          error:
            created?.error?.message ||
            'Could not create the Google Sheet. Please reconnect your Google account and try again.',
        });
        return;
      }

      const sheetId = created.sheets?.[0]?.properties?.sheetId ?? 0;
      await ensureEnquiryHeaderRow(
        created.spreadsheetId,
        tabTitle,
        sheetId,
        accessToken,
        false,
      );

      res.status(201).json({
        ok: true,
        spreadsheetId: created.spreadsheetId,
        spreadsheetTitle: created.properties?.title || title,
        spreadsheetUrl:
          created.spreadsheetUrl ||
          `https://docs.google.com/spreadsheets/d/${created.spreadsheetId}/edit`,
        sheetName: tabTitle,
        sheets: [{ sheetId, title: tabTitle }],
      });
    } catch {
      res.status(502).json({
        ok: false,
        error: 'Unable to reach Google Sheets while creating the spreadsheet.',
      });
    }
  });

  app.post('/api/sheets/prepare', async (req: Request, res: Response) => {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      res.status(401).json({
        ok: false,
        code: 'AUTH_REQUIRED',
        error: 'Sign in with Google to configure a Google Sheet tab.',
      });
      return;
    }

    const spreadsheetId = parseSpreadsheetId(String(req.body?.spreadsheetId ?? ''));
    const sheetName =
      typeof req.body?.sheetName === 'string' ? req.body.sheetName.trim() : '';
    const sheetId =
      typeof req.body?.sheetId === 'number' ? req.body.sheetId : undefined;
    const insertHeaders = req.body?.insertHeaders === true;

    if (!spreadsheetId || !sheetName) {
      res.status(400).json({
        ok: false,
        error: 'Spreadsheet ID and tab name are required.',
      });
      return;
    }

    try {
      const result = await ensureEnquiryHeaderRow(
        spreadsheetId,
        sheetName,
        sheetId,
        accessToken,
        insertHeaders,
      );

      if (!result.ok) {
        const statusCode =
          result.status === 401 || result.status === 403 ? 401 : result.status;
        res.status(statusCode >= 400 ? statusCode : 502).json({
          ok: false,
          code: statusCode === 401 ? 'AUTH_EXPIRED' : undefined,
          needsConfirmation: result.needsConfirmation,
          existingHeaders: result.existingHeaders,
          expectedHeaders: ENQUIRY_HEADERS,
          error: result.error,
        });
        return;
      }

      res.json({ ok: true });
    } catch {
      res.status(502).json({
        ok: false,
        error: 'Unable to verify headers in Google Sheets.',
      });
    }
  });

  app.get('/api/sheets/enquiries', async (req: Request, res: Response) => {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      res.status(401).json({
        ok: false,
        code: 'AUTH_REQUIRED',
        error: 'Sign in with Google to view enquiry records.',
      });
      return;
    }

    const spreadsheetId = parseSpreadsheetId(String(req.query.spreadsheetId ?? ''));
    const sheetName = String(req.query.sheetName ?? '').trim();

    if (!spreadsheetId || !sheetName) {
      res.status(400).json({
        ok: false,
        error: 'Spreadsheet ID and sheet tab name are required.',
      });
      return;
    }

    try {
      const range = encodeURIComponent(`${quoteSheetName(sheetName)}!A1:K500`);
      const valuesRes = await googleSheetsFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
        accessToken,
      );
      const valuesJson = (await valuesRes.json().catch(() => null)) as {
        values?: string[][];
        error?: { message?: string };
      } | null;

      if (!valuesRes.ok) {
        const statusCode =
          valuesRes.status === 401 || valuesRes.status === 403 ? 401 : valuesRes.status;
        res.status(statusCode >= 400 ? statusCode : 502).json({
          ok: false,
          code: statusCode === 401 ? 'AUTH_EXPIRED' : 'SHEETS_ERROR',
          error:
            valuesJson?.error?.message ||
            'Could not read enquiries from Google Sheets.',
        });
        return;
      }

      const rawRows = valuesJson?.values ?? [];
      if (rawRows.length === 0) {
        res.json({ ok: true, enquiries: [] });
        return;
      }

      const firstCell = String(rawRows[0]?.[0] ?? '').trim().toLowerCase();
      const secondCell = String(rawRows[0]?.[1] ?? '').trim().toLowerCase();
      const hasHeader = firstCell === 'timestamp' && secondCell === 'name';
      const startIndex = hasHeader ? 1 : 0;

      const enquiries = [];
      for (let i = startIndex; i < rawRows.length; i++) {
        const row = rawRows[i] ?? [];
        const hasAnyValue = row.some((c) => String(c ?? '').trim().length > 0);
        if (!hasAnyValue) continue;

        enquiries.push({
          rowNumber: i + 1,
          timestamp: String(row[0] ?? ''),
          name: String(row[1] ?? ''),
          email: String(row[2] ?? ''),
          phone: String(row[3] ?? ''),
          service: String(row[4] ?? ''),
          budget: String(row[5] ?? ''),
          message: String(row[6] ?? ''),
          consent: String(row[7] ?? ''),
          source: String(row[8] ?? ''),
          status: String(row[9] ?? 'New') || 'New',
          referenceId: String(row[10] ?? ''),
        });
      }

      enquiries.reverse();
      res.json({ ok: true, enquiries });
    } catch {
      res.status(502).json({
        ok: false,
        error: 'Unable to load enquiries from Google Sheets right now.',
      });
    }
  });

  app.patch('/api/sheets/enquiries/status', async (req: Request, res: Response) => {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      res.status(401).json({
        ok: false,
        code: 'AUTH_REQUIRED',
        error: 'Sign in with Google to update enquiry status.',
      });
      return;
    }

    const spreadsheetId = parseSpreadsheetId(String(req.body?.spreadsheetId ?? ''));
    const sheetName =
      typeof req.body?.sheetName === 'string' ? req.body.sheetName.trim() : '';
    const rowNumber = Number(req.body?.rowNumber);
    const status = typeof req.body?.status === 'string' ? req.body.status.trim() : '';

    if (
      !spreadsheetId ||
      !sheetName ||
      !Number.isInteger(rowNumber) ||
      rowNumber < 2 ||
      !ALLOWED_STATUSES.has(status)
    ) {
      res.status(400).json({
        ok: false,
        error: 'Invalid spreadsheet, row number, or status value.',
      });
      return;
    }

    try {
      const cellRange = `${quoteSheetName(sheetName)}!J${rowNumber}`;
      const encodedRange = encodeURIComponent(cellRange);
      const updateRes = await googleSheetsFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`,
        accessToken,
        {
          method: 'PUT',
          body: JSON.stringify({
            range: cellRange,
            majorDimension: 'ROWS',
            values: [[status]],
          }),
        },
      );

      if (!updateRes.ok) {
        const statusCode =
          updateRes.status === 401 || updateRes.status === 403 ? 401 : updateRes.status;
        res.status(statusCode >= 400 ? statusCode : 502).json({
          ok: false,
          code: statusCode === 401 ? 'AUTH_EXPIRED' : 'SHEETS_ERROR',
          error: 'Could not update enquiry status in Google Sheets.',
        });
        return;
      }

      res.json({ ok: true, rowNumber, status });
    } catch {
      res.status(502).json({
        ok: false,
        error: 'Unable to reach Google Sheets while updating status.',
      });
    }
  });

  app.delete('/api/sheets/enquiries/row', async (req: Request, res: Response) => {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      res.status(401).json({
        ok: false,
        code: 'AUTH_REQUIRED',
        error: 'Sign in with Google to delete an enquiry row.',
      });
      return;
    }

    const spreadsheetId = parseSpreadsheetId(String(req.body?.spreadsheetId ?? ''));
    const sheetId = Number(req.body?.sheetId);
    const rowNumber = Number(req.body?.rowNumber);

    if (
      !spreadsheetId ||
      !Number.isInteger(sheetId) ||
      sheetId < 0 ||
      !Number.isInteger(rowNumber) ||
      rowNumber < 2
    ) {
      res.status(400).json({
        ok: false,
        error: 'Invalid spreadsheet, tab ID, or row number.',
      });
      return;
    }

    try {
      const deleteRes = await googleSheetsFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId,
                    dimension: 'ROWS',
                    startIndex: rowNumber - 1,
                    endIndex: rowNumber,
                  },
                },
              },
            ],
          }),
        },
      );

      if (!deleteRes.ok) {
        const statusCode =
          deleteRes.status === 401 || deleteRes.status === 403 ? 401 : deleteRes.status;
        res.status(statusCode >= 400 ? statusCode : 502).json({
          ok: false,
          code: statusCode === 401 ? 'AUTH_EXPIRED' : 'SHEETS_ERROR',
          error: 'Could not delete the enquiry row in Google Sheets.',
        });
        return;
      }

      res.json({ ok: true, rowNumber });
    } catch {
      res.status(502).json({
        ok: false,
        error: 'Unable to reach Google Sheets while deleting the row.',
      });
    }
  });

  app.post('/api/enquiry', async (req: Request, res: Response) => {
    const contentType = req.headers['content-type'] ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      res.status(415).json({
        ok: false,
        error: 'Unsupported content type. Use application/json.',
        message: 'Unsupported content type.',
      });
      return;
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') ||
      req.ip ||
      'unknown';

    try {
      const result = await submitEnquiry(req.body, clientIp);
      if (result.retryAfterSeconds) {
        res.setHeader('Retry-After', String(result.retryAfterSeconds));
      }
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('[enquiry] Express handler failed', {
        error: error instanceof Error ? error.name : 'UnknownError',
      });
      res.status(500).json({
        ok: false,
        code: 'INTERNAL_ERROR',
        error: 'We could not process your enquiry. Please email us directly.',
        message: 'Internal enquiry service error.',
      });
    }
  });
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtmlPath)) {
        res.sendFile(indexHtmlPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bimal Global server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

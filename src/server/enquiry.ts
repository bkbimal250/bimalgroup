import crypto from 'node:crypto';
import { enquirySchema } from '../lib/validation/enquiry.ts';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const ipRequestLog = new Map<string, number[]>();
const recentSubmissionHashes = new Map<string, number>();

export interface EnquiryApiResponse {
  ok: boolean;
  message: string;
  referenceId?: string;
  error?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

export interface EnquiryResult {
  statusCode: number;
  body: EnquiryApiResponse;
  retryAfterSeconds?: number;
}

export interface EnquiryDependencies {
  env?: Record<string, string | undefined>;
  fetcher?: typeof fetch;
  now?: () => number;
}

function isRateLimited(ip: string, now: number): number | null {
  const timestamps = (ipRequestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequestLog.set(ip, timestamps);
    return Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - timestamps[0])) / 1000),
    );
  }

  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  return null;
}

function pruneExpiredHashes(now: number): void {
  for (const [hash, timestamp] of recentSubmissionHashes) {
    if (now - timestamp >= DUPLICATE_WINDOW_MS) {
      recentSubmissionHashes.delete(hash);
    }
  }
}

function sanitizeSheetCell(value: string): string {
  const trimmed = value.trim();
  return /^[=+\-@\t\r]/.test(trimmed) ? `'${trimmed}` : trimmed;
}

function getAppsScriptUrl(rawUrl: string): URL | null {
  try {
    const url = new URL(rawUrl);
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'script.google.com' ||
      !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ||
      url.search ||
      url.hash
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export async function submitEnquiry(
  body: unknown,
  clientIp: string,
  dependencies: EnquiryDependencies = {},
): Promise<EnquiryResult> {
  const now = dependencies.now?.() ?? Date.now();
  const retryAfterSeconds = isRateLimited(clientIp, now);
  if (retryAfterSeconds !== null) {
    return {
      statusCode: 429,
      retryAfterSeconds,
      body: {
        ok: false,
        error: 'Too many enquiry attempts. Please wait a few minutes before retrying.',
        message: 'Rate limit exceeded.',
      },
    };
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      statusCode: 400,
      body: {
        ok: false,
        error: parsed.error.issues[0]?.message || 'Please check the enquiry fields.',
        message: 'Validation failed.',
        fieldErrors,
      },
    };
  }

  const data = parsed.data;
  if (data.website?.trim()) {
    return {
      statusCode: 400,
      body: {
        ok: false,
        error: 'Enquiry submission could not be processed.',
        message: 'Submission rejected.',
      },
    };
  }

  const nowTimestamp = now;
  pruneExpiredHashes(nowTimestamp);
  const dedupeHash = crypto
    .createHash('sha256')
    .update(
      `${data.email.toLowerCase()}|${data.service.toLowerCase()}|${data.message.trim()}`,
    )
    .digest('hex');
  if (recentSubmissionHashes.has(dedupeHash)) {
    return {
      statusCode: 409,
      body: {
        ok: false,
        error: 'This enquiry was already submitted recently.',
        message: 'Duplicate submission prevented.',
      },
    };
  }

  const env = dependencies.env ?? process.env;
  const rawUrl = env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const secret = env.GOOGLE_APPS_SCRIPT_SECRET?.trim();
  if (!rawUrl || !secret) {
    return {
      statusCode: 503,
      body: {
        ok: false,
        code: 'INTEGRATION_NOT_CONFIGURED',
        error: 'The enquiry service is temporarily unavailable. Please email us directly.',
        message: 'Enquiry integration is not configured.',
      },
    };
  }
  if (secret.length < 32) {
    return {
      statusCode: 500,
      body: {
        ok: false,
        code: 'INVALID_INTEGRATION_CONFIG',
        error: 'The enquiry service is temporarily unavailable. Please email us directly.',
        message: 'Invalid enquiry integration configuration.',
      },
    };
  }

  const appsScriptUrl = getAppsScriptUrl(rawUrl);
  if (!appsScriptUrl) {
    return {
      statusCode: 500,
      body: {
        ok: false,
        code: 'INVALID_INTEGRATION_CONFIG',
        error: 'The enquiry service is temporarily unavailable. Please email us directly.',
        message: 'Invalid enquiry integration configuration.',
      },
    };
  }

  const referenceId = `BG-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const timestamp = new Date(nowTimestamp).toISOString();
  const enquiry = {
    timestamp,
    name: sanitizeSheetCell(data.name),
    email: sanitizeSheetCell(data.email),
    phone: sanitizeSheetCell(data.phone || ''),
    service: sanitizeSheetCell(data.service),
    budget: sanitizeSheetCell(data.budget || 'Not specified'),
    message: sanitizeSheetCell(data.message),
    consent: 'Confirmed',
    source: 'bimalglobal.com/contact',
    status: 'New',
    referenceId,
  };

  try {
    const response = await (dependencies.fetcher ?? fetch)(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, ...enquiry }),
      signal: AbortSignal.timeout(10000),
    });
    const responseText = await response.text();
    let result: {
      ok?: boolean;
      duplicate?: boolean;
      referenceId?: string;
    } | null = null;
    try {
      const parsedResponse: unknown = JSON.parse(responseText);
      if (
        parsedResponse &&
        typeof parsedResponse === 'object' &&
        !Array.isArray(parsedResponse)
      ) {
        result = parsedResponse as {
          ok?: boolean;
          duplicate?: boolean;
          referenceId?: string;
        };
      }
    } catch {
      result = null;
    }

    if (response.ok && result?.duplicate === true) {
      recentSubmissionHashes.set(dedupeHash, nowTimestamp);
      return {
        statusCode: 409,
        body: {
          ok: false,
          error: 'This enquiry was already submitted recently.',
          message: 'Duplicate submission prevented.',
        },
      };
    }
    if (!response.ok || result?.ok !== true) {
      console.error('[enquiry] Apps Script write was not confirmed', {
        status: response.status,
        referenceId,
      });
      return {
        statusCode: 502,
        body: {
          ok: false,
          code: 'SHEETS_WRITE_FAILED',
          error: 'We could not save your enquiry. Please retry or email us directly.',
          message: 'Google Sheets write was not confirmed.',
        },
      };
    }

    recentSubmissionHashes.set(dedupeHash, nowTimestamp);
    return {
      statusCode: 201,
      body: {
        ok: true,
        message: 'Your enquiry has been saved. Our team will respond within 1–2 business days.',
        referenceId: result.referenceId || referenceId,
      },
    };
  } catch (error) {
    console.error('[enquiry] Apps Script request failed', {
      error: error instanceof Error ? error.name : 'UnknownError',
      referenceId,
    });
    return {
      statusCode: 502,
      body: {
        ok: false,
        code: 'SHEETS_UNAVAILABLE',
        error: 'We could not save your enquiry. Please retry or email us directly.',
        message: 'Google Sheets service is unavailable.',
      },
    };
  }
}

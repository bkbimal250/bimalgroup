import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type NextFunction, type Request, type Response } from 'express';
import { enquirySchema } from './src/lib/validation/enquiry.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Sliding-window IP rate limiter: max 5 submissions per 10 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipRequestLog = new Map<string, number[]>();

// Duplicate submission window: 5 minutes
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const recentSubmissionHashes = new Map<string, number>();

const PROJECT_SLUGS = [
  'client-operations-portal-template',
  'b2b-corporate-web-platform-template',
  'field-inspection-mobile-app-template',
  'multi-theme-design-system-template',
];

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

function isRateLimited(ip: string, now: number): { limited: boolean; retryAfterSec: number } {
  const timestamps = (ipRequestLog.get(ip) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000));
    ipRequestLog.set(ip, timestamps);
    return { limited: true, retryAfterSec };
  }
  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  return { limited: false, retryAfterSec: 0 };
}

function pruneExpiredHashes(now: number) {
  for (const [hash, ts] of recentSubmissionHashes.entries()) {
    if (now - ts >= DUPLICATE_WINDOW_MS) {
      recentSubmissionHashes.delete(hash);
    }
  }
}

/**
 * Neutralizes spreadsheet formula injection prefixes (=, +, -, @, tab, CR)
 * before forwarding text values to Google Sheets.
 */
function sanitizeSheetCell(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

function getBaseUrl(req: Request): string {
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    return envUrl.replace(/\/+$/, '');
  }
  const host = req.get('host');
  if (host) {
    const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
    return `${proto}://${host}`.replace(/\/+$/, '');
  }
  return 'https://bimalglobal.com';
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
    res.json({ ok: true, service: 'bimal-global' });
  });

  app.post('/api/enquiry', async (req: Request, res: Response) => {
    const contentType = req.headers['content-type'] ?? '';
    if (!contentType.includes('application/json')) {
      res.status(415).json({
        ok: false,
        error: 'Unsupported content type. Use application/json.',
        message: 'Unsupported content type.',
      });
      return;
    }

    const now = Date.now();
    const clientIp = getClientIp(req);
    const rateCheck = isRateLimited(clientIp, now);
    if (rateCheck.limited) {
      res.setHeader('Retry-After', String(rateCheck.retryAfterSec));
      res.status(429).json({
        ok: false,
        error: 'Too many enquiry attempts. Please wait a few minutes before retrying.',
        message: 'Rate limit exceeded.',
      });
      return;
    }

    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      res.status(400).json({
        ok: false,
        error: parsed.error.issues[0]?.message || 'Please check the highlighted form fields.',
        message: 'Validation failed.',
        fieldErrors,
      });
      return;
    }

    const data = parsed.data;

    // Honeypot check: reject automated bot submissions without forwarding
    if (data.website && data.website.trim().length > 0) {
      res.status(400).json({
        ok: false,
        error: 'Enquiry submission could not be processed.',
        message: 'Submission rejected.',
      });
      return;
    }

    // Duplicate submission protection
    pruneExpiredHashes(now);
    const dedupeHash = crypto
      .createHash('sha256')
      .update(
        `${data.email.toLowerCase()}|${data.service.toLowerCase()}|${data.message.trim()}`,
      )
      .digest('hex');

    if (recentSubmissionHashes.has(dedupeHash)) {
      res.status(409).json({
        ok: false,
        error:
          'This enquiry was already submitted moments ago. Our team has received your message.',
        message: 'Duplicate submission prevented.',
      });
      return;
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
    const appsScriptSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim();

    if (!appsScriptUrl || !appsScriptSecret) {
      res.status(503).json({
        ok: false,
        error:
          'The enquiry storage endpoint is not yet connected to Google Sheets. Please configure GOOGLE_APPS_SCRIPT_URL and GOOGLE_APPS_SCRIPT_SECRET on the server, or email us directly.',
        message: 'Enquiry integration not configured.',
      });
      return;
    }

    let validatedEndpoint: URL;
    try {
      validatedEndpoint = new URL(appsScriptUrl);
    } catch {
      res.status(500).json({
        ok: false,
        error: 'Server enquiry configuration is invalid.',
        message: 'Invalid Google Apps Script URL.',
      });
      return;
    }

    if (validatedEndpoint.protocol !== 'https:') {
      res.status(500).json({
        ok: false,
        error: 'Enquiry endpoint must use HTTPS.',
        message: 'Insecure endpoint rejected.',
      });
      return;
    }

    const referenceId = `BG-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date(now).toISOString();

    const sheetPayload = {
      secret: appsScriptSecret,
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
      const upstreamResponse = await fetch(validatedEndpoint.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetPayload),
        signal: AbortSignal.timeout(10000),
      });

      const upstreamText = await upstreamResponse.text();
      let upstreamJson: { ok?: boolean; error?: string; referenceId?: string } | null = null;
      try {
        upstreamJson = JSON.parse(upstreamText) as {
          ok?: boolean;
          error?: string;
          referenceId?: string;
        };
      } catch {
        upstreamJson = null;
      }

      if (!upstreamResponse.ok || !upstreamJson || upstreamJson.ok !== true) {
        console.error('[enquiry] Upstream sheet write rejected', {
          status: upstreamResponse.status,
          referenceId,
        });
        res.status(502).json({
          ok: false,
          error:
            'We could not confirm storage of your enquiry in Google Sheets. Please try again or email us directly.',
          message: 'Upstream write not confirmed.',
        });
        return;
      }

      recentSubmissionHashes.set(dedupeHash, now);

      res.status(201).json({
        ok: true,
        message:
          'Thank you. Your enquiry has been recorded and our engineering team will respond within 1–2 business days.',
        referenceId: upstreamJson.referenceId || referenceId,
      });
    } catch {
      console.error('[enquiry] Upstream request failed', { referenceId });
      res.status(502).json({
        ok: false,
        error:
          'Unable to reach the enquiry storage service right now. Please try again shortly or email us directly.',
        message: 'Upstream connection failed.',
      });
    }
  });

  app.get('/robots.txt', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/',
        '',
        `Sitemap: ${baseUrl}/sitemap.xml`,
      ].join('\n'),
    );
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const staticPaths = ['/', '/work', '/about', '/contact', '/privacy', '/terms'];
    const allPaths = [
      ...staticPaths,
      ...PROJECT_SLUGS.map((slug) => `/work/${slug}`),
    ];

    const urlEntries = allPaths
      .map(
        (routePath) =>
          `  <url>\n    <loc>${baseUrl}${routePath}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${routePath === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
      )
      .join('\n');

    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`,
    );
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

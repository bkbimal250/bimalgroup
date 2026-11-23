import { submitEnquiry } from '../../src/server/enquiry.ts';

interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
}

interface VercelResponse {
  setHeader(name: string, value: string): unknown;
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      ok: false,
      error: 'Method not allowed.',
      message: 'Use POST for enquiry submissions.',
    });
    return;
  }

  const contentType = String(req.headers['content-type'] ?? '');
  if (!contentType.toLowerCase().includes('application/json')) {
    res.status(415).json({
      ok: false,
      error: 'Unsupported content type. Use application/json.',
      message: 'Unsupported content type.',
    });
    return;
  }

  const contentLength = Number(req.headers['content-length'] ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 16 * 1024) {
    res.status(413).json({
      ok: false,
      error: 'Enquiry request is too large.',
      message: 'Request body exceeds the allowed size.',
    });
    return;
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp =
    (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') ||
    req.socket?.remoteAddress ||
    'unknown';

  try {
    const result = await submitEnquiry(req.body, clientIp);
    if (result.retryAfterSeconds) {
      res.setHeader('Retry-After', String(result.retryAfterSeconds));
    }
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error('[enquiry] API handler failed', {
      error: error instanceof Error ? error.name : 'UnknownError',
    });
    res.status(500).json({
      ok: false,
      code: 'INTERNAL_ERROR',
      error: 'We could not process your enquiry. Please email us directly.',
      message: 'Internal enquiry service error.',
    });
  }
}

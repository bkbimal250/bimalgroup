import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../api/enquiry.ts';

interface MockResponse {
  statusCode?: number;
  headers: Record<string, string>;
  body?: unknown;
  status(code: number): MockResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

function createResponse(): MockResponse {
  return {
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
  };
}

test('Vercel endpoint rejects non-POST requests', async () => {
  const response = createResponse();
  const request = {
    method: 'GET',
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
  };

  await handler(request, response);

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, 'POST');
});

test('Vercel endpoint validates JSON submissions before forwarding', async () => {
  const response = createResponse();
  const request = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': 'test-vercel-invalid',
    },
    socket: { remoteAddress: '127.0.0.1' },
    body: { name: 'invalid' },
  };

  await handler(request, response);

  assert.equal(response.statusCode, 400);
  assert.equal((response.body as { ok?: boolean }).ok, false);
});

test('Vercel endpoint rejects non-JSON submissions', async () => {
  const response = createResponse();
  const request = {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    socket: { remoteAddress: '127.0.0.1' },
    body: {},
  };

  await handler(request, response);

  assert.equal(response.statusCode, 415);
});

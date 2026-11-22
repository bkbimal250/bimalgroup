import assert from 'node:assert/strict';
import test from 'node:test';
import { submitEnquiry } from '../src/server/enquiry.ts';

const validPayload = {
  name: 'Ada Example',
  email: 'ada@example.com',
  phone: '',
  service: 'Business Websites',
  budget: 'Not specified',
  message: 'A valid contact request with enough detail.',
  consent: true,
  website: '',
};

const configuredEnv = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/test-deployment/exec',
  GOOGLE_APPS_SCRIPT_SECRET: 'test-secret-that-is-never-returned',
};

test('rejects invalid form data without contacting Apps Script', async () => {
  let fetchCalled = false;
  const result = await submitEnquiry(
    { ...validPayload, email: 'invalid' },
    'test-invalid-payload',
    {
      env: configuredEnv,
      fetcher: async () => {
        fetchCalled = true;
        return new Response('{}');
      },
    },
  );

  assert.equal(result.statusCode, 400);
  assert.equal(fetchCalled, false);
});

test('returns a configuration error without exposing secrets when not configured', async () => {
  const result = await submitEnquiry(validPayload, 'test-missing-config', {
    env: {},
    fetcher: async () => new Response('{}'),
  });

  assert.equal(result.statusCode, 503);
  assert.equal(result.body.code, 'INTEGRATION_NOT_CONFIGURED');
  assert.equal(JSON.stringify(result.body).includes(configuredEnv.GOOGLE_APPS_SCRIPT_SECRET), false);
});

test('posts validated enquiry data server-side and confirms only a saved response', async () => {
  let requestUrl = '';
  let requestBody: Record<string, unknown> | undefined;
  const result = await submitEnquiry(
    { ...validPayload, email: 'ada-success@example.com' },
    'test-success',
    {
      env: configuredEnv,
      now: () => Date.UTC(2026, 0, 1),
      fetcher: async (input, init) => {
        requestUrl = String(input);
        requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
        return new Response(
          JSON.stringify({ ok: true, referenceId: 'BG-1234ABCD' }),
          { status: 200 },
        );
      },
    },
  );

  assert.equal(requestUrl, configuredEnv.GOOGLE_APPS_SCRIPT_URL);
  assert.equal(requestBody?.secret, configuredEnv.GOOGLE_APPS_SCRIPT_SECRET);
  assert.equal(requestBody?.consent, 'Confirmed');
  assert.equal(requestBody?.source, 'bimalglobal.com/contact');
  assert.equal(result.statusCode, 201);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.referenceId, 'BG-1234ABCD');
  assert.equal(JSON.stringify(result.body).includes(configuredEnv.GOOGLE_APPS_SCRIPT_SECRET), false);
});

test('rejects an already submitted enquiry without forwarding it twice', async () => {
  const payload = { ...validPayload, email: 'ada-duplicate@example.com' };
  let fetchCount = 0;
  const dependencies = {
    env: configuredEnv,
    fetcher: async () => {
      fetchCount += 1;
      return new Response(JSON.stringify({ ok: true, referenceId: 'BG-DUP12345' }));
    },
  };

  const first = await submitEnquiry(payload, 'test-duplicate-first', dependencies);
  const second = await submitEnquiry(payload, 'test-duplicate-second', dependencies);

  assert.equal(first.statusCode, 201);
  assert.equal(second.statusCode, 409);
  assert.equal(fetchCount, 1);
});

test('rejects unsafe Apps Script targets', async () => {
  let fetchCalled = false;
  const result = await submitEnquiry(validPayload, 'test-invalid-script-url', {
    env: {
      GOOGLE_APPS_SCRIPT_URL: 'https://example.com/collect',
      GOOGLE_APPS_SCRIPT_SECRET: 'test-secret',
    },
    fetcher: async () => {
      fetchCalled = true;
      return new Response('{}');
    },
  });

  assert.equal(result.statusCode, 500);
  assert.equal(fetchCalled, false);
});

test('does not report success when Apps Script rejects the write', async () => {
  const result = await submitEnquiry(
    { ...validPayload, email: 'ada-rejected@example.com' },
    'test-upstream-rejected',
    {
      env: configuredEnv,
      fetcher: async () =>
        new Response(JSON.stringify({ ok: false, error: 'Private upstream details' })),
    },
  );

  assert.equal(result.statusCode, 502);
  assert.equal(result.body.ok, false);
  assert.equal(JSON.stringify(result.body).includes('Private upstream details'), false);
});

test('rejects a weak server-side shared secret without making a request', async () => {
  let fetchCalled = false;
  const result = await submitEnquiry(validPayload, 'test-weak-secret', {
    env: {
      GOOGLE_APPS_SCRIPT_URL: configuredEnv.GOOGLE_APPS_SCRIPT_URL,
      GOOGLE_APPS_SCRIPT_SECRET: 'too-short',
    },
    fetcher: async () => {
      fetchCalled = true;
      return new Response('{}');
    },
  });

  assert.equal(result.statusCode, 500);
  assert.equal(fetchCalled, false);
});

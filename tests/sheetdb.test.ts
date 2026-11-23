import assert from 'node:assert/strict';
import test from 'node:test';
import { SHEETDB_ENDPOINT, submitSheetDbEnquiry } from '../src/lib/sheetdb.ts';

const valid = {
  name: ' Test Visitor ', email: 'test@example.com', phone: '+91 98765 43210',
  service: 'Business Websites', budget: 'Not sure yet',
  message: 'A test project description with sufficient detail.', consent: true,
};

test('posts one row using the exact live spreadsheet headers and confirms creation', async () => {
  let row: Record<string, string>;
  const id = await submitSheetDbEnquiry(valid, async (url, options) => {
    assert.equal(url, SHEETDB_ENDPOINT);
    assert.equal(options?.method, 'POST');
    assert.deepEqual(options?.headers, { 'Content-Type': 'application/json' });
    assert.equal(options?.credentials, 'omit');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.mode, 'RAW');
    assert.equal(body.data.length, 1);
    row = body.data[0];
    assert.deepEqual(Object.keys(row), ['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Budget', 'Message', 'Consent', 'Source', 'Status', 'Reference ID']);
    assert.equal(row.Name, 'Test Visitor');
    assert.equal(row.Email, valid.email);
    assert.equal(row.Phone, valid.phone);
    assert.equal(row.Service, valid.service);
    assert.equal(row.Budget, valid.budget);
    assert.equal(row.Message, valid.message);
    assert.equal(row.Consent, 'Yes');
    assert.equal(row.Status, 'New');
    assert.ok(Number.isFinite(Date.parse(row.Timestamp)));
    return Response.json({ created: 1 }, { status: 201 });
  });
  assert.equal(id, row!['Reference ID']);
});

test('rejects invalid input and filled honeypots before making requests', async () => {
  for (const overrides of [{ email: 'bad' }, { name: '' }, { service: '' }, { message: 'short' }, { consent: false }, { phone: 'letters' }, { companyFax: 'bot' }, { website: 'bot' }]) {
    await assert.rejects(submitSheetDbEnquiry({ ...valid, ...overrides }, async () => {
      assert.fail('Invalid data must not reach SheetDB');
    }));
  }
});

test('never reports success for HTTP errors, missing confirmation, or invalid JSON', async () => {
  for (const [body, status] of [['{"created":1}', 403], ['{"error":"quota"}', 429], ['{}', 500], ['{"created":0}', 200], ['{}', 200], ['null', 200], ['{"created":"1"}', 200], ['<html>Error</html>', 200]] as const) {
    await assert.rejects(submitSheetDbEnquiry(valid, async () => new Response(body, { status })));
  }
});

test('network failures are not automatically retried', async () => {
  let calls = 0;
  await assert.rejects(submitSheetDbEnquiry(valid, async () => {
    calls++;
    throw new TypeError('Network failure');
  }), /Unable to confirm/);
  assert.equal(calls, 1);
});

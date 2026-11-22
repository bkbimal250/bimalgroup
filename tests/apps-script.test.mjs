import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const scriptSource = readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8');

function createAppsScript(secret, scriptProperties = {}) {
  const rows = [];
  const cache = new Map();
  let openedSpreadsheetId = null;
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (values) => rows.push([...values]),
    getRange(row, column, rowCount, columnCount) {
      return {
        getValues: () =>
          rows
            .slice(row - 1, row - 1 + rowCount)
            .map((values) => values.slice(column - 1, column - 1 + columnCount)),
        setFontWeight() {},
        setValues(values) {
          rows.splice(row - 1, values.length, ...values.map((entry) => [...entry]));
        },
      };
    },
    setFrozenRows() {},
  };
  const spreadsheet = {
    getSheetByName: () => sheet,
    insertSheet: () => sheet,
  };
  const sandbox = {
    console: { error() {} },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(text) {
        return {
          text,
          setMimeType() {
            return this;
          },
        };
      },
    },
    LockService: {
      getScriptLock: () => ({
        waitLock() {},
        releaseLock() {},
      }),
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key) =>
          key === 'ENQUIRY_SHARED_SECRET' ? secret : scriptProperties[key] || null,
      }),
    },
    CacheService: {
      getScriptCache: () => ({
        get: (key) => cache.get(key) || null,
        put: (key, value) => cache.set(key, value),
      }),
    },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => spreadsheet,
      openById: (id) => {
        openedSpreadsheetId = id;
        return spreadsheet;
      },
    },
    Utilities: {
      DigestAlgorithm: { SHA_256: 'SHA_256' },
      Charset: { UTF_8: 'UTF-8' },
      computeDigest(_algorithm, value) {
        return [...createHash('sha256').update(value, 'utf8').digest()].map(
          (byte) => (byte > 127 ? byte - 256 : byte),
        );
      },
    },
  };

  runInNewContext(scriptSource, sandbox);
  return {
    rows,
    get openedSpreadsheetId() {
      return openedSpreadsheetId;
    },
    post: (payload) =>
      JSON.parse(
        sandbox
          .doPost({ postData: { contents: JSON.stringify(payload) } })
          .text,
      ),
  };
}

const validEnquiry = {
  secret: 'test-apps-script-secret-with-adequate-length',
  timestamp: '2026-01-01T00:00:00.000Z',
  name: 'Ada Example',
  email: 'ada@example.com',
  phone: '',
  service: 'Business Websites',
  budget: 'Not specified',
  message: 'A valid contact request with enough detail.',
  consent: 'Confirmed',
  referenceId: 'BG-1234ABCD',
};

test('Apps Script rejects an invalid shared secret without writing a row', () => {
  const app = createAppsScript('correct-apps-script-test-secret-long-enough');
  const result = app.post({ ...validEnquiry, secret: 'wrong-test-secret' });

  assert.equal(result.ok, false);
  assert.equal(result.error, 'Unauthorized request.');
  assert.equal(app.rows.length, 0);
});

test('Apps Script creates headers, appends the mapped enquiry, and blocks duplicates', () => {
  const app = createAppsScript(validEnquiry.secret);
  const result = app.post(validEnquiry);

  assert.equal(result.ok, true);
  assert.equal(result.rowNumber, 2);
  assert.deepEqual(app.rows[0], [
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
  ]);
  assert.deepEqual(app.rows[1], [
    validEnquiry.timestamp,
    validEnquiry.name,
    validEnquiry.email,
    '',
    validEnquiry.service,
    validEnquiry.budget,
    validEnquiry.message,
    'Confirmed',
    'bimalglobal.com/contact',
    'New',
    validEnquiry.referenceId,
  ]);

  const duplicate = app.post({
    ...validEnquiry,
    referenceId: 'BG-EEEEEEEE',
    timestamp: '2026-01-02T00:00:00.000Z',
  });
  assert.equal(duplicate.ok, true);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.referenceId, validEnquiry.referenceId);
  assert.equal(app.rows.length, 2);
});

test('Apps Script rejects invalid enquiry fields without writing a row', () => {
  const app = createAppsScript(validEnquiry.secret);
  const result = app.post({ ...validEnquiry, message: 'short' });

  assert.equal(result.ok, false);
  assert.equal(result.error, 'Invalid service or message length.');
  assert.equal(app.rows.length, 0);
});

test('Apps Script targets the configured existing spreadsheet', () => {
  const app = createAppsScript(validEnquiry.secret, {
    ENQUIRY_SPREADSHEET_ID: 'existing-sheet-id',
  });
  const result = app.post(validEnquiry);

  assert.equal(result.ok, true);
  assert.equal(app.openedSpreadsheetId, 'existing-sheet-id');
});

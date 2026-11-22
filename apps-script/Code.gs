/**
 * Bimal Global — Google Apps Script Enquiry Receiver
 *
 * Deploy as a Web App (Execute as: Me, Who has access: Anyone)
 * Set Script Property `ENQUIRY_SHARED_SECRET` to match server `GOOGLE_APPS_SCRIPT_SECRET`.
 * Optional Script Property `ENQUIRY_SHEET_NAME` defaults to "Enquiries".
 */

var EXPECTED_HEADERS = [
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

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function sanitizeCell(value) {
  if (value === null || value === undefined) return '';
  var str = String(value).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(EXPECTED_HEADERS);
    sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }

  var existing = sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).getValues()[0];
  var matches = EXPECTED_HEADERS.every(function (header, idx) {
    return String(existing[idx] || '').trim() === header;
  });
  if (!matches) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setValues([EXPECTED_HEADERS]);
    sheet.getRange(1, 1, 1, EXPECTED_HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function getDuplicateKey(email, service, message) {
  var input = [email.toLowerCase(), service.toLowerCase(), message.trim()].join('|');
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    input,
    Utilities.Charset.UTF_8
  );
  var hash = digest
    .map(function (byte) {
      return ('0' + (byte & 255).toString(16)).slice(-2);
    })
    .join('');
  return 'enquiry:' + hash;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Missing request payload.' });
    }

    var body = JSON.parse(e.postData.contents);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return jsonResponse({ ok: false, error: 'Invalid request payload.' });
    }

    var props = PropertiesService.getScriptProperties();
    var expectedSecret = props.getProperty('ENQUIRY_SHARED_SECRET');

    if (
      !expectedSecret ||
      expectedSecret.length < 32 ||
      typeof body.secret !== 'string' ||
      body.secret !== expectedSecret
    ) {
      return jsonResponse({ ok: false, error: 'Unauthorized request.' });
    }

    var requiredStringFields = [
      'name',
      'email',
      'service',
      'message',
      'consent',
      'referenceId',
      'timestamp',
    ];
    for (var i = 0; i < requiredStringFields.length; i++) {
      if (typeof body[requiredStringFields[i]] !== 'string') {
        return jsonResponse({ ok: false, error: 'Invalid request fields.' });
      }
    }
    if (
      (body.phone !== undefined && typeof body.phone !== 'string') ||
      (body.budget !== undefined && typeof body.budget !== 'string') ||
      (body.website !== undefined && typeof body.website !== 'string')
    ) {
      return jsonResponse({ ok: false, error: 'Invalid request fields.' });
    }
    if (body.website && body.website.trim()) {
      return jsonResponse({ ok: false, error: 'Invalid request fields.' });
    }

    var name = sanitizeCell(body.name);
    var email = sanitizeCell(body.email);
    var phone = sanitizeCell(body.phone || '');
    var service = sanitizeCell(body.service);
    var budget = sanitizeCell(body.budget || 'Not specified');
    var message = sanitizeCell(body.message);
    var consent = sanitizeCell(body.consent);
    var referenceId = sanitizeCell(body.referenceId || '');
    var timestamp = sanitizeCell(body.timestamp || new Date().toISOString());

    if (name.length < 2 || name.length > 120) {
      return jsonResponse({ ok: false, error: 'Invalid name length.' });
    }
    if (
      email.length > 180 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.replace(/^'/, ''))
    ) {
      return jsonResponse({ ok: false, error: 'Invalid email address.' });
    }
    if (
      service.length < 2 ||
      service.length > 120 ||
      message.length < 20 ||
      message.length > 3000
    ) {
      return jsonResponse({ ok: false, error: 'Invalid service or message length.' });
    }
    if (phone && (phone.length > 40 || !/^[+\d\s().-]{7,40}$/.test(phone))) {
      return jsonResponse({ ok: false, error: 'Invalid phone number.' });
    }
    if (budget.length > 80) {
      return jsonResponse({ ok: false, error: 'Invalid budget.' });
    }
    if (consent !== 'Confirmed') {
      return jsonResponse({ ok: false, error: 'Consent is required.' });
    }
    if (!/^BG-[A-F0-9]{8}$/.test(referenceId) || isNaN(Date.parse(timestamp))) {
      return jsonResponse({ ok: false, error: 'Invalid submission metadata.' });
    }

    lock.waitLock(8000);
    lockAcquired = true;

    var cache = CacheService.getScriptCache();
    var duplicateKey = getDuplicateKey(email, service, message);
    var previousReferenceId = cache.get(duplicateKey);
    if (previousReferenceId) {
      return jsonResponse({
        ok: true,
        duplicate: true,
        referenceId: previousReferenceId,
      });
    }

    var sheetName = props.getProperty('ENQUIRY_SHEET_NAME') || 'Enquiries';
    var spreadsheetId = props.getProperty('ENQUIRY_SPREADSHEET_ID');
    var spreadsheet = spreadsheetId
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('The Apps Script must be bound to the target spreadsheet.');
    }
    var sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

    ensureHeaders(sheet);

    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      service,
      budget,
      message,
      consent,
      'bimalglobal.com/contact',
      'New',
      referenceId,
    ]);

    try {
      cache.put(duplicateKey, referenceId, 300);
    } catch (cacheError) {
      console.error('Could not cache recent enquiry duplicate key.');
    }

    return jsonResponse({
      ok: true,
      rowNumber: sheet.getLastRow(),
      referenceId: referenceId || null,
    });
  } catch (err) {
    console.error(
      'Enquiry processing failed.',
      err && err.message ? String(err.message).slice(0, 200) : 'Unknown error.'
    );
    return jsonResponse({
      ok: false,
      error: 'Unable to save the enquiry. Please retry later.',
    });
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

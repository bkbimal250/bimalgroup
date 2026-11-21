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

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(8000);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Missing request payload.' });
    }

    var body = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var expectedSecret = props.getProperty('ENQUIRY_SHARED_SECRET');

    if (!expectedSecret || !body.secret || body.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'Unauthorized request.' });
    }

    var name = sanitizeCell(body.name);
    var email = sanitizeCell(body.email);
    var phone = sanitizeCell(body.phone || '');
    var service = sanitizeCell(body.service);
    var budget = sanitizeCell(body.budget || 'Not specified');
    var message = sanitizeCell(body.message);
    var consent = sanitizeCell(body.consent);
    var source = sanitizeCell(body.source || 'bimalglobal.com/contact');
    var status = sanitizeCell(body.status || 'New');
    var timestamp = sanitizeCell(body.timestamp || new Date().toISOString());

    if (name.length < 2 || name.length > 120) {
      return jsonResponse({ ok: false, error: 'Invalid name length.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.replace(/^'/, ''))) {
      return jsonResponse({ ok: false, error: 'Invalid email address.' });
    }
    if (!service || message.length < 20 || message.length > 3000) {
      return jsonResponse({ ok: false, error: 'Invalid service or message length.' });
    }
    if (consent !== 'Confirmed') {
      return jsonResponse({ ok: false, error: 'Consent is required.' });
    }

    var sheetName = props.getProperty('ENQUIRY_SHEET_NAME') || 'Enquiries';
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
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
      source,
      status,
    ]);

    return jsonResponse({
      ok: true,
      rowNumber: sheet.getLastRow(),
      referenceId: body.referenceId || null,
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: 'Apps Script processing failed.',
    });
  } finally {
    lock.releaseLock();
  }
}

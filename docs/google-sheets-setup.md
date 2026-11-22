# Google Sheets Enquiry Integration Guide

This document explains how to connect the `/api/enquiry` endpoint to a private Google Sheet using Google Apps Script without exposing credentials in browser code.

## 1. Spreadsheet Setup

1. Create a new Google Sheet in your studio Google Drive (e.g., `Bimal Global Enquiries`).
2. Leave the sheet empty or create a tab named `Enquiries`.
   The Apps Script automatically creates and freezes the header row if missing:
   `Timestamp | Name | Email | Phone | Service | Budget | Message | Consent | Source | Status | Reference ID`

## 2. Apps Script Installation

1. In your Google Sheet, open **Extensions -> Apps Script**.
2. Replace the default editor contents with `apps-script/Code.gs` from this repository.
3. Save the project (e.g., `Bimal Global Enquiry Receiver`).

## 3. Configure Script Properties (Secret)

1. Generate a high-entropy random secret (at least 32 characters), for example:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. In Apps Script, go to **Project Settings -> Script Properties -> Add script property**:
   - Property: `ENQUIRY_SHARED_SECRET`
   - Value: `<your-generated-secret>`
3. Optional: add `ENQUIRY_SHEET_NAME` (defaults to `Enquiries`).

## 4. Deploy as a Web App

1. Click **Deploy -> New deployment**.
2. Select type **Web app**.
3. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Authorize the script permissions when prompted (Google Sheets read/write access for the active spreadsheet).
5. Copy the resulting `https://script.google.com/macros/s/.../exec` Web App URL.

## 5. Server Environment Variables

Add the following server-only variables in your hosting environment (or `.env` locally — never commit `.env`):

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_SECRET=your_matching_secret
```

Never prefix these variables with `VITE_` or `NEXT_PUBLIC_`.

## 6. Testing the Integration

1. Test the API directly using `curl`:
   ```bash
   curl -X POST http://localhost:3000/api/enquiry \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Client",
       "email": "test@example.com",
       "phone": "",
       "service": "Full-Stack Web Applications",
       "budget": "₹20,000 – ₹35,000",
       "message": "Testing end-to-end validation and Google Sheets write confirmation.",
       "consent": true,
       "website": ""
     }'
   ```
2. Verify HTTP `201` with `{ "ok": true, "referenceId": "BG-..." }` and confirm a new row appeared in the Google Sheet.
3. Verify honeypot rejection by sending `"website": "https://spam.example"` (expects HTTP `400`).
4. Verify duplicate guard by sending the exact same payload twice within 5 minutes (expects HTTP `409`).

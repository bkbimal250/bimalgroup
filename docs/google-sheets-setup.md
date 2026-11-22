# Google Sheets Enquiry Integration

The public contact form posts to the same-origin `/api/enquiry` endpoint. The server validates and forwards enquiries to a Google Apps Script Web App; visitors do not sign in with Google. The optional `/enquiries` admin console still uses Google OAuth independently.

## 1. Bind Apps Script to the Existing Spreadsheet

Use the existing target Google Sheet so its data is preserved. Open that spreadsheet and choose **Extensions -> Apps Script**. Replace the script contents with `apps-script/Code.gs` and save.

The script uses the bound spreadsheet and the `Enquiries` worksheet by default. For deterministic web-app access, add `ENQUIRY_SPREADSHEET_ID` as a Script Property containing the ID from the URL of the **existing** target spreadsheet. Set the optional `ENQUIRY_SHEET_NAME` property only if its worksheet has another name. If the headers are missing or differ, the script inserts the expected header row above existing data rather than replacing that data:

`Timestamp | Name | Email | Phone | Service | Budget | Message | Consent | Source | Status | Reference ID`

## 2. Configure and Deploy the Web App

1. Generate a high-entropy secret (at least 32 random bytes), for example:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. In Apps Script **Project Settings -> Script Properties**, add `ENQUIRY_SHARED_SECRET` with that secret. Never put it in `Code.gs`.
3. Deploy the script as a **Web app**, with **Execute as: Me** and **Who has access: Anyone**. The script runs as the spreadsheet owner and only accepts POSTs carrying the shared secret.
4. Authorize the requested Google Sheets permission, then copy the deployment URL ending in `/exec`.

The Apps Script URL is not the secret. Keep the shared secret only in Script Properties and the server environment.

## 3. Configure Vercel

Vercel automatically detects `api/enquiry.ts`; no cross-origin or CORS configuration is needed because the form calls `/api/enquiry` on its own domain.

In the Vercel project, open **Settings -> Environment Variables** and add these unprefixed variables for **Production**:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_SECRET=the_same_secret_as_ENQUIRY_SHARED_SECRET
```

Use the exact same secret in Vercel and Apps Script. Do not use `VITE_` or `NEXT_PUBLIC_` prefixes. `APP_URL` may remain configured for other site functionality; it is not required by the enquiry endpoint. Redeploy after changing Vercel environment variables. For local testing, add the same two values to the existing `.env` without replacing other values or committing the file.

## 4. Local and Automated Tests

Run the code-level checks:

```bash
npm test
npm run lint
npm run build
```

For a local end-to-end test, run `npm run dev`, submit a clearly labelled test enquiry on `http://localhost:3000/contact`, and verify its row in the existing sheet. Use test data you are comfortable storing. A successful response is HTTP `201`; the form only shows success after Apps Script confirms the write.

To check invalid submissions without writing to the sheet, POST malformed data to `/api/enquiry` and expect HTTP `400`. A filled `website` honeypot is also rejected with HTTP `400`. Repeating a successful submission with the same email, service, and message within five minutes returns HTTP `409` and does not append another row. Automated Apps Script tests also cover invalid shared secrets and duplicate detection without contacting Google.

## 5. Production Verification

After deployment, verify `https://bimalglobal.com/api/enquiry` responds to a non-POST request with HTTP `405`, then submit one labelled test enquiry through the production contact form and confirm the row appears in the sheet. This production test writes real data; remove the test row afterward if desired.

If the form reports a save error, check the Vercel Function logs for the request status/reference ID and confirm that the Vercel secret exactly matches the Apps Script Script Property. The API does not return the secret or internal error details to the visitor.

## 6. Google OAuth Warning

Public contact submissions do not use Firebase or Google OAuth. The `/enquiries` admin console still uses the Google Sheets OAuth scope. In Firebase Authentication, authorize the exact production domains (`bimalglobal.com` and `www.bimalglobal.com`). In Google Auth Platform, keep the consent screen in **Testing** and add only the administrator account as a test user until the app is verified. Google may continue to show its unverified-app warning to that administrator; do not bypass the warning. Public visitors should use only the Contact page and never need to authorize Google.

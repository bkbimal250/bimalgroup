# SheetDB contact form (static frontend)

The contact page and enquiry popup use `src/lib/sheetdb.ts` to POST directly from React to:

`https://sheetdb.io/api/v1/azmq62vz2k6uf`

No custom backend, Firebase login, Google Apps Script, API key, or environment variable is required for public submissions. The endpoint is intentionally visible in browser code. Vite environment variables are not secret storage.

## Existing spreadsheet mapping

The endpoint's `/keys` response was inspected on 2026-11-23. These are its exact headers; the sheet and its headers were not changed:

| Sheet header | Value |
| --- | --- |
| Timestamp | Current ISO date/time (there is no `Date` column) |
| Name | Validated name |
| Email | Validated email |
| Phone | Optional phone or empty string |
| Service | Selected service |
| Budget | Optional budget or empty string |
| Message | Project overview |
| Consent | Yes after required consent validation |
| Source | Website |
| Status | New |
| Reference ID | Browser-generated UUID |

The JSON body is `{ data: [row], mode: 'RAW' }`. RAW preserves input as text, including phone prefixes and text beginning with `=`. See [SheetDB create](https://docs.sheetdb.io/sheetdb-api/create) and [value input options](https://docs.sheetdb.io/value-render-input-option).

Success requires both an HTTP success status and a JSON response containing numeric `created: 1`. Only then is the form reset. Errors retain entered values. A submission guard and disabled submit button prevent simultaneous requests from this form. Requests time out after 20 seconds; uncertain outcomes are not retried automatically because a write may have succeeded before its response was lost. Client validation and honeypots do not prevent direct API abuse or provide server-side deduplication.

## Production security blocker

On 2026-11-23, an unauthenticated GET with `?limit=1` returned HTTP 200 and `Access-Control-Allow-Origin: *`. After the test submission, unauthenticated `/search` returned the test row. Public read/search access is therefore confirmed. Do not deploy this integration as production-ready with these permissions.

In the SheetDB dashboard, enable only **Create (POST)** and disable Read, Search, Update, Delete, and other unused operations. [SheetDB's permissions documentation](https://docs.sheetdb.io/permissions) recommends create-only access for forms and specifies HTTP 403 for disabled operations. Configure appropriate browser origins, but do not treat CORS as authentication or protection against direct HTTP clients. Public create access still permits spam and quota consumption.

Update/delete permissions were not tested with mutation requests, to preserve existing data. No dashboard permission change was made. Verify those settings and recheck denied read/search access before production approval. No private credentials should be added to the frontend.

## Local development and hosting

```bash
npm run dev
npm test
npm run lint
npm run build
```

Open `http://localhost:3000/contact`. The dev command runs Vite directly; `npm start` previews a built static site. Vercel uses Vite, `npm run build`, and `dist`. SPA rewrites preserve direct React Router navigation; `/api/*` is excluded to avoid returning misleading HTML responses.

The old enquiry function was moved from `api/enquiry.ts` to `legacy/api/enquiry.ts` so Vercel will not auto-deploy it. Existing server, Apps Script, and admin code/tests are retained for unrelated legacy functionality and pre-existing work, but are not used by the contact form or static startup. The separate `/enquiries` admin console retains its existing OAuth UI; it relies on legacy server routes and is not made functional by this frontend-only integration. Public contact and popup forms contain no Google sign-in UI or Firebase dependency.

## Verification performed

- All 20 automated tests passed, including exact SheetDB mapping, validation, honeypots, HTTP errors, missing/malformed confirmation, and network errors.
- `npm run lint` and `npm run build` passed. Existing Vite configuration and chunk-size warnings remain.
- Local headless Edge browser verified validation, disabled loading button, preserved values after HTTP/network/JSON errors, success display, and reset after confirmed success.
- One live browser submission returned HTTP 201 and `{ "created": 1 }`. A subsequent search verified the saved row, including the phone prefix and consent.
- Test row: **Bimal Global Integration Test**, email `sheetdb-test@example.com`, reference **7f962ef2-eb38-46ba-9734-16d8c5ffd985**. It is clearly marked TEST ONLY and remains in the sheet. Existing data was not modified or deleted.
- Nothing was pushed or deployed.

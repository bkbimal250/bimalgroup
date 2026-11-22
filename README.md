# Bimal Global — Agency Website

Minimalist software development agency website for **Bimal Global** (`https://bimalglobal.com`), featuring centralized data and theme tokens, filterable portfolio case studies, team profiles with downloadable resumes, SEO metadata/JSON-LD, and a server-validated enquiry pipeline connected to Google Sheets.

## Architecture Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Radix UI primitives, React Router, Motion (`reducedMotion="user"`), React Hook Form + Zod, and Firebase Auth for the optional admin-only Google Sheets console.
- **Backend**: The public contact form posts to `/api/enquiry`, implemented as a Vercel Function in `api/enquiry.ts` and backed by shared validation/forwarding logic in `src/server/enquiry.ts`. The Express server (`server.ts`) uses that same handler for local development. `/api/sheets/*` remains available for the optional admin console.
- **Search indexing**: The sitemap lists the canonical public pages and current case studies at `https://bimalglobal.com`; it intentionally excludes the no-index `/enquiries` page and API routes. Update the sitemap when public routes or case-study slugs change.
- **Centralized Content**: All agency copy, navigation, services, projects, team, partners, testimonials, FAQs, SEO configs, and 5 color themes live in `src/data/*` with strict interfaces in `src/types/*`.
- **Enquiry Storage**: Public enquiries are validated, rate-limited, deduplicated, and forwarded server-to-server over HTTPS to the bound Google Apps Script Web App (`apps-script/Code.gs`) using server-only environment variables. Website visitors never authorize Google; Firebase OAuth is separate and only used by the optional `/enquiries` admin console.

## Centralized Color Themes

Defined in `src/data/themes.ts` and `src/index.css`:
1. **Midnight Tech** (default): `#0B1220` / `#162238` / `#3B82F6`
2. **Clean Corporate**: `#FFFFFF` / `#F1F5F9` / `#2563EB`
3. **Emerald Studio**: `#0C1715` / `#172824` / `#34D399`
4. **Slate & Violet**: `#11111B` / `#202035` / `#A78BFA`
5. **Warm Editorial**: `#FAF8F4` / `#F0EBE3` / `#A65E39`

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:3000`.

## Replacing Placeholder Content Before Launch

Review and replace sample entries marked `isPlaceholder: true` across:
- `src/data/site.ts` (email, legal dates)
- `src/data/projects.ts` (case studies & `/public/images/projects/*` screenshots)
- `src/data/team.ts` (team profiles, `/public/images/team/*` portraits, `/public/resumes/*.pdf`)
- `src/data/partners.ts` (set to `[]` if no verified partnerships are published yet)
- `src/data/testimonials.ts` (keep `[]` until attributed client quotes are approved)

## Google Sheets Enquiry Setup

See [`docs/google-sheets-setup.md`](docs/google-sheets-setup.md) for complete Apps Script deployment, permissions, secret configuration, and `curl` test instructions.

## Production Build & Verification

```bash
npm run lint
npm run build
NODE_ENV=production npm start
```

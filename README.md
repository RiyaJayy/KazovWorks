# KAZOV WORKS

A premium automotive-parts catalogue and showcase website. Customers browse
used engine and body parts and contact the business directly — there is no
cart, checkout, payment gateway, or customer account system, by design.

## Documentation

This README covers running the project locally. For everything else, see:

- **[`CLIENT_ADMIN_GUIDE.md`](./CLIENT_ADMIN_GUIDE.md)** — for the business
  owner, plain-English guide to running the admin panel.
- **[`DEPLOYMENT_HANDOFF.md`](./DEPLOYMENT_HANDOFF.md)** — for the
  deployment engineer, full technical handoff.
- **[`CLIENT_CONTENT_CHECKLIST.md`](./CLIENT_CONTENT_CHECKLIST.md)** — what
  content and credentials still need to be supplied before launch.

## Features

- Public catalogue with category browsing and per-part detail pages
- On-site inquiry form (emails the business directly — no `mailto:`)
- WhatsApp as a secondary contact option
- Admin panel: product/category/review CRUD, drag-and-drop image upload,
  dashboard stats, visibility toggling
- English-only, fully responsive, dark/burgundy design system with a
  cinematic animated hero

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Images | Cloudinary |
| Email | Resend |
| Auth | JWT in an httpOnly cookie |

## Architecture

Two separate applications — see `DEPLOYMENT_HANDOFF.md` §2 for full detail
on why and how they're deployed separately (frontend → Vercel, backend →
a Node host that supports long-running processes).

```
client/   React SPA
server/   Express API
```

## Folder Structure

```
client/src/
  components/       shared UI
  components/admin/ admin-only UI
  pages/            public pages
  pages/admin/      admin pages
  services/api.js   all backend calls
  hooks/useAuth.jsx admin session state

server/
  config/           db + Cloudinary setup
  models/           Product, Category, Review, Admin
  controllers/      route logic, one per resource
  routes/           one per resource
  middleware/       auth, error handling, rate limiting
  services/         emailService.js (Resend)
  seed/             demo data (dev only) + safe production admin setup
```

## Local Setup

### Backend
```bash
cd server
cp .env.example .env      # fill in MongoDB, Cloudinary, Resend, JWT secret
npm install
npm run seed                # DEV ONLY — creates 33 demo parts + a demo admin
npm run dev                  # http://localhost:5000
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev                  # http://localhost:5173
```

Visit `/admin/login` with the demo admin credentials from `npm run seed`.

## Environment Variables

Full variable lists with explanations are in `DEPLOYMENT_HANDOFF.md` §7.
Quick reference — `server/.env`: `MONGO_URI`, `JWT_SECRET`,
`CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`,
`BUSINESS_EMAIL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`.
`client/.env`: `VITE_API_URL` and public business-contact display values
(not secrets).

## Admin Panel

Full instructions in `CLIENT_ADMIN_GUIDE.md`. In short: `/admin/login`,
then manage parts, categories, and reviews. Inquiries aren't stored in the
admin panel — they're emailed directly to `BUSINESS_EMAIL`.

**Creating the production admin:** use `npm run create-admin`, **not**
`npm run seed` — the seed script wipes product data every time it runs.
`create-admin` only ever touches the Admin account and is safe to re-run.

## Database

MongoDB via Mongoose. `npm run seed` is strictly development-only — it
deletes all existing products/categories before repopulating demo data.
Never run it against a database with real content.

## Cloudinary

Used for all product images. Uploads stream directly from the browser
through the backend to Cloudinary (in memory, never written to disk) —
only the resulting URL is stored in MongoDB. Required env vars:
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

## Resend (Email)

Powers the on-site inquiry form. Requires a verified sending domain — see
`DEPLOYMENT_HANDOFF.md` §11 for setup steps and what has/hasn't been
tested (no real send has been verified; the integration itself has been
tested end-to-end against Resend's actual API surface).

## Build Commands

```bash
cd client && npm run build   # production frontend build
cd client && npm run lint    # 0 errors expected
cd server && npm start       # production backend start
```

## Production Notes

- The server will not accept traffic until it successfully connects to
  MongoDB (no broken-state requests are served).
- Every admin-mutating API endpoint requires authentication — verified via
  live testing against all 17 protected routes.
- CORS only allows origins listed in `CLIENT_URL`.
- Unrecognized server errors return a generic message in production;
  real errors are always logged server-side, never sent to the client.

## Security Notes

- Passwords hashed with bcrypt, never returned by any API.
- Auth token lives in an httpOnly cookie, not localStorage.
- Rate limiting on login (10/15min) and the public inquiry endpoint (5/15min).
- `helmet` and `express-mongo-sanitize` applied globally.
- No secrets in this repository — `.env` is git-ignored, `.env.example`
  files contain placeholders only.

## Known Limitation

Cloudinary images uploaded during an unsaved product form aren't
auto-deleted if the admin cancels instead of saving. Documented in
`DEPLOYMENT_HANDOFF.md` §10/§16 — not a security issue, just a storage
housekeeping note.

## Dependency Note

`npm audit` may show advisories from `qs`, bundled transitively inside
`express@4.x` itself — an ecosystem-wide Express 4 issue, not this
codebase. The fix is Express 5, a breaking change not made here without
the ability to fully verify it.

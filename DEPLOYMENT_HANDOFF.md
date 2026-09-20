# KAZOV WORKS — Deployment Handoff

Technical handoff for the deployment engineer. Every command, variable, and
route listed here has been verified against the actual codebase.

---

## 1. Project Overview

KAZOV WORKS is a used-automotive-parts catalogue/showcase site. Customers
browse and inquire; there is no cart, checkout, or payment gateway by
design. It has a public storefront and a separate admin panel for the
business owner to manage inventory.

---

## 2. Architecture

**This is two separate applications, not one deployable unit.**

```
client/   React + Vite SPA (static build output)
server/   Node.js + Express API (long-running process)
```

The client is a static site once built (`vite build` produces plain
HTML/CSS/JS). The server is a traditional Express app that calls
`app.listen()` and keeps a persistent connection to MongoDB — it is **not**
written as Vercel serverless functions and has not been adapted for that
runtime model.

**Recommended split:**
- **Frontend (`client/`) → Vercel.** This is a natural fit — it's a static
  Vite build, and `client/vercel.json` already contains the SPA rewrite
  rule needed so client-side routes (e.g. `/catalogue/some-part`,
  `/admin/login`) don't 404 on direct navigation or refresh.
- **Backend (`server/`) → a Node host that runs long-lived processes**
  (Render, Railway, Fly.io, a VPS, etc.). It was written and tested against
  a traditional `node server.js` process, not a serverless model.

If you specifically need the backend on Vercel too, it would require
converting the Express app to Vercel's serverless function format (each
route as its own function, or an Express-to-serverless adapter) — that is
a real architectural change, not a deployment config change, and has not
been done here. Flagging this explicitly rather than assuming it "just
works."

---

## 3. Technology Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js (>=18), Express 4, Mongoose 8
- **Database:** MongoDB (Atlas recommended)
- **Images:** Cloudinary (uploaded via the v2 SDK, streamed — no local disk writes)
- **Email:** Resend (inquiry form only)
- **Auth:** JWT in an httpOnly cookie (not localStorage — see §14)

---

## 4. Repository Structure

```
client/src/
  components/       shared UI (Navbar, Footer, ProductCard, modals, etc.)
  components/admin/ admin-only UI (ImageUploader, ProtectedRoute)
  pages/             Home, Catalogue, ProductDetail, About, Contact, NotFound
  pages/admin/       AdminLogin, AdminLayout, AdminDashboard, AdminProducts,
                     AdminProductForm, AdminReviews
  services/api.js    all backend HTTP calls, axios instance
  hooks/useAuth.jsx  admin session context
vercel.json          SPA rewrite rule (required for Vercel deploy)
eslint.config.js
.env.example

server/
  config/              db.js (MongoDB connect), cloudinary.js
  models/              Product, Category, Review, Admin
  controllers/         one per resource (product, category, review, auth, upload, inquiry)
  routes/              one per resource, mirrors controllers
  middleware/          auth.js (JWT verify), errorHandler.js, rateLimit.js
  services/            emailService.js (Resend)
  validators/          inquiryValidator.js
  seed/                seed.js (DEV ONLY — see §8), createAdmin.js (production-safe)
  server.js            entry point
  .env.example
```

---

## 5. Frontend Setup

```bash
cd client
npm install
npm run build      # outputs to client/dist
npm run lint       # 0 errors expected (6 documented warnings, see README)
npm run preview    # serves the production build locally for a final check
```

Deploy `client/` as a Vercel project with framework preset **Vite**.
`client/vercel.json` is already present and required.

---

## 6. Backend Setup

```bash
cd server
npm install
npm start          # node server.js
# or
npm run dev        # nodemon server.js, for local development
```

The server will not accept any HTTP traffic until it successfully connects
to MongoDB — `app.listen()` is gated behind a resolved `connectDB()` call
(verified: confirmed the port stays closed during a failed connection
attempt, and the process exits cleanly rather than serving broken
responses if it truly cannot connect).

---

## 7. Environment Variables

### `server/.env`
```
NODE_ENV
PORT
CLIENT_URL              comma-separated list of allowed frontend origins (CORS)

MONGO_URI

JWT_SECRET
JWT_EXPIRES_IN
COOKIE_NAME

ADMIN_EMAIL             used only by seed.js / createAdmin.js, not read at request time
ADMIN_PASSWORD          same

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_FOLDER

RESEND_API_KEY          backend-only, never exposed to the frontend
EMAIL_FROM              must be on a domain verified in Resend
BUSINESS_EMAIL          where inquiry emails are delivered
BUSINESS_PHONE          displayed on the Contact page
```

### `client/.env`
```
VITE_API_URL            the deployed backend's /api URL
VITE_BUSINESS_EMAIL
VITE_BUSINESS_PHONE
VITE_WHATSAPP_NUMBER
VITE_BUSINESS_ADDRESS
```
Nothing in `client/.env` is a secret — everything here ends up in the
public JS bundle by design (it's just contact info displayed on the site).
Confirmed: no `RESEND_API_KEY`, `CLOUDINARY_API_SECRET`, `MONGO_URI`, or
`JWT_SECRET` exists anywhere under `VITE_*` or in any client-side file.

Full placeholder files are at `server/.env.example` and `client/.env.example`.

---

## 8. Database Configuration

Any MongoDB instance works; MongoDB Atlas free tier is sufficient. Create a
database user and allow network access from your hosting provider's IP
range (or `0.0.0.0/0` for simplicity on a low-traffic site).

**`npm run seed` is development-only.** It unconditionally deletes every
product and category before repopulating ~33 demo parts, and creates a
demo admin account if none exists. **Never run this against a database
that contains real business data** — it does not merge or check for
existing content, it wipes first.

---

## 9. Admin Initialization (Production)

Do **not** use `npm run seed` to create the production admin — it also
wipes product data. Instead:

```bash
cd server
# set ADMIN_EMAIL and ADMIN_PASSWORD in the production environment first
npm run create-admin
```

This script (`server/seed/createAdmin.js`) only ever touches the Admin
collection:
- If no admin exists for that email, it creates one.
- If one already exists, it does nothing (safe to re-run) unless you pass
  `--reset`, in which case it updates that admin's password. Either way,
  it never touches products, categories, or reviews.

Verified (with a fake local test — no real database): correctly rejects
missing credentials and passwords under 8 characters before attempting any
database connection.

---

## 10. Cloudinary Configuration

Standard Cloudinary account; no special API permissions beyond the default
API key/secret. Images are uploaded via the Cloudinary v2 SDK's
`upload_stream`, entirely in memory (Multer uses `memoryStorage()`) —
nothing is ever written to the server's local disk.

Known, documented limitation: deleting an image from a part in the admin
panel does call Cloudinary's delete API immediately (verified in code).
However, if an admin uploads photos while creating/editing a part and then
clicks **Cancel** (or just closes the tab) without saving, those
newly-uploaded images are **not** automatically cleaned up from Cloudinary
— they remain as orphaned assets. This is a minor, known gap, not a
security issue; worth knowing for Cloudinary storage housekeeping.

---

## 11. Resend Configuration

1. Verified sending domain required — Resend will not send from an
   unverified domain. Add DNS records under Resend → Domains.
2. `EMAIL_FROM` must be an address on that verified domain.
3. `BUSINESS_EMAIL` is the inbox that actually receives inquiries — it can
   be any address, doesn't need to be on the verified domain.
4. Reply-To on every inquiry email is set to the customer's submitted
   address, so replying from the business inbox goes straight to them.


---

## 12. Build Commands

```
Frontend build:   cd client && npm run build
Frontend lint:    cd client && npm run lint
Backend start:    cd server && npm start
Backend dev:      cd server && npm run dev
```

---

## 13. CORS

`server/server.js` reads `CLIENT_URL` as a comma-separated list and only
allows those exact origins, with credentials enabled (required for the
httpOnly auth cookie to work cross-origin). Verified: a request from a
non-listed origin is rejected. Update `CLIENT_URL` to include your real
production frontend URL before going live — it currently defaults to a
placeholder Vercel URL in `.env.example`.

---

## 14. Security Notes

- Passwords are hashed with bcrypt (12 salt rounds), never stored or
  returned in plaintext — verified the password field has `select: false`
  at the schema level as a second layer of defense.
- Auth uses a JWT in an **httpOnly cookie**, not localStorage — not
  readable by JavaScript, which meaningfully reduces XSS token-theft risk
  compared to a localStorage-based approach. No migration was needed here;
  this was already the existing implementation.
- **Live-tested**: every admin-mutating endpoint (17 total across
  products, categories, reviews, auth, upload) correctly returns 401 for
  unauthenticated requests. A tampered/forged JWT is also correctly
  rejected.
- Login endpoint has a dedicated rate limiter (10 attempts / 15 min);
  the public inquiry endpoint has its own (5 / 15 min) to prevent it being
  used to spam the business inbox.
- `express-mongo-sanitize` and `helmet` are applied globally.
- Malformed MongoDB ObjectIds are caught and return a clean 404, not a
  crash or a leaked stack trace (verified).
- Any unrecognized server error returns a generic client-facing message
  in production while the real error is always logged server-side
  (verified for both the DB-connection and Resend-failure cases).

---

## 15. External Configuration Required

- Production MongoDB Atlas cluster + connection string
- Production Cloudinary account + API credentials
- Production Resend account, verified sending domain, API key
- Production `BUSINESS_EMAIL` / `EMAIL_FROM`
- Production admin email/password (set via `npm run create-admin`, not the seed script)
- Real `CLIENT_URL` (frontend) and `VITE_API_URL` (backend) once both are deployed
- Domain, DNS, SSL — standard Vercel setup for the frontend; whatever your
  chosen Node host requires for the backend

## 16. Known, Documented Limitation

Cloudinary images uploaded during an unsaved product form are not
auto-deleted if the admin cancels instead of saving (see §10). Not a
security issue — flagged for storage housekeeping awareness only.

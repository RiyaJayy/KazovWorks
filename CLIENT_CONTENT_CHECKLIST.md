# KAZOV WORKS — Content & Production Checklist

Use this to track what's needed before the site is fully live with real
content. No passwords or secrets belong in this file.

---

## Business Information

- [ ] Final business name (currently "KAZOV WORKS")
- [ ] Logo (currently a generated wheel/speed-line mark — swap if you have
      your own)
- [ ] Phone number for the Contact page
- [ ] Business email for the Contact page and inquiry delivery
- [ ] Full address for the Contact page
- [ ] Social media links, if any (not currently on the site — let your
      developer know if you want these added)
- [ ] About/company content (the About page currently has general
      placeholder copy — confirm or replace)

---

## Products / Parts

The site currently has ~33 demo parts for layout purposes. For each real
part you list, you'll need:

- [ ] Final name
- [ ] Final price
- [ ] Description (short summary + full description)
- [ ] Category
- [ ] At least one photo
- [ ] Vehicle make/model/compatible years, if relevant
- [ ] Condition (Used / Refurbished / New)
- [ ] Availability (In Stock / Reserved / Sold)

All of this is entered through the admin panel — see `CLIENT_ADMIN_GUIDE.md`.

---

## Email

- [ ] Production Resend account created
- [ ] Sending domain verified in Resend (DNS records added)
- [ ] Sender email address decided (`EMAIL_FROM`)
- [ ] Recipient inbox decided (`BUSINESS_EMAIL`) — where inquiries land

---

## Production Infrastructure

- [ ] Production MongoDB database
- [ ] Production Cloudinary account
- [ ] Production admin account created (via `npm run create-admin` — **not**
      the demo seed script, which would wipe real product data)
- [ ] All production environment variables set on the hosting platform
- [ ] Domain purchased/pointed at hosting
- [ ] DNS configured
- [ ] SSL certificate active (standard on Vercel and most modern hosts)

---

## Before Launch

- [ ] All demo/placeholder parts replaced or removed
- [ ] Contact page info double-checked for accuracy
- [ ] A real test inquiry sent through the live site and confirmed received
- [ ] Admin password changed from any development default

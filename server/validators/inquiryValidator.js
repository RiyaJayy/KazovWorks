const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Permissive on purpose — accepts local and international formats
// (+92 300 1234567, (021) 1234567, 0300-1234567, etc.) without being
// overly restrictive about a specific country's numbering plan.
const PHONE_RE = /^[+]?[0-9\s().-]{7,20}$/;

const LIMITS = {
  partName: 200,
  name: 100,
  email: 254,
  phone: 25,
  message: 1000,
};

// Shared between frontend and backend validation logic — the backend is the
// source of truth; the frontend mirrors these same rules for instant feedback.
const validateInquiry = (body = {}) => {
  const errors = {};
  const partName = String(body.partName ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!partName) errors.partName = "Part/product is required.";
  else if (partName.length > LIMITS.partName) errors.partName = "Part name is too long.";

  if (!name) errors.name = "Name is required.";
  else if (name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;

  if (!email) errors.email = "Email is required.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!phone) errors.phone = "Phone number is required.";
  else if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number.";

  if (!message) errors.message = "Message is required.";
  else if (message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    clean: { partName, name, email, phone, message },
  };
};

module.exports = { validateInquiry, LIMITS };

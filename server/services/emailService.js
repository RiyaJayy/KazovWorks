const { Resend } = require("resend");

// Lazily created so the app can boot in development without a Resend API
// key configured yet — only sending an actual inquiry requires it.
let resendClient = null;

const getResendClient = () => {
  if (resendClient) return resendClient;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
};

// Minimal, dependency-free HTML escaping for user-controlled values before
// they're interpolated into the HTML email body.
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildInquiryEmail = ({ partName, name, email, phone, message }) => {
  const safe = {
    partName: escapeHtml(partName),
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    message: escapeHtml(message).replace(/\n/g, "<br />"),
  };

  const subject = `Part Inquiry — ${partName}`;

  const text = [
    "New Website Inquiry",
    "",
    "Part/Product:",
    partName,
    "",
    "Customer Information",
    "",
    "Name:",
    name,
    "",
    "Email:",
    email,
    "",
    "Phone:",
    phone,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #141414;">
      <h2 style="margin-bottom: 4px;">New Website Inquiry</h2>
      <p style="color: #7A1E2C; font-weight: bold; margin-top: 0;">KAZOV WORKS</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 120px; vertical-align: top;">Part/Product</td>
          <td style="padding: 8px 0; font-weight: bold;">${safe.partName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; vertical-align: top;">Name</td>
          <td style="padding: 8px 0;">${safe.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; vertical-align: top;">Email</td>
          <td style="padding: 8px 0;">${safe.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; vertical-align: top;">Phone</td>
          <td style="padding: 8px 0;">${safe.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; vertical-align: top;">Message</td>
          <td style="padding: 8px 0;">${safe.message}</td>
        </tr>
      </table>
    </div>
  `;

  return { subject, text, html };
};

// Sends the inquiry to the configured business mailbox via Resend. Throws
// on failure — the caller (controller) decides how to respond to the
// client. The Resend SDK does NOT throw on API-level failures (invalid key,
// unverified sender domain, etc.) — it resolves with { data, error } — so
// that case is converted into a thrown Error here to keep the existing
// controller's try/catch behavior working unchanged.
const sendInquiryEmail = async ({ partName, name, email, phone, message }) => {
  const businessEmail = process.env.BUSINESS_EMAIL;
  if (!businessEmail) {
    throw new Error("BUSINESS_EMAIL is not configured.");
  }
  const fromAddress = process.env.EMAIL_FROM;
  if (!fromAddress) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  const { subject, text, html } = buildInquiryEmail({ partName, name, email, phone, message });
  const resend = getResendClient();

  const result = await resend.emails.send({
    from: `KAZOV WORKS Website <${fromAddress}>`,
    to: businessEmail,
    replyTo: email,
    subject,
    text,
    html,
  });

  if (result.error) {
    // Log full diagnostic detail server-side only (never sent to the client).
    console.error("[Resend send failed]", result.error);
    throw new Error(`Resend rejected the email: ${result.error.message || result.error.name}`);
  }
};

module.exports = { sendInquiryEmail };

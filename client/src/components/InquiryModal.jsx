import { useEffect, useState } from "react";
import Modal from "./Modal";
import { submitInquiry } from "../services/api";

// Mirrors server/validators/inquiryValidator.js — the backend is the source
// of truth; this just gives the customer instant feedback before submitting.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[0-9\s().-]{7,20}$/;
const LIMITS = { name: 100, message: 1000 };

const emptyForm = { name: "", email: "", phone: "", message: "" };

export default function InquiryModal({ open, onClose, partName }) {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverError, setServerError] = useState("");

  // Reset to a clean form each time the modal is freshly opened.
  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setFieldErrors({});
      setStatus("idle");
      setServerError("");
    }
  }, [open]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const errors = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (!name) errors.name = "Name is required.";
    else if (name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;

    if (!email) errors.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

    if (!phone) errors.phone = "Phone number is required.";
    else if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number.";

    if (!message) errors.message = "Message is required.";
    else if (message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setStatus("sending");
    try {
      await submitInquiry({ partName, ...form });
      setStatus("success");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      setServerError(data?.message || "Something went wrong while sending your inquiry. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Inquire About This Part">
      {status === "success" ? (
        <div>
          <p className="text-sm leading-relaxed text-alloy">
            Your inquiry has been sent successfully.
            <br />
            We will get back to you soon.
          </p>
          <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="inquiry-part" className="mb-1 block font-display text-xs tracking-wide text-ash">
              Part
            </label>
            <input
              id="inquiry-part"
              value={partName}
              readOnly
              className="w-full cursor-not-allowed rounded-sm border border-steel bg-onyx/60 px-3 py-2 text-sm text-ash outline-none"
            />
          </div>

          <div>
            <label htmlFor="inquiry-name" className="mb-1 block font-display text-xs tracking-wide text-ash">
              Name
            </label>
            <input
              id="inquiry-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "inquiry-name-error" : undefined}
              className="w-full rounded-sm border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy"
            />
            {fieldErrors.name && <p id="inquiry-name-error" className="mt-1 text-xs text-rust">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="inquiry-email" className="mb-1 block font-display text-xs tracking-wide text-ash">
              Email
            </label>
            <input
              id="inquiry-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "inquiry-email-error" : undefined}
              className="w-full rounded-sm border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy"
            />
            {fieldErrors.email && <p id="inquiry-email-error" className="mt-1 text-xs text-rust">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="inquiry-phone" className="mb-1 block font-display text-xs tracking-wide text-ash">
              Phone
            </label>
            <input
              id="inquiry-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+92 300 1234567"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "inquiry-phone-error" : undefined}
              className="w-full rounded-sm border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy"
            />
            {fieldErrors.phone && <p id="inquiry-phone-error" className="mt-1 text-xs text-rust">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label htmlFor="inquiry-message" className="mb-1 block font-display text-xs tracking-wide text-ash">
              Message
            </label>
            <textarea
              id="inquiry-message"
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "inquiry-message-error" : undefined}
              className="w-full rounded-sm border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy"
            />
            {fieldErrors.message && <p id="inquiry-message-error" className="mt-1 text-xs text-rust">{fieldErrors.message}</p>}
          </div>

          {status === "error" && serverError && (
            <p className="text-sm text-rust" role="alert">{serverError}</p>
          )}

          <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
            {status === "sending" ? "Sending…" : "Send Inquiry"}
          </button>
        </form>
      )}
    </Modal>
  );
}

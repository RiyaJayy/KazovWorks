const { validateInquiry } = require("../validators/inquiryValidator");
const { sendInquiryEmail } = require("../services/emailService");

// @desc  Submit a part inquiry — validated, then emailed to the business mailbox
// @route POST /api/inquiries
const submitInquiry = async (req, res, next) => {
  const { valid, errors, clean } = validateInquiry(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, message: "Please check the highlighted fields.", errors });
  }

  try {
    await sendInquiryEmail(clean);
    res.status(200).json({ success: true, message: "Your inquiry has been sent successfully." });
  } catch (err) {
    // Never leak the Resend API key or provider-level details to the client —
    // log the real error server-side and let the global error handler
    // return a generic, safe message (it already falls back to a generic
    // message + 500 for any error it doesn't specifically recognize).
    console.error("[Inquiry email failed]", err.message);
    next(err);
  }
};

module.exports = { submitInquiry };

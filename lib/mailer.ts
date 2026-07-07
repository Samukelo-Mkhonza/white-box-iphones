// No email provider is wired up yet. This is the single seam to swap in a
// real one (e.g. Resend, SES) later without touching call sites.
export async function sendMail(message: { to: string; subject: string; body: string }) {
  console.log("[mailer] Sending email", message);
}

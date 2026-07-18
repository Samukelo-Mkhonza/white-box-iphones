// TODO: replace with a real email provider (e.g. Resend, Postmark). Until
// then, delivery is a server-console log so the flow is testable in dev.
export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  console.log(`[email] Password reset requested for ${email}: ${resetUrl}`);
}

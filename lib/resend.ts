import { Resend } from "resend";

export function getResendClient(): Resend | undefined {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return undefined;
  return new Resend(apiKey);
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const resend = getResendClient();
  if (!resend) throw new Error("RESEND_API_KEY not set");

  const fromAddress =
    from ?? process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";

  return resend.emails.send({ from: fromAddress, to, subject, html });
}

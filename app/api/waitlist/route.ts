import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTransactionalEmail } from "@/lib/resend";
import { getPostHogClient } from "@/lib/posthog";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json() as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase
      .from("waitlist")
      .insert({ email, source: "landing_page" })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // duplicate — treat as success so we don't leak whether email exists
        return NextResponse.json({ ok: true, duplicate: true });
      }
      console.error("[waitlist] supabase insert error:", error.message);
      return NextResponse.json(
        { error: "Failed to save — please try again" },
        { status: 500 }
      );
    }
  }

  // Server-side signup event
  const ph = getPostHogClient();
  if (ph) {
    ph.capture({
      distinctId: email,
      event: "waitlist_signup_server",
      properties: { source: "landing_page" },
    });
    await ph.shutdown();
  }

  // Welcome email (non-blocking — don't fail signup if email fails)
  try {
    await sendTransactionalEmail({
      to: email,
      subject: "You're on the LeasePilot waitlist!",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">You're on the list!</h1>
          <p style="color:#4b5563;line-height:1.6">
            Thanks for signing up for early access to <strong>LeasePilot</strong>.<br><br>
            We'll email you the moment beta opens. In the meantime, if you have
            leases you'd like us to prioritise extracting, just reply to this email.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="font-size:12px;color:#9ca3af">
            You're receiving this because you signed up at leasepilot.co.<br>
            <a href="mailto:hello@leasepilot.co">Unsubscribe</a>
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error("[waitlist] welcome email failed:", (emailErr as Error).message);
  }

  return NextResponse.json({ ok: true });
}

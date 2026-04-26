import { NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const { to } = await request.json() as { to: string };

  if (!to) {
    return NextResponse.json({ error: "Missing 'to' field" }, { status: 400 });
  }

  try {
    const result = await sendTransactionalEmail({
      to,
      subject: "SaaS Starter — email smoke test",
      html: "<p>Email delivery is working. Stack is live.</p>",
    });
    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("Sentry smoke-test error — expected");
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ captured: true });
  }
}

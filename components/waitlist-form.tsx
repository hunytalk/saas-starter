"use client";

import { useState, useEffect, useRef } from "react";
import posthog from "posthog-js";

interface WaitlistFormProps {
  ctaVariant?: "primary" | "secondary";
}

export function WaitlistForm({ ctaVariant = "primary" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasTrackedView.current) {
      posthog.capture("waitlist_form_viewed", { variant: ctaVariant });
      hasTrackedView.current = true;
    }
  }, [ctaVariant]);

  function handleCtaClick() {
    posthog.capture("waitlist_cta_clicked", { variant: ctaVariant });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      posthog.capture("waitlist_signup", { email, variant: ctaVariant });
      setState("success");
      setEmail("");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="text-green-600 font-semibold text-lg">
          You&apos;re on the list!
        </div>
        <p className="text-sm text-gray-500">
          We&apos;ll email you the moment early access opens.
        </p>
      </div>
    );
  }

  const isPrimary = ctaVariant === "primary";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-3 w-full ${isPrimary ? "max-w-md mx-auto" : "max-w-sm mx-auto"}`}
    >
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        onClick={handleCtaClick}
        className="px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition disabled:opacity-60 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
      >
        {state === "loading" ? "Joining…" : "Join the Waitlist"}
      </button>
      {state === "error" && (
        <p className="text-xs text-red-500 mt-1 sm:col-span-2">{errorMsg}</p>
      )}
    </form>
  );
}

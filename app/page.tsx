import { WaitlistForm } from "@/components/waitlist-form";
import { CheckCircle, FileText, Bell } from "lucide-react";

export const metadata = {
  title: "LeasePilot — AI Lease Intelligence for Independent Landlords",
  description:
    "Upload any lease PDF and instantly extract every critical date, clause, and obligation. Never miss a renewal or rent escalation again.",
  openGraph: {
    title: "LeasePilot — Never Miss a Lease Date Again",
    description:
      "AI-powered lease abstraction for independent landlords managing 5–50 units.",
  },
};

const valueProps = [
  {
    icon: FileText,
    title: "Instant Lease Extraction",
    description:
      "Upload any lease PDF. LeasePilot extracts every critical date, clause, and obligation in seconds — no more manual combing through 40-page documents.",
  },
  {
    icon: Bell,
    title: "Smart Expiration Alerts",
    description:
      "Get email alerts 90, 60, and 30 days before lease renewals, rent escalations, and key deadlines. Never lose revenue from a missed clause again.",
  },
  {
    icon: CheckCircle,
    title: "Your Leases, Your Control",
    description:
      "Every extraction is AI-assisted — you review before it locks. Full data export and delete-my-data available from day one.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="w-full border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight text-gray-900">
            LeasePilot
          </span>
          <span className="text-sm text-gray-500">Early Access</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
          Join the waitlist · free during beta
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          Never Miss a Lease Date Again
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Upload any lease PDF and get every critical date, renewal clause, and
          rent escalation extracted in seconds — with 90/60/30-day email alerts
          before anything expires.
        </p>

        <WaitlistForm />

        <p className="text-xs text-gray-400 mt-4">
          No credit card. No spam. Unsubscribe any time.
        </p>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">5–50</p>
            <p className="text-sm text-gray-500">units per landlord</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-gray-900">&lt; 60s</p>
            <p className="text-sm text-gray-500">to extract any lease</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-gray-900">90/60/30</p>
            <p className="text-sm text-gray-500">day alerts before deadlines</p>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Everything you need to stay on top of every lease
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {valueProps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Be first when we launch
          </h2>
          <p className="text-gray-600 mb-8">
            Early access is free. Lock in your spot while beta spots last.
          </p>
          <WaitlistForm ctaVariant="secondary" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© 2026 LeasePilot. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-700 transition-colors">
              Privacy
            </a>
            <a
              href="mailto:hello@leasepilot.co"
              className="hover:text-gray-700 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

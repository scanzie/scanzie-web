import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck, CreditCard, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Scanzie",
  description:
    "Read the Terms of Service for using Scanzie, including billing terms, acceptable use, and our no-refund policy.",
};

const LAST_UPDATED = "January 1, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/60 via-white to-white">
      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-[0_8px_30px_rgba(59,130,246,0.08)] sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <FileText className="h-3.5 w-3.5" />
            Legal
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            These Terms of Service govern your access to and use of Scanzie. By
            accessing or using Scanzie, you agree to these terms.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Last updated: {LAST_UPDATED}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Applies to all users
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-3 text-slate-600 leading-7">
              By creating an account, subscribing, or using any part of Scanzie,
              you confirm that you have read, understood, and agreed to these
              Terms of Service and our applicable policies.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">2. Use of the Service</h2>
            <p className="mt-3 text-slate-600 leading-7">
              You agree to use Scanzie only for lawful purposes. You must not:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              <li>Use the platform to violate any law or third-party rights.</li>
              <li>Attempt unauthorized access to systems, accounts, or data.</li>
              <li>Interfere with service stability, security, or availability.</li>
              <li>Submit malicious scripts, abuse APIs, or attempt scraping beyond allowed usage.</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">3. Billing, Subscriptions, and Refunds</h2>
                <p className="mt-3 text-slate-600 leading-7">
                  Paid plans are billed according to the pricing presented at
                  checkout. You are responsible for providing valid and current
                  billing information.
                </p>
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    No-Refund Policy
                  </p>
                  <p className="mt-1 text-sm text-red-700/90 leading-6">
                    All payments are final. Scanzie does not provide refunds,
                    whether for partial billing periods, unused time, accidental
                    purchases, or subscription cancellations.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">4. Account Responsibility</h2>
            <p className="mt-3 text-slate-600 leading-7">
              You are responsible for safeguarding your account credentials and
              for all activities under your account. If you suspect unauthorized
              use, you should contact support immediately.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">5. Service Availability and Changes</h2>
            <p className="mt-3 text-slate-600 leading-7">
              We may modify, suspend, or discontinue features at any time. We
              strive for reliability but do not guarantee uninterrupted service.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">6. Intellectual Property</h2>
            <p className="mt-3 text-slate-600 leading-7">
              Scanzie, including its software, design, and branding, is protected
              by intellectual property laws. You may not copy, reverse engineer,
              or redistribute protected components without permission.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">7. Disclaimer and Limitation of Liability</h2>
                <p className="mt-3 text-slate-600 leading-7">
                  Scanzie is provided on an “as is” and “as available” basis.
                  To the fullest extent permitted by law, we disclaim warranties
                  of any kind and are not liable for indirect, incidental,
                  special, consequential, or punitive damages arising from use
                  of the service.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">8. Termination</h2>
            <p className="mt-3 text-slate-600 leading-7">
              We may suspend or terminate access if these terms are violated or
              if misuse of the platform is detected.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900">9. Contact</h2>
            <p className="mt-3 text-slate-600 leading-7">
              If you have questions about these Terms of Service, please reach
              out via the{" "}
              <Link href="/support" className="font-medium text-blue-700 hover:underline">
                Support page
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-medium text-blue-700 hover:underline">
                Contact page
              </Link>.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

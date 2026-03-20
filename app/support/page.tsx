import type { Metadata } from "next";
import Link from "next/link";
import SupportForm from "@/components/support/SupportForm";

export const metadata: Metadata = {
  title: "Support | Scanzie",
  description:
    "Get help with your Scanzie account, SEO analysis workflows, billing, and technical issues.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/50 via-white to-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              ← Back to Home
            </Link>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Need help? We’ve got you.
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Use this page for support-related requests. Share enough detail so
              we can assist quickly and accurately.
            </p>

            <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                What to include
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• The page or feature where the issue happened</li>
                <li>• What you expected vs what happened</li>
                <li>• Any error message you saw</li>
                <li>• Your account email for follow-up</li>
              </ul>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              For security, never include passwords or API keys in your
              message.
            </p>
          </div>

          <div className="lg:col-span-7">
            <SupportForm type="support" />
          </div>
        </div>
      </section>
    </main>
  );
}

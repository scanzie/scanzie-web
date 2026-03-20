import type { Metadata } from "next";
import Link from "next/link";
import SupportForm from "@/components/support/SupportForm";

export const metadata: Metadata = {
  title: "Report a Bug | Scanzie",
  description:
    "Found an issue in Scanzie? Report it here and our team will investigate quickly.",
};

export default function ReportBugPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/70 via-white to-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
          >
            ← Back to home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Report a Bug
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Please share what happened and how we can reproduce it. The more
            detail you provide, the faster we can fix it.
          </p>
        </div>

        <SupportForm
          type="bug"
          title="Submit a Bug Report"
          subtitle="Include expected behavior, actual behavior, and reproduction steps."
        />

      </div>
    </main>
  );
}

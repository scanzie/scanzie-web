import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Headset, Mail } from "lucide-react";
import SupportForm from "@/components/support/SupportForm";

export const metadata: Metadata = {
  title: "Contact Us | Scanzie",
  description:
    "Get in touch with Scanzie for support, partnership inquiries, or general questions.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 via-white to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-[0_8px_30px_rgba(59,130,246,0.08)] sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Mail className="h-3.5 w-3.5" />
            Contact Scanzie
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            We&apos;re here to help
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Reach out for support, questions, collaboration, or product
            feedback. Your message will be delivered directly to our team.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              <Headset className="h-4 w-4 text-blue-600" />
              Fast support response
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Direct email delivery
            </span>
          </div>
        </div>

        <SupportForm type="contact" />
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type SupportFormType = "contact" | "support" | "bug";

type SupportFormProps = {
  type?: SupportFormType;
  defaultName?: string;
  defaultEmail?: string;
  userId?: string;
  pageUrl?: string;
  className?: string;
  title?: string;
  subtitle?: string;
};

const typeConfig: Record<
  SupportFormType,
  { heading: string; helper: string; defaultSubject: string }
> = {
  contact: {
    heading: "Contact Us",
    helper: "Have a question or partnership idea? Send us a message.",
    defaultSubject: "General Contact",
  },
  support: {
    heading: "Support Request",
    helper: "Need help with your account, billing, or analysis workflow?",
    defaultSubject: "Support Needed",
  },
  bug: {
    heading: "Report a Bug",
    helper: "Found an issue? Share details so we can fix it quickly.",
    defaultSubject: "Bug Report",
  },
};

const emailRegex = /\S+@\S+\.\S+/;

export default function SupportForm({
  type = "support",
  defaultName = "",
  defaultEmail = "",
  userId = "",
  pageUrl = "",
  className = "",
  title,
  subtitle,
}: SupportFormProps) {
  const config = useMemo(() => typeConfig[type], [type]);

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState(config.defaultSubject);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const heading = title ?? config.heading;
  const helper = subtitle ?? config.helper;

  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !emailRegex.test(email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!subject.trim()) return "Please enter a subject.";
    if (!message.trim()) return "Please enter your message.";
    if (message.trim().length < 10) {
      return "Your message should be at least 10 characters.";
    }
    return "";
  };

  const resetIfSuccess = () => {
    setMessage("");
    if (type === "bug") {
      setSubject("Bug Report");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("idle");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          userId: userId || undefined,
          pageUrl: pageUrl || (typeof window !== "undefined" ? window.location.href : undefined),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to send your message right now.");
      }

      setStatus("success");
      resetIfSuccess();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={[
        "w-full rounded-2xl border border-blue-100 bg-white p-5 sm:p-7",
        "shadow-[0_8px_30px_rgba(59,130,246,0.10)]",
        className,
      ].join(" ")}
    >
      <div className="mb-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Scanzie {type.toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{heading}</h2>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">{helper}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="support-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="support-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label htmlFor="support-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="support-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="support-subject" className="mb-1.5 block text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            id="support-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief subject"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label htmlFor="support-message" className="mb-1.5 block text-sm font-medium text-slate-700">
            Message
          </label>
          <Textarea
            id="support-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              type === "bug"
                ? "Please include what you expected, what happened, and steps to reproduce."
                : "How can we help you today?"
            }
            className="min-h-36 border-slate-300 bg-white text-sm focus-visible:ring-blue-100"
            disabled={isSubmitting}
            required
          />
        </div>

        {status === "error" && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Your message has been sent successfully. We’ll get back to you soon.</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </section>
  );
}

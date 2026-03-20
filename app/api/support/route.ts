import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUPPORT_EMAIL = "olufisayobadina@gmail.com";

type SupportType = "support" | "contact" | "bug";

type SupportPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: SupportType;
  pageUrl?: string;
  userId?: string;
};

const sanitize = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildEmailHtml = (payload: SupportPayload) => {
  const safeName = sanitize(payload.name);
  const safeEmail = sanitize(payload.email);
  const safeSubject = sanitize(payload.subject);
  const safeMessage = sanitize(payload.message).replace(/\n/g, "<br />");
  const safeType = sanitize(payload.type ?? "support");
  const safePageUrl = sanitize(payload.pageUrl ?? "N/A");
  const safeUserId = sanitize(payload.userId ?? "N/A");

  return `
  <div style="font-family: Inter, Arial, sans-serif; line-height: 1.55; color: #0f172a; max-width: 640px; margin: 0 auto; padding: 20px;">
    <h2 style="margin: 0 0 16px; color: #1d4ed8;">Scanzie ${safeType.toUpperCase()} Request</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tbody>
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #475569; font-weight: 600;">Name</td>
          <td style="padding: 8px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #475569; font-weight: 600;">Email</td>
          <td style="padding: 8px 0;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #475569; font-weight: 600;">Type</td>
          <td style="padding: 8px 0;">${safeType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #475569; font-weight: 600;">Subject</td>
          <td style="padding: 8px 0;">${safeSubject}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #475569; font-weight: 600;">User ID</td>
          <td style="padding: 8px 0;">${safeUserId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #475569; font-weight: 600;">Page URL</td>
          <td style="padding: 8px 0;">${safePageUrl}</td>
        </tr>
      </tbody>
    </table>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px;">
      <p style="margin: 0 0 8px; color: #334155; font-weight: 600;">Message</p>
      <p style="margin: 0; white-space: normal;">${safeMessage}</p>
    </div>

    <p style="margin-top: 20px; color: #64748b; font-size: 13px;">
      This email was sent from the Scanzie support/contact form.
    </p>
  </div>
  `;
};

const buildEmailText = (payload: SupportPayload) => {
  return [
    `Scanzie ${payload.type?.toUpperCase() ?? "SUPPORT"} Request`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Type: ${payload.type ?? "support"}`,
    `Subject: ${payload.subject}`,
    `User ID: ${payload.userId ?? "N/A"}`,
    `Page URL: ${payload.pageUrl ?? "N/A"}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SupportPayload>;

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const subject = (body.subject ?? "").trim();
    const message = (body.message ?? "").trim();
    const type: SupportType =
      body.type === "bug" || body.type === "contact" || body.type === "support"
        ? body.type
        : "support";
    const pageUrl = (body.pageUrl ?? "").trim();
    const userId = (body.userId ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "name, email, subject, and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing RESEND_API_KEY." },
        { status: 500 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const from = process.env.RESEND_FROM_EMAIL || "Scanzie Support <onboarding@resend.dev>";
    const emailSubject = `[Scanzie ${type.toUpperCase()}] ${subject}`;

    const { error } = await resend.emails.send({
      from,
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: emailSubject,
      html: buildEmailHtml({
        name,
        email,
        subject,
        message,
        type,
        pageUrl,
        userId,
      }),
      text: buildEmailText({
        name,
        email,
        subject,
        message,
        type,
        pageUrl,
        userId,
      }),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send support email.", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Support route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error while sending message." },
      { status: 500 },
    );
  }
}

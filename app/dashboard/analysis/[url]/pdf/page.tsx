import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";
import { getSubscriptionStatus } from "@/lib/actions/subscription";
import { getPlanLimits, resolvePlan } from "@/lib/constants/plans";
import { fetchAnalysisDetails } from "@/lib/actions/analysis";
import { calculateOverallScore, getScoreBreakdown } from "@/utils/seo-utils";
import type { SEOAnalysisResult } from "@/components/dashboard/analysis/AnalysisDetails";

import AutoPrint from "./AutoPrint";

const PdfPage = async ({ params }: { params: { url: string } }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return (
      <div className="p-10">
        <p className="text-sm text-gray-700">You need to sign in first.</p>
        <Link className="underline text-sm text-blue-700" href="/login">
          Go to login
        </Link>
      </div>
    );
  }

  const sub = await getSubscriptionStatus(session.user.id);
  const plan = resolvePlan(sub?.plan ?? null, sub?.status ?? null);
  const limits = getPlanLimits(plan);

  if (limits.pdfDownload !== true) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-semibold text-gray-900">PDF download</h1>
        <p className="mt-2 text-sm text-gray-700">
          PDF downloads are available on the Pro and Business plans.
        </p>
        <Link className="underline text-sm text-blue-700" href="/upgrade">
          Upgrade your plan
        </Link>
      </div>
    );
  }

  const decodedUrl = decodeURIComponent(params.url ?? "");
  const data = await fetchAnalysisDetails(decodedUrl);
  const analysis = data?.analysis ?? null;

  if (!analysis) {
    return (
      <div className="p-10">
        <p className="text-sm text-gray-700">Analysis not found.</p>
        <Link className="underline text-sm text-blue-700" href="/dashboard/analysis">
          Back to analysis
        </Link>
      </div>
    );
  }

  // `seo_analysis.*` JSON columns can be null. Normalize to objects for scoring.
  const results: SEOAnalysisResult = {
    technical:
      analysis.technical && typeof analysis.technical === "object"
        ? (analysis.technical as SEOAnalysisResult["technical"])
        : ({} as SEOAnalysisResult["technical"]),
    content:
      analysis.content && typeof analysis.content === "object"
        ? (analysis.content as SEOAnalysisResult["content"])
        : ({} as SEOAnalysisResult["content"]),
    on_page:
      analysis.on_page && typeof analysis.on_page === "object"
        ? (analysis.on_page as SEOAnalysisResult["on_page"])
        : ({} as SEOAnalysisResult["on_page"]),
    url: analysis.url ?? "",
    title: analysis.title ?? "",
    id: analysis.id ?? "",
    userId: analysis.userId ?? "",
    createdAt: analysis.createdAt ?? new Date(),
    updatedAt: analysis.updatedAt ?? new Date(),
  };

  const overall = calculateOverallScore(results);
  const breakdown = getScoreBreakdown(results);

  return (
    <div className="bg-white text-gray-900">
      <AutoPrint />
      <div className="mx-auto max-w-3xl p-10 print:p-6">
        <header className="border-b pb-6">
          <h1 className="text-2xl font-bold">Scanzie SEO Analysis Report</h1>
          <p className="mt-2 text-sm text-gray-700 break-all">{analysis.url}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Overall score
              </p>
              <p className="mt-1 text-3xl font-bold">{overall}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Breakdown
              </p>
              <p className="mt-1 text-sm text-gray-800">
                Technical: {breakdown.technical} · On-page: {breakdown.onPage} ·
                Content: {breakdown.content}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 print:hidden">
            Your browser print dialog will open automatically. Choose “Save as
            PDF” to download.
          </p>
        </header>

        <section className="mt-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold">Top issues</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-gray-800 space-y-1">
              {(results.technical?.issues ?? []).slice(0, 10).map((issue) => (
                <li key={`t-${issue}`}>{issue}</li>
              ))}
              {(results.on_page?.title?.issues ?? []).slice(0, 5).map((issue) => (
                <li key={`op-title-${issue}`}>{issue}</li>
              ))}
              {(results.content?.issues ?? []).slice(0, 5).map((issue) => (
                <li key={`c-${issue}`}>{issue}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Key metrics</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Page speed
                </p>
                <p className="mt-1 text-gray-800">
                  Load time: {results.technical?.pageSpeed?.loadTime ?? "—"}ms ·
                  Score: {results.technical?.pageSpeed?.score ?? "—"}
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Content
                </p>
                <p className="mt-1 text-gray-800">
                  Words: {results.content?.wordCount ?? "—"} · Readability:{" "}
                  {results.content?.readabilityScore ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t pt-6 text-xs text-gray-500">
          Generated on {new Date().toLocaleString()}
        </footer>
      </div>
    </div>
  );
};

export default PdfPage;


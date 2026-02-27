"use client";

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`rounded bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%] ${className ?? ""}`}
    style={{ animation: "shimmer 1.6s infinite linear" }}
  />
);

/* ── Reusable pieces ── */

const ScoreCardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <Shimmer className="h-10 w-10 rounded-xl" />
    <Shimmer className="mt-1 h-7 w-24" />
    <Shimmer className="h-4 w-28" />
  </div>
);

const KeyValueRowSkeleton = ({
  valueWidth = "w-16",
}: {
  valueWidth?: string;
}) => (
  <div className="flex items-center justify-between py-2">
    <Shimmer className="h-4 w-36" />
    <Shimmer className={`h-6 ${valueWidth} rounded-full`} />
  </div>
);

const SectionTitle = () => <Shimmer className="h-6 w-44" />;

/* ── Technical Analysis sub-cards ── */

const TechSubCard = ({ rows }: { rows: number }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
    <Shimmer className="mb-3 h-5 w-40" />
    {Array.from({ length: rows }).map((_, i) => (
      <KeyValueRowSkeleton key={i} valueWidth={i % 2 === 0 ? "w-20" : "w-14"} />
    ))}
  </div>
);

/* ── On-Page SEO sub-cards ── */

const OnPageMetaCard = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
    <Shimmer className="h-5 w-32" />
    {/* Title Tag row */}
    <div className="flex items-center justify-between">
      <Shimmer className="h-4 w-20" />
      <Shimmer className="h-6 w-16 rounded-full" />
    </div>
    <Shimmer className="h-10 w-full rounded-lg" />
    {/* Meta Description row */}
    <div className="flex items-center justify-between">
      <Shimmer className="h-4 w-32" />
      <Shimmer className="h-6 w-16 rounded-full" />
    </div>
    <Shimmer className="h-14 w-full rounded-lg" />
  </div>
);

const OnPageStatsCard = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
    <Shimmer className="mb-3 h-5 w-36" />
    {["w-32", "w-28", "w-24", "w-36", "w-28", "w-24"].map((w, i) => (
      <div key={i} className="flex items-center justify-between py-2">
        <Shimmer className={`h-4 ${w}`} />
        <Shimmer className="h-4 w-6" />
      </div>
    ))}
  </div>
);

/* ── Preview cards ── */

const PreviewCard = ({ tabCount }: { tabCount: number }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
    {/* Header */}
    <div className="space-y-1">
      <Shimmer className="h-5 w-48" />
      <Shimmer className="h-3 w-64" />
    </div>
    {/* Tabs */}
    <div className="flex gap-3">
      {Array.from({ length: tabCount }).map((_, i) => (
        <Shimmer
          key={i}
          className={`h-8 w-20 rounded-full ${i === 0 ? "opacity-100" : "opacity-60"}`}
        />
      ))}
    </div>
    {/* Preview content box */}
    <Shimmer className="h-28 w-full rounded-xl" />
  </div>
);

/* ── Main skeleton ── */

export default function AnalysisDetailSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-sans">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
          <div className="flex items-center gap-4">
            {/* Favicon */}
            <Shimmer className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              {/* Page title */}
              <Shimmer className="h-6 w-64" />
              {/* URL + copy icon */}
              <div className="flex items-center gap-2">
                <Shimmer className="h-4 w-36" />
                <Shimmer className="h-4 w-4 rounded" />
              </div>
            </div>
          </div>
          {/* Action icons: share, refresh, delete */}
          <div className="flex items-center gap-4">
            <Shimmer className="h-6 w-6 rounded" />
            <Shimmer className="h-6 w-6 rounded" />
            <Shimmer className="h-6 w-6 rounded" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
          {/* Back button */}
          <Shimmer className="h-9 w-24 rounded-xl" />

          {/* ── Score Cards ── */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ScoreCardSkeleton key={i} />
            ))}
          </div>

          {/* ── Technical Analysis ── */}
          <div className="space-y-4">
            <SectionTitle />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <TechSubCard rows={3} />
              <TechSubCard rows={3} />
              <TechSubCard rows={3} />
            </div>
          </div>

          {/* ── On-Page SEO ── */}
          <div className="space-y-4">
            <SectionTitle />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <OnPageMetaCard />
              <OnPageStatsCard />
            </div>
          </div>

          {/* ── Previews: Search Engine + Social Media ── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PreviewCard tabCount={2} />
            <PreviewCard tabCount={4} />
          </div>
        </div>
      </div>
    </>
  );
}

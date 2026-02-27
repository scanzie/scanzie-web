"use client";


const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size[200%_100%] ${className ?? ""}`}
    style={{
      animation: "shimmer 1.6s infinite linear",
    }}
  />
);

// Add this to your global CSS or a <style> tag:
// @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

const StatCardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    {/* Icon placeholder */}
    <Shimmer className="h-10 w-10 rounded-xl" />
    {/* Number */}
    <Shimmer className="mt-2 h-8 w-12" />
    {/* Label */}
    <Shimmer className="h-4 w-24" />
  </div>
);

const AnalysisCardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    {/* Top row: icon + title + score + menu */}
    <div className="flex items-center gap-3">
      <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-3 w-32" />
      </div>
      {/* Score badge */}
      <Shimmer className="h-7 w-12 rounded-full" />
      {/* Kebab menu */}
      <Shimmer className="h-5 w-5 rounded" />
    </div>
    {/* Timestamp */}
    <Shimmer className="h-3 w-24" />
  </div>
);

export default function AnalysisPageSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-sans">
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6">
          <div className="flex flex-col gap-2">
            <Shimmer className="h-7 w-48" />
            <Shimmer className="h-4 w-72" />
          </div>
          {/* "+ New" button */}
          <Shimmer className="h-10 w-24 rounded-xl" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* ── Filters Row ── */}
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {/* Search bar */}
            <Shimmer className="h-10 flex-1 rounded-xl" />
            {/* Dropdown 1 */}
            <Shimmer className="h-10 w-36 rounded-xl" />
            {/* Dropdown 2 */}
            <Shimmer className="h-10 w-28 rounded-xl" />
            {/* Sort icon */}
            <Shimmer className="h-10 w-10 rounded-xl" />
          </div>

          {/* ── Analysis Cards Grid ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <AnalysisCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

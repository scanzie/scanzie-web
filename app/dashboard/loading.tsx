"use client";

import React from "react";

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`rounded bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%] ${className ?? ""}`}
    style={{ animation: "shimmer 1.6s infinite linear" }}
  />
);

const StatCardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <Shimmer className="h-10 w-10 rounded-xl" />
    <Shimmer className="mt-2 h-8 w-12" />
    <Shimmer className="h-4 w-28" />
  </div>
);

const RecentAnalysisItemSkeleton = () => (
  <div className="flex items-center gap-3 py-3">
    {/* Site favicon */}
    <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
    <div className="flex flex-1 flex-col gap-2">
      {/* URL */}
      <Shimmer className="h-4 w-44" />
      <div className="flex items-center gap-2">
        {/* Score badge */}
        <Shimmer className="h-5 w-10 rounded-full" />
        {/* Timestamp */}
        <Shimmer className="h-3 w-24" />
      </div>
    </div>
  </div>
);

export default function DashboardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 font-sans">
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6">
          <div className="flex flex-col gap-2">
            <Shimmer className="h-7 w-36" />
            <Shimmer className="h-4 w-72" />
          </div>
          {/* "New Analysis" button */}
          <Shimmer className="h-10 w-36 rounded-xl" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* ── Bottom Row: Score Distribution + Recent Analysis ── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
            {/* Score Distribution Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <Shimmer className="h-5 w-40" />
                <Shimmer className="h-4 w-20 rounded" />
              </div>

              {/* Good bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Shimmer className="h-4 w-28" />
                  <Shimmer className="h-4 w-20" />
                </div>
                <div className="relative h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <Shimmer className="absolute inset-y-0 left-0 w-4/5 rounded-full" />
                </div>
              </div>

              {/* Moderate bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Shimmer className="h-4 w-28" />
                  <Shimmer className="h-4 w-20" />
                </div>
                <div className="relative h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <Shimmer className="absolute inset-y-0 left-0 w-2/5 rounded-full" />
                </div>
              </div>

              {/* Poor bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Shimmer className="h-4 w-28" />
                  <Shimmer className="h-4 w-20" />
                </div>
                <div className="relative h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <Shimmer className="absolute inset-y-0 left-0 w-1 rounded-full" />
                </div>
              </div>
            </div>

            {/* Recent Analysis Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-2">
              {/* Card header */}
              <div className="flex items-center justify-between pb-2">
                <Shimmer className="h-5 w-36" />
                <Shimmer className="h-6 w-6 rounded" />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* List items */}
              {Array.from({ length: 4 }).map((_, i) => (
                <React.Fragment key={i}>
                  <RecentAnalysisItemSkeleton />
                  {i < 3 && <div className="border-t border-gray-50" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

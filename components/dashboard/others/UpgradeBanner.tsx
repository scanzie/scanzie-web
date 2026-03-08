"use client";

import { useState } from "react";
import { X, RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePlan } from "@/hooks/usePlan";

export default function UpgradeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { loading, isPro, limits, usage } = usePlan();

  if (loading || isPro || !isVisible) {
    return null;
  }

  return (
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <RocketIcon className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">
                Unlock Pro Features Now
              </p>
              <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">
                Get advanced analytics, higher analysis limits, team
                collaboration, and PDF exports.
              </p>
              {usage && (
                <p className="text-blue-100 text-[11px] sm:text-xs mt-1">
                  You&apos;re currently using{" "}
                  <span className="font-semibold">
                    {usage.projects}/{limits.maxProjects}
                  </span>{" "}
                  projects and{" "}
                  <span className="font-semibold">
                    {usage.analyses}/{limits.maxAnalyses}
                  </span>{" "}
                  analyses on your current plan.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/upgrade">
              <Button
              size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-2xl text-sm"
              >
                Upgrade Now
              </Button>
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Close banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

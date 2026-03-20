"use client";

import Link from "next/link";
import { Bug } from "lucide-react";

const ReportBugFab = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50 md:bottom-7 md:right-7">
      <Link
        href="/report-a-bug"
        className="
          group inline-flex items-center gap-2 rounded-full
          bg-blue-600 px-4 py-3 text-sm font-semibold text-white
          shadow-[0_10px_28px_rgba(37,99,235,0.35)]
          transition-all duration-300
          hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_14px_36px_rgba(37,99,235,0.45)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2
        "
        aria-label="Report a bug"
      >
        <Bug className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        <span className="hidden sm:inline">Report a bug</span>
      </Link>
    </div>
  );
};

export default ReportBugFab;

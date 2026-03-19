import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, Plus, SearchX } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Back */}
        <Link
          href="/dashboard/analysis"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to analyses
        </Link>

        {/* Hero */}
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="relative inline-flex mb-7">
            <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
              <SearchX className="w-9 h-9 text-gray-300" />
            </div>
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <span className="text-red-400 text-xs font-bold leading-none">
                !
              </span>
            </span>
          </div>

          {/* Badge */}
          <div className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            404 &mdash; Not Found
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Analysis not found
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-8">
            We couldn&apos;t find the analysis you&apos;re looking for. It may
            have been deleted, or the link might be incorrect.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              Go to dashboard
            </Link>
            <Link
              href="/dashboard/analysis"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              <Search className="w-4 h-4" />
              Browse analyses
            </Link>
          </div>
        </div>

        {/* Suggestion cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Plus,
              title: "New analysis",
              description: "Run a fresh SEO scan on any URL right now.",
              href: "/dashboard/analysis/new",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-500",
            },
            {
              icon: Search,
              title: "Browse analyses",
              description: "View and manage all your previous reports.",
              href: "/dashboard/analysis",
              iconBg: "bg-gray-50",
              iconColor: "text-gray-400",
            },
            {
              icon: Home,
              title: "Dashboard",
              description: "Head back to the main overview page.",
              href: "/dashboard",
              iconBg: "bg-gray-50",
              iconColor: "text-gray-400",
            },
          ].map(
            ({ icon: Icon, title, description, href, iconBg, iconColor }) => (
              <Link
                key={href}
                href={href}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group block"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {description}
                </p>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

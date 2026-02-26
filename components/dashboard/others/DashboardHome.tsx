"use client";
import React from "react";
import {
  Search,
  Globe,
  ArrowUpRight,
  Check,
  TriangleAlert,
  InfoIcon,
  AlarmClock,
  Eye,
  NotebookTextIcon,
  LucideIcon,
} from "lucide-react";
import { SidebarTrigger } from "../../ui/sidebar";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Analysis } from "../analysis/AllUserAnalysis";
import {
  calculateAnalysisStats,
  calculateOverallScore,
  getScoreStatus,
} from "@/utils/seo-utils";
import Image from "next/image";
import { formatDate } from "@/utils/general";

interface MetricCardProps {
  title: string;
  iconColor: string;
  value: string;
  icon: LucideIcon;
}

export const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname + urlObj.pathname;
    if (hostname.length > 30) {
      return hostname.substring(0, 27) + "...";
    }
    return hostname;
  } catch {
    return url.length > 30 ? url.substring(0, 27) + "..." : url;
  }
};

const Dashboard = ({ results }: { results: Analysis[] }) => {
  // Calculate real statistics from the results
  const stats = calculateAnalysisStats(results);

  // Get recent analyses (last 4) with calculated scores
  const recentAnalyses = results
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 4)
    .map((analysis) => {
      const overallScore = calculateOverallScore(analysis);
      const status = getScoreStatus(overallScore);
      return {
        ...analysis,
        overallScore,
        status,
      };
    });

  const MetricCard = ({
    title,
    value,
    iconColor,
    icon: Icon,
  }: MetricCardProps) => (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${iconColor}-50 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${iconColor}-600`} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="w-full mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <main className="dashboard-container ">
          <header className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here&apos;s your SEO performance overview.
                </p>
              </div>
              <Link
                href="/dashboard/analysis/new"
                className="hidden md:flex items-center gap-4"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200">
                  <NotebookTextIcon className="" />
                  <span>New Analysis</span>
                </Button>
              </Link>
              <SidebarTrigger className="bg-blue-50 p-3 rounded-md md:hidden" />
            </div>
          </header>
        </main>
      </div>

      {/* Dashboard Content */}
      <main className="dashboard-container">
        <div className="p-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Analysis"
              value={stats.total.toString()}
              icon={Globe}
              iconColor="blue"
            />
            <MetricCard
              title="Good Analysis"
              value={stats.good.toString()}
              icon={Check}
              iconColor="green"
            />
            <MetricCard
              title="Moderate Analysis"
              value={stats.moderate.toString()}
              icon={TriangleAlert}
              iconColor="yellow"
            />
            <MetricCard
              title="Poor Analysis"
              value={stats.poor.toString()}
              icon={InfoIcon}
              iconColor="red"
            />
          </div>

          {/* Charts and Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Overview */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Score Distribution
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>All time</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="flex justify-center items-center min-h-4/5">
                <div className="h-64 w-full max-w-lg bg-linear-to-t from-gray-50 to-transparent rounded-lg flex items-center justify-center">
                  {stats.total > 0 ? (
                    <div className="w-full px-4">
                      <div className="space-y-4">
                        {/* Good Scores */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            Good (70-100)
                          </span>
                          <span className="text-sm text-gray-600">
                            {stats.good} analyses
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(stats.good / stats.total) * 100}%`,
                            }}
                          ></div>
                        </div>

                        {/* Moderate Scores */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-yellow-600">
                            Moderate (40-69)
                          </span>
                          <span className="text-sm text-gray-600">
                            {stats.moderate} analyses
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(stats.moderate / stats.total) * 100}%`,
                            }}
                          ></div>
                        </div>

                        {/* Poor Scores */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-600">
                            Poor (0-39)
                          </span>
                          <span className="text-sm text-gray-600">
                            {stats.poor} analyses
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(stats.poor / stats.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No analyses available yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="flex justify-between text-lg font-semibold text-gray-900 mb-6">
                Recent Analysis
                <AlarmClock className="text-gray-500" />
              </h3>
              <div className="space-y-4">
                {recentAnalyses.length > 0 ? (
                  recentAnalyses.map((analysis) => (
                    <Link
                      href={`/dashboard/analysis/${encodeURIComponent(
                        analysis.url
                      )}`}
                      key={analysis.id}
                      className="custom-hover flex gap-2 items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {analysis.on_page.favicon ? (
                        <Image
                          src={`${new URL(analysis.on_page.favicon.url)}`}
                          alt="Favicon"
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      ) : (
                        <Globe className="w-8 h-8 text-gray-700" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-gray-900 mb-1 truncate"
                          title={analysis.url}
                        >
                          {formatUrl(analysis.url)}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${analysis.status.bgClass} ${analysis.status.colorClass}`}
                          >
                            {analysis.status.percentage}%
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(analysis.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No analyses yet</p>
                    <p className="text-gray-400 text-xs">
                      Create your first analysis to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/analysis/new"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                  Run SEO Analysis
                </span>
              </Link>

              <Link
                href="/dashboard/analysis?filter=poor"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
              >
                <Eye className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                <span className="font-medium text-gray-700 group-hover:text-red-700">
                  View Poor Analysis ({stats.poor})
                </span>
              </Link>

              <Link
                href="/dashboard/analysis"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
              >
                <Check className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                <span className="font-medium text-gray-700 group-hover:text-green-700">
                  View All Analysis
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

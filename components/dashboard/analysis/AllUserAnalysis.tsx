"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import {
  Search,
  Globe,
  ChevronDown,
  NotebookTextIcon,
  Eye,
  DownloadIcon,
  RefreshCcw,
  BoxIcon,
  MoreHorizontal,
  TriangleAlert,
  InfoIcon,
  Check,
  PlusCircleIcon,
} from "lucide-react";
import { Button } from "../../ui/button";
import { SidebarTrigger } from "../../ui/sidebar";
import { Input } from "../../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  getScoreStatus,
  getScoreCategory,
  calculateAnalysisStats,
  getScoreBreakdown,
} from "../../../utils/seo-utils";
import ScoreBreakdownDialog from "../dialogs/ScoreBreakdownDialog";
import ReanalyzeDialog from "../dialogs/ReanalyzeDialog";
import {
  ContentAnalysis,
  OnPageAnalysis,
  SEOAnalysisResult,
  TechnicalAnalysis,
} from "./AnalysisDetails";
import apiClient from "@/lib/api/client";
import { formatDate } from "@/utils/general";
import { MetricCard } from "../others/DashboardHome";

export type Analysis = {
  id: string;
  userId: string;
  title: string;
  url: string;
  on_page: OnPageAnalysis;
  content: ContentAnalysis;
  technical: TechnicalAnalysis;
  createdAt: Date;
  updatedAt: Date;
};

interface AllUserAnalysisProps {
  analysis: SEOAnalysisResult[];
}

const AllUserAnalysis: React.FC<AllUserAnalysisProps> = ({ analysis }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortFilter, setSortFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [analyses] = useState<SEOAnalysisResult[]>(analysis);
  const [open, setOpen] = useState(false);
  const [reanalyzeOpen, setReanalyzeOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null,
  );
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  // These will come back from API response
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleReAnalyze = async (e: React.FormEvent, url: string) => {
    e.preventDefault();
    setCurrentUrl(url);
    try {
      const res = await apiClient.post("/analyze", { url });
      const data = await res.data;
      console.log("Analysis started:", data);

      // assume API returns sessionId + userId
      setSessionId(data.sessionId);
      setUserId(data.userId);

      // show dialog
      setReanalyzeOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredAndSortedAnalyses = useMemo(() => {
    const filtered: SEOAnalysisResult[] = analyses.filter((analysis) => {
      const matchesSearch =
        analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.url.toLowerCase().includes(searchTerm.toLowerCase());

      if (sortFilter === "all") return matchesSearch;
      return (
        matchesSearch &&
        getScoreCategory(getScoreBreakdown(analysis).overall) === sortFilter
      );
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "score":
          aValue = getScoreBreakdown(analysis[0]).overall;
          bValue = getScoreBreakdown(analysis[0]).overall;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "createdAt":
        default:
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [searchTerm, sortFilter, sortBy, sortOrder, analyses, analysis]);

  const stats = useMemo(() => {
    return calculateAnalysisStats(analyses);
  }, [analyses]);

  return (
    <div className="w-full mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <main className="dashboard-container ">
          {/* Header */}
          <div className=" bg-white p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  All your analysis
                </h1>
                <p className="text-gray-600">
                  Monitor and track your website&apos;s SEO performance
                </p>
              </div>
              <Link
                href="/dashboard/analysis/new"
                className="hidden md:flex items-center gap-4"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200">
                  <PlusCircleIcon className="" />
                  <span>New</span>
                </Button>
              </Link>
              <SidebarTrigger className="bg-blue-50 p-3 rounded-md md:hidden" />
            </div>
          </div>
        </main>
      </div>

      <main className="dashboard-container">
        {/* Stats Cards */}
        <div className="px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              key={stats.total}
              title="All Analyses"
              value={stats.total.toString()}
              icon={Globe}
              iconColor="blue"
            />
            <MetricCard
              key={stats.good}
              title="Good (70+)"
              value={stats.good.toString()}
              icon={Check}
              iconColor="green"
            />
            <MetricCard
              key={stats.moderate}
              title="Moderate (40-69)"
              value={stats.moderate.toString()}
              icon={TriangleAlert}
              iconColor="yellow"
            />
            <MetricCard
              key={stats.poor}
              title="Poor (0-39)"
              value={stats.poor.toString()}
              icon={InfoIcon}
              iconColor="red"
            />
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by title or URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                />
              </div>
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white/80 border border-gray-200 rounded-xl  pr-10 flex items-center gap-2 min-w-40 justify-between"
                    >
                      {sortFilter === "all" ?
                        "All Results"
                      : sortFilter === "good" ?
                        "Good (70+)"
                      : sortFilter === "moderate" ?
                        "Moderate (40-69)"
                      : "Poor (0-39)"}
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-40">
                    <DropdownMenuItem onClick={() => setSortFilter("all")}>
                      All Results
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortFilter("good")}>
                      Good (70+)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortFilter("moderate")}>
                      Moderate (40-69)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortFilter("poor")}>
                      Poor (0-39)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white/80 border border-gray-200 rounded-xl pr-10 flex items-center gap-2 min-w-[120px] justify-between"
                    >
                      {sortBy === "createdAt" ?
                        "Date"
                      : sortBy === "score" ?
                        "Score"
                      : "Title"}
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[120px]">
                    <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                      Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("score")}>
                      Score
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("title")}>
                      Title
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="bg-white/80 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Cards */}
          <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredAndSortedAnalyses.map((analysis) => {
              const scoreStatus = getScoreStatus(
                getScoreBreakdown(analysis).overall,
              );

              return (
                <div
                  key={analysis.id}
                  className="relative bg-white rounded-xl border hover:border-gray-400 overflow-hidden"
                >
                  <Link
                    href={`/dashboard/analysis/${encodeURIComponent(analysis.url)}`}
                    className="absolute inset-0 hover:shadow-lg transition-all duration-300 h-full"
                  ></Link>
                  <div className="p-4 grid gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {analysis.on_page.favicon ?
                            <Image
                              src={`${new URL(analysis.on_page.favicon.url)}`}
                              alt="Favicon"
                              width={32}
                              height={32}
                              className="w-10 h-10"
                            />
                          : <Globe className="w-10 h-10 text-gray-700" />}
                          <div className="grid items-center">
                            <h3 className="md:text-lg font-bold text-gray-900">
                              {analysis?.on_page?.title?.text?.length > 20 ?
                                `${analysis?.on_page?.title?.text.substring(0, 20)}...`
                              : analysis?.on_page?.title?.text || "Untitled"}
                            </h3>
                            <p className="text-gray-600 text-xs md:text-sm break-all">
                              {analysis.url.length > 25 ?
                                `${analysis.url.substring(0, 25)}...`
                              : analysis.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-gray-500">
                          {formatDate(analysis.updatedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-xs sm:text-sm px-2 py-1 rounded-full ${scoreStatus.bgClass} ${scoreStatus.colorClass}`}
                        >
                          {getScoreBreakdown(analysis).overall}%
                        </div>
                        {/* Action Buttons */}
                        <div className="z-20 border-gray-200 pointer-events-auto">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="rounded-full h-8 w-8  p-0"
                                >
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click from bubbling to Link
                                    handleReAnalyze(e, analysis.url);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <RefreshCcw />
                                    <span>Re-analyze</span>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click from bubbling to Link
                                    toast("Export feature coming soon 😄");
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <DownloadIcon />
                                    <span>Export report</span>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click from bubbling to Link
                                    setSelectedAnalysis(analysis);
                                    setOpen(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <Eye />
                                    <span>Score breakdown</span>
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {analyses.length > 0 && filteredAndSortedAnalyses.length === 0 && (
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-white/50 shadow-lg">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No analyses found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters
                </p>
              </div>
            </div>
          )}
          {analyses.length === 0 && filteredAndSortedAnalyses.length === 0 && (
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-white/50 shadow-lg">
                <BoxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You don&apos;t have any analysis yet
                </h3>
                <p className="text-gray-600">Create your first analysis</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <ScoreBreakdownDialog
        open={open}
        onOpenChange={setOpen}
        analysis={selectedAnalysis}
      />
      <ReanalyzeDialog
        open={reanalyzeOpen}
        onOpenChange={setReanalyzeOpen}
        sessionId={sessionId}
        userId={userId}
        url={currentUrl}
      />
    </div>
  );
};

export default AllUserAnalysis;

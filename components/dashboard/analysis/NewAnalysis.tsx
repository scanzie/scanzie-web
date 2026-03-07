"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AnalysisProgress from "@/components/dashboard/analysis/AnalysisProgress";
import {
  Loader2Icon,
  XIcon,
  Search,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { usePlan } from "@/hooks/usePlan";

const FEATURE_PILLS = [
  { icon: ShieldCheck, label: "Technical SEO" },
  { icon: Zap, label: "Page Speed" },
  { icon: BarChart2, label: "On-Page Score" },
];

const NewAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { loading: planLoading, limits, usage, isFreePlan } = usePlan();

  const analysesUsed = usage?.analyses ?? 0;
  const analysesLimit = limits.maxAnalyses;
  const hasReachedAnalysisLimit =
    !planLoading && usage != null && analysesUsed >= analysesLimit;

  const scanProofUrl = (url: string) => {
    try {
      if (url.indexOf(" ") >= 0) return false;
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const startAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasReachedAnalysisLimit) {
      toast(
        `You have reached your maximum of ${analysesLimit} unique analyses on the ${isFreePlan ? "Free" : "current"
        } plan. Please upgrade to create more analyses.`,
      );
      return;
    }

    setLoading(true);

    if (!scanProofUrl(url)) {
      toast("⚠️ Please enter a valid URL");
      setLoading(false);
      return;
    }

    try {
      setOpen(true);
      const res = await apiClient.post("/analyze", { url });
      const data = await res.data;
      setSessionId(data.sessionId);
      setUserId(data.userId);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8">
        {/* ── Hero card ── */}
        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          {/* Blue accent bar */}

          <div className="p-8 space-y-6">
            {/* Icon badge + heading */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-gray-200">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Analyze your website&apos;s SEO
                </h2>
                <p className="text-sm text-gray-400">
                  Paste any URL and get a full SEO audit in seconds 😄
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {FEATURE_PILLS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </div>

            {/* URL form */}
            <form onSubmit={startAnalysis} className="space-y-3">
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-11 rounded-2xl border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-100 transition"
                />
              </div>

              <Button
                type="submit"
                disabled={
                  loading || !url.trim() || hasReachedAnalysisLimit
                }
                className="w-full h-11 rounded-2xl text-white "
              >
                {loading ?
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing…
                  </>
                : <>
                    Start Analysis
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                }
              </Button>
            </form>

            {hasReachedAnalysisLimit && (
              <p className="text-xs text-red-600 mt-2 text-center">
                You&apos;ve used {analysesUsed}/{analysesLimit} unique analyses on
                your current plan.{" "}
                <Link
                  href="/upgrade"
                  className="underline font-medium text-red-700"
                >
                  Upgrade to Pro
                </Link>{" "}
                to analyze more URLs.
              </p>
            )}
          </div>
        </div>

        {/* ── Subtle hint ── */}
        <p className="text-center text-xs text-gray-400">
          Helpful Analysis Tips. &copy; 2026 Scanzie Inc. 
        </p>
      </div>

      {/* ── Alert Dialog — styles untouched ── */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <span>SEO Analysis Progress</span>
              <XIcon
                onClick={() => setOpen(false)}
                className="h-9 w-9 p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
              />
            </AlertDialogTitle>
          </AlertDialogHeader>

          {sessionId && userId ?
            <AnalysisProgress sessionId={sessionId} userId={userId} url={url} />
          : <div className="flex flex-col items-center justify-center p-8">
              <Loader2Icon className="animate-spin h-32 w-32 text-blue-500 mt-4" />
              <p className="text-center text-gray-500 p-6">
                Preparing analysis…
              </p>
            </div>
          }
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewAnalysis;

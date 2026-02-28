"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Sparkles } from "lucide-react";
import DashboardHome from "@/components/dashboard/others/DashboardHome";
import { fetchRecentAnalysis } from "@/lib/actions/analysis";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DashboardSkeleton from "./loading";
import { Suspense } from "react";

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const results = await fetchRecentAnalysis();
        setData(results);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    // Check if user just successfully subscribed
    const successParam = searchParams.get("successfully-subscribed");
    if (successParam === "true") {
      setShowWelcomeDialog(true);
      // Remove the query param from URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [searchParams]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <DashboardHome results={data as any} />

      {/* Welcome to Pro Dialog */}
      <AlertDialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <AlertDialogContent className="bg-white border border-gray-200">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-center text-gray-900">
              Welcome to Scanzie Pro
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription className="space-y-4 text-center">
            <p className="text-gray-700 font-medium">
              Your premium subscription is now active! 🎉
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Advanced SEO Analysis
                  </p>
                  <p className="text-gray-600 text-xs">
                    Deep insights with more metrics and screenshots
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Unlimited Projects & Analyses
                  </p>
                  <p className="text-gray-600 text-xs">
                    Create as many projects and 100+ unique analyses
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Team Collaboration
                  </p>
                  <p className="text-gray-600 text-xs">
                    Invite up to 10 team members to your projects
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    PDF Reports
                  </p>
                  <p className="text-gray-600 text-xs">
                    Download beautiful, formatted PDF analysis reports
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm pt-2">
              Start exploring your enhanced dashboard and unlock the full
              potential of Scanzie Pro!
            </p>
          </AlertDialogDescription>

          <AlertDialogFooter>
            <Button
              onClick={() => setShowWelcomeDialog(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

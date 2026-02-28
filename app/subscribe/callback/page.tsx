"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { getSubscriptionStatus } from "@/lib/actions/subscription";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export default function SubscribeCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [state, setState] = useState<
    "processing" | "success" | "error" | "polling"
  >("processing");
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const maxPolls = 12; // 12 polls x 2.5 seconds = 30 seconds

  useEffect(() => {
    if (!reference) {
      setError("No reference provided");
      setState("error");
      return;
    }

    const checkSubscriptionStatus = async () => {
      try {
        // Get current user
        const { data: session } = await authClient.getSession();

        if (!session?.user?.email) {
          throw new Error("User not authenticated");
        }

        // Check subscription status
        const subData = await getSubscriptionStatus(session.user.id);

        if (subData?.status === "active") {
          setState("success");
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          // Keep polling if not active yet
          if (pollCount < maxPolls) {
            setState("polling");
            setPollCount(pollCount + 1);
            // Wait 2.5 seconds before next poll
            setTimeout(() => {
              checkSubscriptionStatus();
            }, 2500);
          } else {
            // Max polls reached
            setError(
              "Subscription activation timeout. Please refresh or contact support.",
            );
            setState("error");
          }
        }
      } catch (err) {
        console.error("Subscription check error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to verify subscription",
        );
        setState("error");
      }
    };

    // Start checking after a short delay to allow webhook processing
    const timer = setTimeout(() => {
      checkSubscriptionStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, [reference, router, pollCount]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {state === "processing" && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Processing
            </h1>
            <p className="text-gray-600 text-center">
              Setting up your Pro subscription…
            </p>
            <div className="mt-2 space-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Verifying payment
              </p>
            </div>
          </div>
        )}

        {state === "polling" && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Almost there
            </h1>
            <p className="text-gray-600 text-center">
              Activating your Pro plan…
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(pollCount / maxPolls) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {((pollCount / maxPolls) * 100).toFixed(0)}%
            </p>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Success!
            </h1>
            <p className="text-gray-600 text-center">
              Your Pro subscription is now active. Enjoy all premium features!
            </p>
            <div className="mt-4 space-y-2 w-full">
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Advanced SEO analysis enabled</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Unlimited projects and analyses</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Team collaboration unlocked</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              Redirecting to your dashboard…
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Something went wrong
            </h1>
            <p className="text-gray-600 text-center">{error}</p>
            <div className="mt-6 space-y-3 w-full">
              <Button
                onClick={() => (window.location.href = "/dashboard/settings")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Go to Settings
              </Button>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              If the problem persists, please contact our{" "}
              <a
                href="mailto:support@scanzie.com"
                className="text-blue-600 hover:underline"
              >
                support team
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

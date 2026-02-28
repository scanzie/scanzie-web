"use client";

import { useState, useEffect } from "react";
import { X, RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSubscriptionStatus } from "@/lib/actions/subscription";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";

export default function UpgradeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        const subData = await getSubscriptionStatus(session.user.id);

        if (subData?.status === "active") {
          setIsPro(true);
        } else {
          setIsPro(false);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setIsVisible(true); // Show banner on error as fallback
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

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
                Get advanced analytics, unlimited analyses, team collaboration,
                and PDF exports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard/settings">
              <Button
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
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

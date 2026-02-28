"use client";

import { useState } from "react";
import { User } from "better-auth";
import { Button } from "../../ui/button";
import { Check, Zap } from "lucide-react";

interface PlanCardProps {
  user: User | undefined;
  currentPlan?: string;
}

export default function PlanCard({
  user,
  currentPlan = "free",
}: PlanCardProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          plan: "monthly",
        }),
      });

      const data = await res.json();
      console.log("Subscription response:", data);

      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        console.error("No authorization URL received");
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPro = currentPlan?.toLowerCase() === "pro";

  const proFeatures = [
    "Advanced SEO analysis",
    "Up to 10 projects",
    "Up to 100 analyses",
    "Team collaboration",
    "PDF exports",
  ];

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Subscription Plan
      </h3>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-2xl font-bold text-gray-900">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </h4>
                {isPro && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                {isPro ?
                  "You have access to all professional features"
                : "Upgrade to Pro for advanced features"}
              </p>
            </div>

            {isPro && <Zap className="w-6 h-6 text-yellow-500" />}
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-2">Current Plan Price</p>
            <div className="text-3xl font-bold text-gray-900">
              {isPro ? "$12" : "$0"}
              <span className="text-lg text-gray-600 font-normal">/month</span>
            </div>
          </div>

          {!isPro && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Unlock Pro features</strong> and get advanced SEO
                analysis, multiple projects, team collaboration, and more!
              </p>
            </div>
          )}

          {isPro && (
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold text-gray-900">
                Your benefits:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {proFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isPro && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  FREE INCLUDES
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />3 analyses
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />1 project
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    Base analysis
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-600 mb-2">
                  PRO INCLUDES
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-blue-500" />
                    100 analyses
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-blue-500" />
                    10 projects
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-blue-500" />
                    Advanced +
                  </li>
                </ul>
              </div>
            </div>
          )}

          <Button
            onClick={handleUpgrade}
            disabled={isPro || loading}
            className={`w-full ${
              isPro ?
                "bg-gray-100 text-gray-600 hover:bg-gray-100 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isPro ?
              "Your active plan"
            : loading ?
              "Processing..."
            : "Upgrade to Pro"}
          </Button>
        </div>
      </div>

      {isPro && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Billing is managed through our payment processor. You can manage
            your subscription or update your billing information there.
          </p>
        </div>
      )}
    </div>
  );
}

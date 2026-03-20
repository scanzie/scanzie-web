"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { BillingToggle } from "../ui/BillingToggle";

interface PricingProps {
  isAuthenticated?: boolean;
  userEmail?: string;
  userPlan?: string;
}

export default function Pricing({
  isAuthenticated,
  userEmail,
  userPlan = "free",
}: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<{
    proMonthly: boolean;
    proYearly: boolean;
    businessMonthly: boolean;
    businessYearly: boolean;
  }>({
    proMonthly: false,
    proYearly: false,
    businessMonthly: false,
    businessYearly: false,
  });

  const handleSubscribe = async (
    targetPlan: "pro" | "business",
    period: "monthly" | "yearly",
  ) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    const key =
      `${targetPlan}${period === "monthly" ? "Monthly" : "Yearly"}` as keyof typeof loading;
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          plan: targetPlan,
          period,
        }),
      });

      const data = await res.json();

      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        console.error("No authorization URL received");
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const freePlanFeatures = [
    "Base-line SEO analysis",
    "Access to one folder/projects",
    "Can create up to 3 analyses.",
    "Can re-analyze URLS.",
  ];

  const proPlanFeatures = [
    "Everything in Free",
    "Suggested fixes for Technical, Content & On-Page analysis",
    "Page screenshots/snapshots from URL",
    "Up to 10 folders/projects",
    "Up to 100 unique analyses",
    "Invite up to 10 people per project",
    "Mini-window for page navigation",
    "Download analysis as PDF",
  ];

  const businessPlanFeatures = [
    "Everything in Pro",
    "Image content analysis: performance, size & suggestions",
    "Per-image feedback (too large, blurry, missing alt, etc.)",
    "Up to 50 projects",
    "Up to 500 unique analyses",
    "Invite up to 50 people per project",
  ];

  const planNorm = (userPlan ?? "").toLowerCase();
  const isPro = planNorm === "pro";
  const isBusiness = planNorm === "business";

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your SEO analysis needs
          </p>

          <div className="flex justify-center">
            <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Free Plan
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                No credit card required
              </p>

              <div className="mb-6 lg:mb-8 h-16">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900">
                  $0
                  <span className="text-lg lg:text-xl text-gray-600 font-normal">
                    /mo
                  </span>
                </div>
              </div>

              {isAuthenticated && (
                <Button
                  disabled={planNorm === "free"}
                  className={`w-full mb-6 lg:mb-8 ${planNorm === "free" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"}`}
                  variant={planNorm === "free" ? "secondary" : "outline"}
                >
                  {isAuthenticated
                    ? planNorm === "free"
                      ? "Current Plan"
                      : "Downgrade to Free"
                    : "Sign up to get started"}
                </Button>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Includes:
                </p>
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg border-2 border-blue-500 overflow-hidden hover:shadow-lg transition-shadow relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
              Most Popular
            </div>

            <div className="p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Pro Plan
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {isYearly ? "Billed annually" : "Billed monthly"}
              </p>

              <div className="mb-6 lg:mb-8 h-16">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900">
                  ${isYearly ? "9.60" : "12"}
                  <span className="text-lg lg:text-xl text-gray-600 font-normal">
                    /mo
                  </span>
                </div>
                {isYearly && (
                  <div className="text-xs text-gray-500 mt-1">
                    $115.20 billed yearly
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <Button
                  onClick={() =>
                    handleSubscribe("pro", isYearly ? "yearly" : "monthly")
                  }
                  disabled={loading.proMonthly || loading.proYearly || isPro}
                  className={`w-full mb-6 lg:mb-8 ${isPro ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  variant={isPro ? "secondary" : "default"}
                >
                  {loading.proMonthly || loading.proYearly
                    ? "Processing..."
                    : isPro
                      ? "Current Plan"
                      : "Upgrade to Pro"}
                </Button>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Includes:
                </p>
                {proPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-lg border-2 border-gray-900 overflow-hidden hover:shadow-lg transition-shadow relative">
            <div className="absolute top-0 right-0 bg-gray-900 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
              Best Value
            </div>
            <div className="p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Business Plan
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {isYearly ? "Billed annually" : "Billed monthly"}
              </p>

              <div className="mb-6 lg:mb-8 h-16">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900">
                  ${isYearly ? "60" : "75"}
                  <span className="text-lg lg:text-xl text-gray-600 font-normal">
                    /mo
                  </span>
                </div>
                {isYearly && (
                  <div className="text-xs text-gray-500 mt-1">
                    $720 billed yearly
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <Button
                  onClick={() =>
                    handleSubscribe("business", isYearly ? "yearly" : "monthly")
                  }
                  disabled={
                    loading.businessMonthly ||
                    loading.businessYearly ||
                    isBusiness
                  }
                  className={`w-full mb-6 lg:mb-8 ${
                    isBusiness
                      ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      : "bg-gray-800 hover:bg-gray-900 text-white"
                  }`}
                  variant={isBusiness ? "secondary" : "default"}
                >
                  {loading.businessMonthly || loading.businessYearly
                    ? "Processing..."
                    : isBusiness
                      ? "Current Plan"
                      : "Upgrade to Business"}
                </Button>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Includes:
                </p>
                {businessPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-gray-700 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Have questions?{" "}
            <a
              href="mailto:support@scanzie.com"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

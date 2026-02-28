"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface PricingProps {
  isAuthenticated?: boolean;
  userEmail?: string;
}

export default function Pricing({ isAuthenticated, userEmail }: PricingProps) {
  const [loading, setLoading] = useState<{
    monthly: boolean;
    yearly: boolean;
  }>({
    monthly: false,
    yearly: false,
  });

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    if (!isAuthenticated) {
      // Redirect to signin if not authenticated
      window.location.href = "/login";
      return;
    }

    setLoading((prev) => ({ ...prev, [plan]: true }));
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          plan,
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
      setLoading((prev) => ({ ...prev, [plan]: false }));
    }
  };

  const freePlanFeatures = [
    "Base-line SEO analysis",
    "Access to one folder/projects",
    "Can create up to 3 analyses",
    "Can re-analyze URLs",
  ];

  const proPlanFeatures = [
    "Advanced SEO analysis (more metrics, screenshots, etc.)",
    "Can create up to 10 folders/projects",
    "Can create up to 100 unique analyses",
    "Can invite up to 10 people in a project",
    "Mini-window for page navigation",
    "Download analysis result in well formatted PDF",
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your SEO analysis needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Free Plan
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                No credit card required
              </p>

              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900">
                  $0
                  <span className="text-xl text-gray-600 font-normal">/mo</span>
                </div>
              </div>

              <Button
                disabled={!isAuthenticated}
                className="w-full mb-8 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                variant="outline"
              >
                {isAuthenticated ? "Current Plan" : "Sign up to get started"}
              </Button>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Includes:
                </p>
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg border-2 border-blue-500 overflow-hidden hover:shadow-lg transition-shadow relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
              Most Popular
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Pro Plan
              </h3>
              <p className="text-gray-600 text-sm mb-6">Billed monthly</p>

              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900">
                  $12
                  <span className="text-xl text-gray-600 font-normal">/mo</span>
                </div>
              </div>

              <Button
                onClick={() => handleSubscribe("monthly")}
                disabled={!isAuthenticated || loading.monthly}
                className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading.monthly ? "Processing..." : "Upgrade to Pro"}
              </Button>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Includes:
                </p>
                {proPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
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

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { BillingToggle } from "../ui/BillingToggle";
import {
  businessPlanFeatures,
  freePlanFeatures,
  proPlanFeatures,
} from "@/lib/constants/plans";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 24 });
      gsap.set(cardsRef.current, { opacity: 0, y: 48, scale: 0.975 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 74%",
        once: true,
        onEnter: () => {
          gsap.to(headerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          });

          gsap.to(cardsRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.08,
          });

          gsap.to(ctaRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            delay: 0.22,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

  const planNorm = (userPlan ?? "").toLowerCase();
  const isPro = planNorm === "pro";
  const isBusiness = planNorm === "business";

  return (
    <section
      ref={sectionRef}
      className="mb-10 bg-gray-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Choose the perfect plan for your SEO analysis needs
          </p>

          <div className="flex justify-center">
            <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3 lg:gap-8">
          <div
            ref={(node) => {
              cardsRef.current[0] = node;
            }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          >
            <div className="p-6 lg:p-8">
              <h3 className="mb-2 text-xl font-bold text-gray-900 lg:text-2xl">
                Free Plan
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                No credit card required
              </p>

              <div className="mb-6 h-16 lg:mb-8">
                <div className="text-4xl font-bold text-gray-900 lg:text-5xl">
                  $0
                  <span className="text-lg font-normal text-gray-600 lg:text-xl">
                    /mo
                  </span>
                </div>
              </div>

              {isAuthenticated && (
                <Button
                  disabled={planNorm === "free"}
                  className={`mb-6 w-full lg:mb-8 ${planNorm === "free" ? "bg-gray-100 text-gray-900" : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"}`}
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
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Includes:
                </p>
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={(node) => {
              cardsRef.current[1] = node;
            }}
            className="relative overflow-hidden rounded-lg border-2 border-blue-500 bg-white transition-shadow hover:shadow-lg"
          >
            <div className="absolute top-0 right-0 rounded-bl-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
              Most Popular
            </div>

            <div className="p-6 lg:p-8">
              <h3 className="mb-2 text-xl font-bold text-gray-900 lg:text-2xl">
                Pro Plan
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                {isYearly ? "Billed yearly" : "Billed monthly"}
              </p>

              <div className="mb-6 h-16 lg:mb-8">
                <div className="text-4xl font-bold text-gray-900 lg:text-5xl">
                  ${isYearly ? "4" : "5"}
                  <span className="text-lg font-normal text-gray-600 lg:text-xl">
                    /mo
                  </span>
                </div>
                {isYearly && (
                  <div className="mt-1 text-xs text-gray-500">
                    $48 billed yearly
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <Button
                  onClick={() =>
                    handleSubscribe("pro", isYearly ? "yearly" : "monthly")
                  }
                  disabled={loading.proMonthly || loading.proYearly || isPro}
                  className={`mb-6 w-full lg:mb-8 ${isPro ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}
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
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Includes:
                </p>
                {proPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={(node) => {
              cardsRef.current[2] = node;
            }}
            className="relative overflow-hidden rounded-lg border-2 border-gray-900 bg-white transition-shadow hover:shadow-lg"
          >
            <div className="absolute top-0 right-0 rounded-bl-lg bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              Best Value
            </div>
            <div className="p-6 lg:p-8">
              <h3 className="mb-2 text-xl font-bold text-gray-900 lg:text-2xl">
                Business Plan
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                {isYearly ? "Billed yearly" : "Billed monthly"}
              </p>

              <div className="mb-6 h-16 lg:mb-8">
                <div className="text-4xl font-bold text-gray-900 lg:text-5xl">
                  ${isYearly ? "12" : "15"}
                  <span className="text-lg font-normal text-gray-600 lg:text-xl">
                    /mo
                  </span>
                </div>
                {isYearly && (
                  <div className="mt-1 text-xs text-gray-500">
                    $144 billed yearly
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
                  className={`mb-6 w-full lg:mb-8 ${
                    isBusiness
                      ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      : "bg-gray-800 text-white hover:bg-gray-900"
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
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Includes:
                </p>
                {businessPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-700" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={ctaRef} className="mt-12 text-center">
          <p className="text-gray-600">
            Have questions?{" "}
            <a
              href="/support"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

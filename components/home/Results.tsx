"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, ScanSearch, Users } from "lucide-react";
import type { HomeStats } from "@/lib/actions/home";
import { formatMetric } from "@/utils/general";

gsap.registerPlugin(ScrollTrigger);

type ResultsProps = {
  stats: HomeStats;
};

export default function Results({ stats }: ResultsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(introRef.current, { opacity: 0, y: 28 });
      gsap.set(cardsRef.current, { opacity: 0, y: 36, scale: 0.97 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(introRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          });

          gsap.to(cardsRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.08,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const metricCards = [
    {
      label: "Users trusting Scanzie",
      value: formatMetric(stats.totalUsers),
      description:
        "Teams and site owners use Scanzie to spot issues early and act faster.",
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      label: "Analyses created",
      value: formatMetric(stats.totalAnalyses),
      description:
        "Fresh reports keep performance, technical SEO, and on-page quality visible.",
      icon: <ScanSearch className="h-6 w-6 text-blue-600" />,
    },
    {
      label: "Reason teams stay",
      value: "Actionable",
      description:
        "Clear scoring and recommended fixes turn audits into work your team can finish.",
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden mb-10 py-10">
      <div className="app-container relative">
        <div className="overflow-hidden rounded-4xl border border-slate-200/80 bg-white shadow-[0_5px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-10 px-6 py-8 sm:px-8 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:px-12 lg:py-12">
            <div ref={introRef} className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Proven momentum
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                The results already speak for Scanzie.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                People trust Scanzie because it turns scattered SEO checks into
                one clear picture. The more reports teams create, the faster
                they catch issues, fix weak pages, and improve visibility.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Why it converts
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Fast audits, clear scoring, and next-step recommendations.
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                  <p className="text-sm font-medium text-blue-700">
                    What users get
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    A cleaner path from analysis to measurable SEO improvement.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {metricCards.map((card, index) => (
                <div
                  key={card.label}
                  ref={(node) => {
                    cardsRef.current[index] = node;
                  }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="rounded-2xl bg-slate-50 p-3 shadow-sm ring-1 ring-slate-200">
                      {card.icon}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Live
                    </span>
                  </div>
                  <p className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {card.label}
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

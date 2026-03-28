"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  Zap,
  Target,
  Shield,
  Globe,
  BotIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 26 });
      gsap.set(cardsRef.current, { opacity: 0, y: 42, rotateX: -8 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 76%",
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
            rotateX: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.08,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features: Feature[] = [
    {
      id: 1,
      title: "Meta Tag Scanner",
      description:
        "Comprehensive analysis of title tags, meta descriptions, and structured data to ensure optimal search engine visibility.",
      icon: <Search className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 2,
      title: "Performance Scanner",
      description:
        "Real-time monitoring of page speed, Core Web Vitals, and loading performance across desktop and mobile devices.",
      icon: <Zap className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 3,
      title: "Keyword Analysis",
      description:
        "Deep keyword research and density analysis to optimize your content for target search terms and improve rankings.",
      icon: <Target className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 4,
      title: "Technical SEO Audit",
      description:
        "Identify crawl errors, broken links, duplicate content, and other technical issues that impact search visibility.",
      icon: <Shield className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 5,
      title: "Suggested Fixes",
      description:
        "Get suggested fixes & recommendations tailored to your analysis result. Also AI-powered summary (coming soon).",
      icon: <BotIcon className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 6,
      title: "Site Architecture Analysis",
      description:
        "Evaluate URL structure, internal linking, sitemap optimization, and overall site hierarchy for better crawlability.",
      icon: <Globe className="w-8 h-8 text-blue-500" />,
    },
  ];

  return (
    <section ref={sectionRef} className="py-10 mb-10">
      <div className="app-container">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful SEO features
            <br />
            built for results.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Everything you need to optimize your website&apos;s search
            performance and dominate search engine rankings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(node) => {
                cardsRef.current[index] = node;
              }}
              className="group rounded-2xl border border-gray-200 p-8 transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="rounded-xl bg-blue-50 p-3 transition-colors duration-300 group-hover:bg-blue-100">
                  {feature.icon}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

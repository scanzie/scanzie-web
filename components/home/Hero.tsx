"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import SeoProgressCard from "./SeoProgressCard";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(
        [
          titleRef.current,
          subtitleRef.current,
          buttonsRef.current,
          cardsWrapRef.current,
        ],
        {
          opacity: 0,
          y: 44,
        },
      );

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.95,
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
          },
          "-=0.5",
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
          },
          "-=0.35",
        )
        .to(
          cardsWrapRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.25",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="custom-hero-background relative overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_45%)]" />

      <div className="relative z-10 flex min-h-[90vh] flex-col place-content-center gap-6 px-5 py-20 text-center sm:px-8 md:px-12">
        <h2
          ref={titleRef}
          className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
        >
          Analyze your website <br /> SEO and performance.
        </h2>

        <p
          ref={subtitleRef}
          className="mx-auto max-w-3xl text-base text-slate-700 sm:text-lg md:text-xl"
        >
          Boost your site&apos;s ranking and speed with our powerful analytics
          tools.
        </p>

        <div
          ref={buttonsRef}
          className="my-2 flex flex-wrap justify-center gap-4 sm:my-3"
        >
          <Link href="/login">
            <Button className="px-8 py-6 text-lg font-semibold transition duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg sm:px-10 sm:py-7 sm:text-xl">
              <span>Get Started now</span>
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>

        <div
          ref={cardsWrapRef}
          className="mx-auto mt-2 grid w-full max-w-7xl grid-cols-1 items-stretch gap-5 pb-8 sm:gap-6 md:grid-cols-3"
        >
          <div className="md:translate-y-4">
            <SeoProgressCard
              title="SEO Analysis Started"
              subtitle="Kickoff phase is running"
              url="https://my-site.com"
              progress={0}
              animateOnMount
              showCloseButton={false}
              stages={[
                { label: "On Page", status: "pending", progress: 0 },
                { label: "Content", status: "pending", progress: 0 },
                { label: "Technical", status: "pending", progress: 0 },
              ]}
              className="h-full border-blue-300"
            />
          </div>

          <div className="md:-translate-y-2">
            <SeoProgressCard
              title="SEO Mid Progress"
              subtitle="Analysis is actively processing"
              url="https://my-site.com"
              progress={58}
              animateOnMount
              showCloseButton={false}
              stages={[
                { label: "On Page", status: "done", progress: 100 },
                { label: "Content", status: "in-progress", progress: 62 },
                { label: "Technical", status: "in-progress", progress: 18 },
              ]}
              className="h-full border-blue-500 shadow-[0_14px_48px_rgba(59,130,246,0.24)]"
            />
          </div>

          <div className="md:translate-y-4">
            <SeoProgressCard
              title="SEO Analysis Complete"
              subtitle="All checks completed successfully"
              url="https://my-site.com"
              progress={100}
              animateOnMount
              showCloseButton={false}
              stages={[
                { label: "On Page", status: "done", progress: 100 },
                { label: "Content", status: "done", progress: 100 },
                { label: "Technical", status: "done", progress: 100 },
              ]}
              className="h-full border-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

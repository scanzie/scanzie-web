"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import SeoProgressCard from "./SeoProgressCard";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const cardsDesktopRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  const mobileStackRef = useRef<HTMLDivElement>(null);
  const mobileCard0Ref = useRef<HTMLDivElement>(null);
  const mobileCard1Ref = useRef<HTMLDivElement>(null);
  const mobileCard2Ref = useRef<HTMLDivElement>(null);

  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial hero text/button animation (cards are intentionally excluded)
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 0,
        y: 44,
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(titleRef.current, {
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
        );

      // Desktop/tablet cards: animate only when scrolled into view
      const desktopCards = [
        card0Ref.current,
        card1Ref.current,
        card2Ref.current,
      ];
      gsap.set(desktopCards, { opacity: 0, y: 36, scale: 0.985 });

      ScrollTrigger.create({
        trigger: cardsSectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          setCardsVisible(true);
          gsap.to(desktopCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.14,
            ease: "power3.out",
          });
        },
      });

      // Mobile sticky stacking/parallax effect
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        const m0 = mobileCard0Ref.current;
        const m1 = mobileCard1Ref.current;
        const m2 = mobileCard2Ref.current;

        gsap.set([m0, m1, m2], {
          transformOrigin: "50% 0%",
          willChange: "transform",
        });
        gsap.set(m0, { zIndex: 10 });
        gsap.set(m1, { zIndex: 20, yPercent: 96 });
        gsap.set(m2, { zIndex: 30, yPercent: 192 });

        ScrollTrigger.create({
          trigger: mobileStackRef.current,
          start: "top top+=72",
          end: "+=220%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => setCardsVisible(true),
          onEnterBack: () => setCardsVisible(true),
          animation: gsap
            .timeline()
            // Card 2 glides up over card 1
            .to(
              m1,
              {
                yPercent: 0,
                duration: 1,
                ease: "none",
              },
              0,
            )
            // Card 3 glides up over card 1 and card 2
            .to(
              m2,
              {
                yPercent: 0,
                duration: 1,
                ease: "none",
              },
              1,
            ),
        });
      });

      return () => mm.revert();
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
          ref={cardsSectionRef}
          className="mx-auto mt-2 w-full max-w-7xl pb-8"
        >
          {/* Desktop / Tablet layout */}
          <div
            ref={cardsDesktopRef}
            className="hidden w-full grid-cols-1 items-stretch gap-5 sm:gap-6 md:grid md:grid-cols-3"
          >
            <div ref={card0Ref} className="md:translate-y-4">
              <SeoProgressCard
                title="SEO Analysis Started"
                subtitle="Kickoff phase is running"
                url="https://my-site.com"
                progress={0}
                animateOnMount={cardsVisible}
                showCloseButton={false}
                stages={[
                  { label: "On Page", status: "pending", progress: 0 },
                  { label: "Content", status: "pending", progress: 0 },
                  { label: "Technical", status: "pending", progress: 0 },
                ]}
                className="h-full border-blue-300"
              />
            </div>

            <div ref={card1Ref} className="md:-translate-y-2">
              <SeoProgressCard
                title="SEO Mid Progress"
                subtitle="Analysis is actively processing"
                url="https://my-site.com"
                progress={58}
                animateOnMount={cardsVisible}
                showCloseButton={false}
                stages={[
                  { label: "On Page", status: "done", progress: 100 },
                  { label: "Content", status: "in-progress", progress: 62 },
                  { label: "Technical", status: "in-progress", progress: 18 },
                ]}
                className="h-full border-blue-500 shadow-[0_14px_48px_rgba(59,130,246,0.24)]"
              />
            </div>

            <div ref={card2Ref} className="md:translate-y-4">
              <SeoProgressCard
                title="SEO Analysis Complete"
                subtitle="All checks completed successfully"
                url="https://my-site.com"
                progress={100}
                animateOnMount={cardsVisible}
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

          {/* Mobile sticky stacking parallax */}
          <div className="md:hidden">
            <div
              ref={mobileStackRef}
              className="relative mx-auto h-[650px] max-w-sm overflow-visible"
            >
              <div ref={mobileCard0Ref} className="absolute inset-x-0 top-0">
                <SeoProgressCard
                  title="SEO Analysis Started"
                  subtitle="Kickoff phase is running"
                  url="https://my-site.com"
                  progress={0}
                  animateOnMount={cardsVisible}
                  showCloseButton={false}
                  stages={[
                    { label: "On Page", status: "pending", progress: 0 },
                    { label: "Content", status: "pending", progress: 0 },
                    { label: "Technical", status: "pending", progress: 0 },
                  ]}
                  className="border-blue-300"
                />
              </div>

              <div ref={mobileCard1Ref} className="absolute inset-x-0 top-0">
                <SeoProgressCard
                  title="SEO Mid Progress"
                  subtitle="Analysis is actively processing"
                  url="https://my-site.com"
                  progress={58}
                  animateOnMount={cardsVisible}
                  showCloseButton={false}
                  stages={[
                    { label: "On Page", status: "done", progress: 100 },
                    { label: "Content", status: "in-progress", progress: 62 },
                    { label: "Technical", status: "in-progress", progress: 18 },
                  ]}
                  className="border-blue-500 shadow-[0_14px_48px_rgba(59,130,246,0.24)]"
                />
              </div>

              <div ref={mobileCard2Ref} className="absolute inset-x-0 top-0">
                <SeoProgressCard
                  title="SEO Analysis Complete"
                  subtitle="All checks completed successfully"
                  url="https://my-site.com"
                  progress={100}
                  animateOnMount={cardsVisible}
                  showCloseButton={false}
                  stages={[
                    { label: "On Page", status: "done", progress: 100 },
                    { label: "Content", status: "done", progress: 100 },
                    { label: "Technical", status: "done", progress: 100 },
                  ]}
                  className="border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

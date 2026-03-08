"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
      opacity: 0,
      y: 50,
    });


    // Main content animation
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    })
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      )
      .to(
        buttonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4",
      );


  }, []);

  return (
    <div
      className="custom-hero-background relative overflow-hidden"
      ref={containerRef}
    >
      {/* Main Content */}
      <div className="flex flex-col h-[90vh] place-content-center gap-6 text-center relative z-10 px-10">
        <h2 ref={titleRef} className="text-4xl md:text-6xl font-extrabold">
          Analyze your website <br /> SEO and performance.
        </h2>

        <p ref={subtitleRef} className="text-xl">
          Boost your site&apos;s ranking and speed with our powerful analytics
          tools.
        </p>

        <div ref={buttonsRef} className="flex justify-center my-2 gap-4">
          <Link href="/login">
            <Button
            className="hover:scale-120 text-xl font-semibold py-8 px-10 hover:bg-blue-700 transition duration-300 hover:shadow-lg">
              <span>Get Started now</span>
              <ArrowRight className="ml-2" />
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Hero;

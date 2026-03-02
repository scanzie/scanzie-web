"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const circlesRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
      opacity: 0,
      y: 50,
    });

    gsap.set(circlesRef.current, {
      opacity: 0,
      scale: 0,
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

    // Animate circles entrance
    circlesRef.current.forEach((circle, i) => {
      if (circle) {
        gsap.to(circle, {
          opacity: 0.6,
          scale: 1,
          duration: 0.8,
          delay: circles[i].delay,
          ease: "back.out(1.7)",
        });
      }
    });

    // Continuous circle animations
    circlesRef.current.forEach((circle, i) => {
      if (circle) {
        // Floating animation
        gsap.to(circle, {
          y: "+=20",
          duration: circles[i].duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: circles[i].delay,
        });

        // Color changing animation
        gsap.to(circle, {
          backgroundColor: "hsl(220, 70%, 60%)",
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: circles[i].delay * 0.5,
        });

        // Scale pulsing for some circles
        if (i % 3 === 0) {
          gsap.to(circle, {
            scale: 1.2,
            duration: circles[i].duration * 0.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: circles[i].delay * 1.5,
          });
        }
      }
    });

    // Parallax-like movement on mouse move
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(circlesRef.current, {
        x: `+=${xPercent * 10}`,
        y: `+=${yPercent * 10}`,
        duration: 1,
        ease: "power2.out",
        stagger: 0.02,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="custom-hero-background relative overflow-hidden"
      ref={containerRef}
    >
      {/* Main Content */}
      <div className="flex flex-col h-[90vh] place-content-center gap-6 text-center relative z-10">
        <h2 ref={titleRef} className="text-4xl md:text-6xl font-extrabold">
          Analyze your website <br /> SEO and performance.
        </h2>

        <p ref={subtitleRef} className="text-xl">
          Boost your site&apos;s ranking and speed with our powerful analytics
          tools.
        </p>

        <div ref={buttonsRef} className="flex justify-center my-2 gap-4">
          <Link href="/login">
            <Button className="hover:scale-110 font-semibold p-6 hover:bg-blue-700 transition duration-300 hover:shadow-lg">
              <span>Get Started now</span>
              <ArrowRight className="ml-2" />
            </Button>
          </Link>

          <Button className="hover:scale-110 bg-gray-200 p-6 text-gray-800 font-semibold hover:bg-gray-300 transition duration-300 hover:shadow-lg">
            <span>Check Features</span>
            <ArrowDown className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

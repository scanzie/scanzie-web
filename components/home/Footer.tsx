"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<Array<HTMLDivElement | null>>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(brandRef.current, { opacity: 0, x: -26 });
      gsap.set(columnsRef.current, { opacity: 0, y: 26 });
      gsap.set(bottomRef.current, { opacity: 0, y: 18 });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(brandRef.current, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
          });

          gsap.to(columnsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.08,
          });

          gsap.to(bottomRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            delay: 0.18,
          });
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-gray-200 bg-gray-50">
      <div className="app-container py-12">
        <div className="grid items-center justify-between gap-8 md:flex">
          <div ref={brandRef} className="col-span-1">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Scanzie
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Powerful SEO and performance analytics tools to boost your
              website&apos;s ranking and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div
              ref={(node) => {
                columnsRef.current[0] = node;
              }}
            >
              <h3 className="mb-4 text-sm font-medium text-gray-900">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Meta Tag Scanner
                  </Link>
                </li>
                <li>
                  <Link
                    href="$"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Image Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/keyword-analysis"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Keyword Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/technical-seo-audit"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Technical SEO Audit
                  </Link>
                </li>
              </ul>
            </div>

            <div
              ref={(node) => {
                columnsRef.current[1] = node;
              }}
            >
              <h3 className="mb-4 text-sm font-medium text-gray-900">
                Socials
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    target="_blank"
                    href="https://x.com/scanzieapp"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    X (Twitter)
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://web.facebook.com/profile.php?id=61578661535793"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://www.github.com/scanzie"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Github
                  </Link>
                </li>
              </ul>
            </div>

            <div
              ref={(node) => {
                columnsRef.current[2] = node;
              }}
            >
              <h3 className="mb-4 text-sm font-medium text-gray-900">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/report-a-bug"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Report a Bug
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          ref={bottomRef}
          className="mt-8 items-center justify-between border-t border-gray-200 pt-8"
        >
          <p className="text-center text-sm text-gray-500">
            (c) {new Date().getFullYear()} Scanzie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

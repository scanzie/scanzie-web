"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is Scanzie and how does it work?",
    answer:
      "Scanzie is a comprehensive SEO and performance analytics tool that helps you optimize your website. It provides technical audits, keyword analysis, and performance tracking to boost your site's ranking and speed across search engines.",
  },
  {
    id: "2",
    question: "How accurate is the Meta Tag Scanner?",
    answer:
      "Our Meta Tag Scanner provides highly accurate analysis by crawling your pages just like search engines do. It identifies missing tags, duplicate content, and optimization opportunities with detailed recommendations to improve your search engine visibility.",
  },
  {
    id: "3",
    question: "Can I track my competitors' rankings?",
    answer: "Nope.",
  },
  {
    id: "4",
    question: "What technical issues does the SEO Audit detect?",
    answer:
      "The Technical SEO Audit identifies crawl errors, broken links, duplicate content, page speed issues, mobile-friendliness problems, sitemap errors, and other technical factors that impact search visibility and user experience.",
  },
  {
    id: "8",
    question: "How does the Site Architecture Analysis work?",
    answer:
      "Our Site Architecture Analysis evaluates your URL structure, internal linking patterns, and overall site hierarchy. It provides recommendations to improve crawlability, user navigation, and search engine understanding of your content.",
  },
];

const FAQ: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 22 });
      gsap.set(itemsRef.current, { opacity: 0, y: 30 });
      gsap.set(ctaRef.current, { opacity: 0, y: 18 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 77%",
        once: true,
        onEnter: () => {
          gsap.to(headerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          });

          gsap.to(itemsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.08,
          });

          gsap.to(ctaRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            delay: 0.2,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section ref={sectionRef} className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Everything you need to know about Scanzie&apos;s SEO and performance
            analytics tools. Can&apos;t find what you&apos;re looking for?
            Contact our support team.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              className="rounded-lg border border-gray-200 bg-gray-50 transition-colors hover:border-gray-300"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full cursor-pointer rounded-2xl px-6 py-4 text-left"
                aria-expanded={openItems.has(item.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="pr-4 font-medium text-gray-900 md:text-lg">
                    {item.question}
                  </h3>
                  <div className="shrink-0">
                    <svg
                      className={`h-5 w-5 transform text-gray-500 transition-transform duration-200 ${
                        openItems.has(item.id) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {openItems.has(item.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="leading-relaxed text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Still have questions?</p>
          <Link href="/support">
            <Button>
              Contact Support
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

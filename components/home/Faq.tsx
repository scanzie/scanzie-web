"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";

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
  //   {
  //     id: '5',
  //     question: 'How often is the performance data updated?',
  //     answer: 'Performance data is updated in real-time for Core Web Vitals and loading speeds. Ranking data is refreshed daily, while technical audits can be run on-demand or scheduled to run automatically at your preferred intervals.'
  //   },
  //   {
  //     id: '6',
  //     question: 'Do you offer API access for enterprise users?',
  //     answer: 'Yes, we provide comprehensive API access for enterprise customers. This allows you to integrate Scanzie\'s analytics and monitoring capabilities directly into your existing tools and workflows.'
  //   },
  //   {
  //     id: '7',
  //     question: 'Is there a free trial available?',
  //     answer: 'Yes, we offer a 14-day free trial that includes access to all our tools and features. No credit card is required to start your trial, and you can upgrade to a paid plan at any time.'
  //   },
  {
    id: "8",
    question: "How does the Site Architecture Analysis work?",
    answer:
      "Our Site Architecture Analysis evaluates your URL structure, internal linking patterns, and overall site hierarchy. It provides recommendations to improve crawlability, user navigation, and search engine understanding of your content.",
  },
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

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
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Scanzie&apos;s SEO and performance
            analytics tools. Can&apos;t find what you&apos;re looking for?
            Contact our support team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left cursor-pointer rounded-2xl"
                aria-expanded={openItems.has(item.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <div className="shrink-0">
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
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
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Button className="">
            Contact Support
            <svg
              className="ml-2 w-4 h-4"
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
        </div>
      </div>
    </section>
  );
};

export default FAQ;

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="app-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Scanzie
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Powerful SEO and performance analytics tools to boost your website&apos;s ranking and speed.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/meta-tag-scanner" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Meta Tag Scanner
                </Link>
              </li>
              <li>
                <Link href="/performance-scanner" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Performance Scanner
                </Link>
              </li>
              <li>
                <Link href="/keyword-analysis" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Keyword Analysis
                </Link>
              </li>
              <li>
                <Link href="/technical-seo-audit" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Technical SEO Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Analytics */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Analytics</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ranking-tracker" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Ranking Tracker
                </Link>
              </li>
              <li>
                <Link href="/site-architecture" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Site Architecture
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 Scanzie. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link 
              href="https://github.com  " 
              className="text-gray-400 hover:text-gray-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
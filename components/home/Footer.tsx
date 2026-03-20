import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="app-container py-12">
        <div className="grid md:flex items-center justify-between gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Scanzie
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Powerful SEO and performance analytics tools to boost your
              website&apos;s ranking and speed.
            </p>
          </div>

          {/* Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Meta Tag Scanner
                  </Link>
                </li>
                <li>
                  <Link
                    href="$"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Image Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/keyword-analysis"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Keyword Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/technical-seo-audit"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Technical SEO Audit
                  </Link>
                </li>
              </ul>
            </div>

            {/* Socials */}

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Socials
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    target="_blank"
                    href="https://x.com/scanzieapp"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    X (Twitter)
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://web.facebook.com/profile.php?id=61578661535793"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://www.github.com"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Github
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200  justify-between items-center">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} Scanzie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

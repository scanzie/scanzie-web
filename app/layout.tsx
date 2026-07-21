import type { Metadata } from "next";
import "@fontsource/geom/400.css";
import "@fontsource/geom/500.css";
import "@fontsource/geom/600.css";
import "@fontsource/geom/700.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = "https://scanzie.vercel.app";

export const metadata: Metadata = {
  title: "Scanzie - SEO Analyzer",
  description: "Analyze and optimize your website's SEO performance with Scanzie, the ultimate SEO analyzer tool.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: ['SEO', 'website optimization', 'SEO analysis tool', 'search engine optimization', 'website audit', 'SEO analyzer'],
  openGraph: {
      title: "Scanzie - SEO Analyzer",
      description: "Analyze and optimize your website's SEO performance with Scanzie, the ultimate SEO analyzer tool.",
      type: 'website',
      siteName: 'Scanzie',
      locale: 'en_US',
      url: siteUrl,
      images: [
      {
        url: `${siteUrl}/og-twitter.png`, // Put your image in /public folder
        width: 1200,
        height: 630,
        alt: "Scanzie - SEO Analyzer  ",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Scanzie - SEO Analyzer",
    description: "Analyze and optimize your website's SEO performance with Scanzie, the ultimate SEO analyzer tool.",
    images: [`${siteUrl}/og-twitter.png`], // Put your image in /public folder
    creator: '@fisayocoder',
    site: siteUrl,
  },

};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Analytics />
        {children}
        {modal}
      </body>
    </html>
  );
}

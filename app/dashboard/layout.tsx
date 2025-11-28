import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/dashboard/others/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Dashboard | Scanzie - Professional SEO Analysis & Website Optimization",
  description:
    "Comprehensive SEO dashboard for analyzing and optimizing your website's search engine performance. Get detailed SEO audits, technical insights, and actionable recommendations with Scanzie.",
  keywords: [
    "SEO dashboard",
    "website optimization",
    "SEO analysis tool",
    "search engine optimization",
    "website audit",
    "SEO analyzer",
  ],
  openGraph: {
    title: "Scanzie - Professional SEO Analysis Dashboard",
    description:
      "Analyze and optimize your website's SEO performance with comprehensive audits and actionable insights",
    type: "website",
    siteName: "Scanzie",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scanzie - Professional SEO Analysis Dashboard",
    description:
      "Analyze and optimize your website's SEO performance with comprehensive audits and actionable insights",
    site: "@scanzie", // Add your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/dashboard",
  },
  verification: {
    // google: 'your-google-verification-code', // Add when you have it
    // other: {
    //     'bing': 'your-bing-verification-code',
    // },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-gray-50 w-full">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#363636",
              fontFamily: "Space Grotesk",
            },
          }}
        />
      </main>
    </SidebarProvider>
  );
}

import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Scanzie",
  description: "Login in to your Scanzie account.",
  keywords: [
    "login",
    "authentication",
    "secure",
    "Scanzie",
    "seo",
    "analyze",
    "user access",
  ],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Login | Scanzie",
    description:
      "Login in to your Scanzie account.",
    type: "website",
    siteName: "Scanzie",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Scanzie",
    description:
      "Login in to your Scanzie account.",
    site: "@scanzie", // Add your Twitter handle
  },
};
const layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;

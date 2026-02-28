import { fetchAnalysisDetails } from "@/lib/actions/analysis";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { url: string };
}): Promise<Metadata> {
  const param = await params;
  const url = param.url;

  try {
    const data = await fetchAnalysisDetails(decodeURIComponent(url));
    const analysis = data?.analysis;
    const pageTitle = analysis?.on_page?.title?.text || "SEO Analysis Report";

    return {
      title: `${pageTitle} - SEO Analysis | Scanzie`,
      description: `Comprehensive SEO analysis report for ${decodeURIComponent(url)}. View technical SEO insights, on-page optimization recommendations, and performance metrics.`,
      keywords: [
        "SEO analysis",
        "website audit",
        "SEO report",
        "technical SEO",
        "on-page SEO",
      ],
      openGraph: {
        title: `${pageTitle} - SEO Analysis Report`,
        description: `SEO analysis results for ${decodeURIComponent(url)}`,
        type: "website",
        siteName: "Scanzie",
      },
      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} - SEO Analysis Report`,
        description: `SEO analysis results for ${decodeURIComponent(url)}`,
      },
      robots: {
        index: false, // Analysis reports shouldn't be indexed
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "SEO Analysis Report | Scanzie",
      description:
        "View detailed SEO analysis results and optimization recommendations.",
    };
  }
}

const layout = ({ children }: { children: React.ReactElement }) => {
  return <div>{children}</div>;
};

export default layout;

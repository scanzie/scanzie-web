import AnalysisDetails, {
  SEOAnalysisResult,
} from "@/components/dashboard/analysis/AnalysisDetails";
import { fetchAnalysisDetails } from "@/lib/actions/analysis";
import AnalysisNotFound from "@/components/dashboard/analysis/AnalysisNotFound";

const Page = async ({ params }: { params: { url: string } }) => {
  const { url } = await params;

  try {
    const data = await fetchAnalysisDetails(decodeURIComponent(url));
    const analysisData = data?.analysis;
    const results: SEOAnalysisResult = {
      technical: (analysisData?.technical && typeof analysisData.technical === "object") ? analysisData.technical : ({} as SEOAnalysisResult["technical"]),
      content: (analysisData?.content && typeof analysisData.content === "object") ? analysisData.content : ({} as SEOAnalysisResult["content"]),
      on_page: (analysisData?.on_page && typeof analysisData.on_page === "object") ? analysisData.on_page : ({} as SEOAnalysisResult["on_page"]),
      url: analysisData?.url ?? "",
      title: analysisData?.title ?? "",
      id: analysisData?.id ?? "",
      userId: analysisData?.userId ?? "",
      createdAt: analysisData?.createdAt ?? new Date(),
      updatedAt: analysisData?.updatedAt ?? new Date(),
    };
    return data ? <AnalysisDetails results={results} /> : <AnalysisNotFound />;
  } catch (err) {
    return <div>Error: {(err as Error).message ?? "An error occurred"}</div>;
  }
};

export default Page;

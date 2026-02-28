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
      technical: analysisData?.technical ?? "",
      content: analysisData?.content ?? "",
      on_page: analysisData?.on_page ?? "",
      url: analysisData?.url ?? "",
      title: analysisData?.title,
      id: analysisData?.id,
    };
    return data ? <AnalysisDetails results={results} /> : <AnalysisNotFound />;
  } catch (err) {
    return <div>Error: {(err as Error).message ?? "An error occurred"}</div>;
  }
};

export default Page;

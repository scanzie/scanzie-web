import AllUserAnalysis from "@/components/dashboard/analysis/AllUserAnalysis";
import { fetchUserAnalysis } from "@/lib/actions/analysis";

const Page = async () => {
  try {
    const response = await fetchUserAnalysis();
    const analysis = response.map((item: any) => ({
      ...item.analysis,
      projectName: item.projectName,
    }));

    return <AllUserAnalysis analysis={analysis} />;
  } catch (err) {
    console.error("Error fetching analysis:", err);
    return <div>Error: {(err as Error).message ?? "An error occurred"}</div>;
  }
};

export default Page;

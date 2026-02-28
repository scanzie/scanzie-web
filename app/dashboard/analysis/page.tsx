import AllUserAnalysis from "@/components/dashboard/analysis/AllUserAnalysis";
import { fetchUserAnalysis } from "@/lib/actions/analysis";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  try {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;
    const response = await fetchUserAnalysis(page, 12);

    // @ts-expect-error - Type mismatch from database unknown types
    return <AllUserAnalysis analysis={response} />;
  } catch (err) {
    console.error("Error fetching analysis:", err);
    return <div>Error: {(err as Error).message ?? "An error occurred"}</div>;
  }
};

export default Page;

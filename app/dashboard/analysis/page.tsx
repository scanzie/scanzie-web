import AllUserAnalysis from "@/components/dashboard/analysis/AllUserAnalysis";
import { fetchUserAnalysis } from "@/lib/actions/analysis";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; filter?: string }>;
}) => {
  try {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;
    const search = params.search || "";
    const filter = (params.filter || "all") as
      | "all"
      | "good"
      | "moderate"
      | "poor";
    const response = await fetchUserAnalysis(page, 12, search, filter);

    // @ts-expect-error - Type mismatch from database unknown types
    return (
      <AllUserAnalysis analysis={response} search={search} filter={filter} />
    );
  } catch (err) {
    console.error("Error fetching analysis:", err);
    return <div>Error: {(err as Error).message ?? "An error occurred"}</div>;
  }
};

export default Page;

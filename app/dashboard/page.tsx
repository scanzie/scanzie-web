import DashboardHome from "@/components/dashboard/others/DashboardHome";

import { fetchRecentAnalysis } from "@/lib/actions/analysis";

const Dashboard = async () => {
  const data = await fetchRecentAnalysis();
  return (
    // @ts-expect-error - Type mismatch from database unknown types
    <DashboardHome results={data} />
  );
};

export default Dashboard;

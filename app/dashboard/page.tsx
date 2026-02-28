import DashboardHome from "@/components/dashboard/others/DashboardHome";
import { fetchUserAnalysis } from "@/lib/actions/analysis";

const Dashboard = async () => {
  const response = await fetchUserAnalysis();
  const data = response.map((item: any) => ({
    ...item.analysis,
    projectName: item.projectName,
  }));
  return <DashboardHome results={data} />;
};

export default Dashboard;

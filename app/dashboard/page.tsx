import React from "react";
import DashboardHome from "@/components/dashboard/others/DashboardHome";
import { fetchUserAnalysis } from "@/lib/actions/analysis";

const Dashboard = async () => {
  const data = await fetchUserAnalysis();
  return <DashboardHome results={data} />;
};

export default Dashboard;

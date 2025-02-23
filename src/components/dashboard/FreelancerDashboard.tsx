import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import Profile from "./Profile";
import Search from "./Search";
import Notifications from "./Notifications";

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isFreelancer
    >
      {activeTab === "discover" && <Search />}
      {activeTab === "notifications" && <Notifications />}
      {activeTab === "profile" && <Profile />}
    </DashboardLayout>
  );
}

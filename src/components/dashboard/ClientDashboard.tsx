import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import Profile from "./Profile";
import Search from "./Search";
import Posts from "./Posts";
import Notifications from "./Notifications";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "discover" && <Search isClientView />}
      {activeTab === "posts" && <Posts />}
      {activeTab === "notifications" && <Notifications />}
      {activeTab === "profile" && <Profile />}
    </DashboardLayout>
  );
}

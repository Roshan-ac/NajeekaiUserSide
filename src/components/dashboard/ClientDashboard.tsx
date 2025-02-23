import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import Profile from "./Profile";
import Search from "./Search";
import Posts from "./Posts";
import Notifications from "./Notifications";

export default function ClientDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "discover",
  );

  // Update active tab when location state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "discover" && <Search isClientView />}
      {activeTab === "posts" && <Posts />}
      {activeTab === "notifications" && <Notifications />}
      {activeTab === "profile" && <Profile />}
    </DashboardLayout>
  );
}

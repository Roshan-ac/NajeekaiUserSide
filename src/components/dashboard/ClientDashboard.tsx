import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import FreelancerCard from "./FreelancerCard";
import Profile from "./Profile";

const FREELANCERS = [
  {
    name: "Mia Turner",
    title: "Webflow Developer / UI Designer",
    location: "Germany",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    email: "mia.turner@gmail.com",
  },
  {
    name: "Leo Cohen",
    title: "Graphic Designer",
    location: "Australia",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    email: "leo.cohen@gmail.com",
  },
  {
    name: "Ava Wells",
    title: "Senior UX Designer",
    location: "Brazil",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    email: "ava.wells@gmail.com",
  },
  {
    name: "Zoe Chase",
    title: "Low Code / Webflow Developer",
    location: "Australia",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    email: "hello@zoechase.com",
  },
  {
    name: "Oliver Davis",
    title: "Senior Researcher / UI Designer",
    location: "Germany",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    email: "welcome@designdavis.com",
  },
  {
    name: "John Smith",
    title: "Design Systems Lead",
    location: "Singapore",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    email: "info@johnsmith.com",
  },
];

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "discover" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FREELANCERS.map((freelancer) => (
            <FreelancerCard key={freelancer.name} {...freelancer} />
          ))}
        </div>
      )}
      {activeTab === "profile" && <Profile />}
    </DashboardLayout>
  );
}

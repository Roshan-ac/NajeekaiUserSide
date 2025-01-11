import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import Profile from "./Profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const PROPOSALS = [
  {
    id: "1",
    title: "Website Redesign Project",
    client: "Tech Solutions Inc.",
    status: "Pending",
    submittedDate: "2024-03-15",
  },
  {
    id: "2",
    title: "E-commerce Platform Development",
    client: "Fashion Retail Co.",
    status: "Accepted",
    submittedDate: "2024-03-10",
  },
  {
    id: "3",
    title: "Mobile App UI Design",
    client: "StartUp Mobile",
    status: "Rejected",
    submittedDate: "2024-03-05",
  },
];

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isFreelancer
    >
      {activeTab === "discover" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Available Projects</h2>
          <div className="grid gap-4">
            {/* Placeholder for available projects */}
            <Card className="p-6">
              <p className="text-muted-foreground">
                Available projects will appear here.
              </p>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "proposals" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">My Proposals</h2>
          <div className="grid gap-4">
            {PROPOSALS.map((proposal) => (
              <Card key={proposal.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Client: {proposal.client}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {proposal.submittedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        proposal.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : proposal.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {proposal.status}
                    </span>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "profile" && <Profile />}
    </DashboardLayout>
  );
}

import DashboardLayout from "./DashboardLayout";
import { getUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";

export default function Profile() {
  const user = getUser();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Profile</h2>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-medium">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

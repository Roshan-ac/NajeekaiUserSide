import DashboardLayout from "./DashboardLayout";

export default function Notifications() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className="text-muted-foreground">
          Your notifications will appear here.
        </p>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "./DashboardLayout";

export default function Messages() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Messages</h2>
        <p className="text-muted-foreground">Your messages will appear here.</p>
      </div>
    </DashboardLayout>
  );
}

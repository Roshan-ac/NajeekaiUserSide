import {
  Home,
  MessageSquare,
  Bell,
  User,
  LogOut,
  FileText,
  ClipboardList,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isFreelancer?: boolean;
}

const BASE_SIDEBAR_ITEMS = [
  { icon: Home, label: "Discover", id: "discover" },
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: User, label: "Profile", id: "profile" },
];

const CLIENT_SIDEBAR_ITEMS = [
  { icon: Home, label: "Discover", id: "discover" },
  { icon: ClipboardList, label: "Posts", id: "posts" },
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: User, label: "Profile", id: "profile" },
];

import { useTheme } from "@/components/theme-provider";

export default function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  isFreelancer = false,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const SIDEBAR_ITEMS = isFreelancer
    ? [
        ...BASE_SIDEBAR_ITEMS.slice(0, 1),
        { icon: FileText, label: "Proposals", id: "proposals" },
        ...BASE_SIDEBAR_ITEMS.slice(1),
      ]
    : CLIENT_SIDEBAR_ITEMS;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Top Navbar with just branding */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
        <div className="container h-full flex items-center">
          <span className="text-2xl font-bold text-primary">Najeekai</span>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed h-full p-4 flex flex-col top-16">
        <div className="space-y-2 flex-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                activeTab === item.id && "bg-primary/5 text-primary",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                Dark Mode
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {activeTab === "discover" && (
            <div className="flex text-center items-center justify-between mb-6">
              <h1 className="text-2xl text-center font-semibold">
                {isFreelancer ? "Available Projects" : "Discover Freelancers"}
              </h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

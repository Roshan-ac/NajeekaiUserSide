import { Home, Search, MessageSquare, Bell, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/lib/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_ITEMS = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Search", href: "/dashboard/search" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

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
            <Link to={item.href} key={item.label}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  location.pathname === item.href &&
                    "bg-primary/5 text-primary",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <Button
          variant="ghost"
          className="justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Discover Freelancers</h1>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search freelancers..."
                className="pl-10 bg-white border-gray-200"
              />
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

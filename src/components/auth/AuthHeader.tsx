import React from "react";
import { Card } from "@/components/ui/card";

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
}

const AuthHeader = ({
  title = "Welcome to Najeekai",
  subtitle = "Connect with local service providers or start offering your services today",
  logoUrl = "https://api.dicebear.com/7.x/initials/svg?seed=NA",
}: AuthHeaderProps) => {
  return (
    <Card className="w-full p-8 bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            src={logoUrl}
            alt="Najeekai Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm max-w-sm">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default AuthHeader;

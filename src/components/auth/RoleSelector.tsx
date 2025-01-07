import React from "react";
import { Card } from "@/components/ui/card";
import { UserCircle2, Briefcase } from "lucide-react";

interface RoleSelectorProps {
  selectedRole?: "client" | "freelancer";
  onRoleSelect?: (role: "client" | "freelancer") => void;
}

const RoleSelector = ({
  selectedRole = "client",
  onRoleSelect = () => {},
}: RoleSelectorProps) => {
  return (
    <div className="w-full space-y-4 bg-white p-4">
      <h3 className="text-lg font-medium text-center mb-4">Choose your role</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`p-4 cursor-pointer hover:border-primary transition-colors ${
            selectedRole === "client" ? "border-primary" : "border-border"
          }`}
          onClick={() => onRoleSelect("client")}
        >
          <div className="flex flex-col items-center space-y-2">
            <UserCircle2 className="h-8 w-8 text-primary" />
            <h4 className="font-medium">Client</h4>
            <p className="text-sm text-muted-foreground text-center">
              Looking for services
            </p>
          </div>
        </Card>

        <Card
          className={`p-4 cursor-pointer hover:border-primary transition-colors ${
            selectedRole === "freelancer" ? "border-primary" : "border-border"
          }`}
          onClick={() => onRoleSelect("freelancer")}
        >
          <div className="flex flex-col items-center space-y-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h4 className="font-medium">Freelancer</h4>
            <p className="text-sm text-muted-foreground text-center">
              Offering services
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelector;

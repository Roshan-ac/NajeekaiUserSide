import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FreelancerCardProps {
  name?: string;
  title?: string;
  location?: string;
  imageUrl?: string;
  email?: string;
}

export default function FreelancerCard({
  name = "John Doe",
  title = "Professional Plumber",
  location = "New York, NY",
  imageUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  email = "john@example.com",
}: FreelancerCardProps) {
  return (
    <Card className="p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={imageUrl}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-sm">{name}</h3>
              <p className="text-sm text-gray-500">{location}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-600">{title}</p>
            <p className="text-xs text-gray-400 mt-1">{email}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

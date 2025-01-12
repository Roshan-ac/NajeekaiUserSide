import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin, Clock, DollarSign } from "lucide-react";

interface PostCardProps {
  caption: string;
  description: string;
  location: string;
  paymentMode: "FIXED" | "DAILY";
  fixedRate?: number;
  dailyRate?: number;
  estimatedTime: number;
  timeUnit: "HOUR" | "DAY" | "WEEK" | "MONTH";
  requiredSkills: string[];
  postedAt: string;
}

export default function PostCard({
  caption,
  description,
  location,
  paymentMode,
  fixedRate,
  dailyRate,
  estimatedTime,
  timeUnit,
  requiredSkills,
  postedAt,
}: PostCardProps) {
  return (
    <Card className="p-4 bg-white hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-base">{caption}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {requiredSkills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {estimatedTime} {timeUnit.toLowerCase()}
              {estimatedTime > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>
              {paymentMode === "FIXED"
                ? `$${fixedRate} fixed`
                : `$${dailyRate}/day`}
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Posted {formatDistanceToNow(new Date(postedAt))} ago
        </div>
      </div>
    </Card>
  );
}

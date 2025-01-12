import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function RequestService() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const postData = {
        id: crypto.randomUUID(),
        customerId: user.id,
        caption: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
        paymentMode: formData.get("paymentMode"),
        estimatedTime: parseInt(formData.get("estimatedTime") as string),
        timeUnit: formData.get("timeUnit"),
        fixedRate:
          formData.get("paymentMode") === "FIXED"
            ? parseFloat(formData.get("rate") as string)
            : null,
        dailyRate:
          formData.get("paymentMode") === "DAILY"
            ? parseFloat(formData.get("rate") as string)
            : null,
        requiredSkills: (formData.get("skills") as string)
          .split(",")
          .map((s) => s.trim()),
        postedAt: new Date().toISOString(),
      };

      const { error } = await supabase.from("Post").insert(postData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your service request has been posted.",
      });

      navigate("/dashboard", { state: { activeTab: "posts" } });
    } catch (error) {
      console.error("Error posting service request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post service request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "client") {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">Request a Service</h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details of the service you need.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Need a Website Developer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the service you need..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g., React, Node.js, UI Design (comma-separated)"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., New York, Remote"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select name="paymentMode" required defaultValue="FIXED">
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIXED">Fixed Rate</SelectItem>
                        <SelectItem value="DAILY">Daily Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate ($)</Label>
                    <Input
                      id="rate"
                      name="rate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeUnit">Time Unit</Label>
                    <Select name="timeUnit" required defaultValue="DAY">
                      <SelectTrigger>
                        <SelectValue placeholder="Select time unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOUR">Hours</SelectItem>
                        <SelectItem value="DAY">Days</SelectItem>
                        <SelectItem value="WEEK">Weeks</SelectItem>
                        <SelectItem value="MONTH">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Time</Label>
                    <Input
                      id="estimatedTime"
                      name="estimatedTime"
                      type="number"
                      min="1"
                      placeholder="e.g., 5"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Posting..." : "Post Request"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

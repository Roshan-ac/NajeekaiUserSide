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

interface FormErrors {
  title?: string;
  description?: string;
  skills?: string;
  location?: string;
  rate?: string;
  estimatedTime?: string;
}

export default function RequestService() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getUser();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"FIXED" | "DAILY">("FIXED");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    const title = formData.get("title") as string;
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    }

    // Description validation
    const description = formData.get("description") as string;
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 50) {
      newErrors.description = "Description must be at least 50 characters long";
    }

    // Skills validation
    const skills = formData.get("skills") as string;
    if (!skills.trim()) {
      newErrors.skills = "At least one skill is required";
    }

    // Location validation
    const location = formData.get("location") as string;
    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    // Rate validation
    const rate = formData.get("rate") as string;
    const rateNum = parseFloat(rate);
    if (!rate || isNaN(rateNum)) {
      newErrors.rate = "Valid rate is required";
    } else if (rateNum <= 0) {
      newErrors.rate = "Rate must be greater than 0";
    }

    // Estimated time validation
    const estimatedTime = parseInt(formData.get("estimatedTime") as string);
    if (isNaN(estimatedTime) || estimatedTime <= 0) {
      newErrors.estimatedTime = "Valid estimated time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) return;

    setIsLoading(true);
    try {
      const rate = parseFloat(formData.get("rate") as string);
      const postData = {
        id: crypto.randomUUID(),
        customerId: user.id,
        caption: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
        paymentMode,
        estimatedTime: parseInt(formData.get("estimatedTime") as string),
        timeUnit: formData.get("timeUnit"),
        fixedRate: paymentMode === "FIXED" ? rate : null,
        dailyRate: paymentMode === "DAILY" ? rate : null,
        requiredSkills: (formData.get("skills") as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the service you need in detail..."
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g., React, Node.js, UI Design (comma-separated)"
                    className={errors.skills ? "border-red-500" : ""}
                  />
                  {errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., New York, Remote"
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select
                      name="paymentMode"
                      value={paymentMode}
                      onValueChange={(value: "FIXED" | "DAILY") =>
                        setPaymentMode(value)
                      }
                    >
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
                    <Label htmlFor="rate">
                      {paymentMode === "FIXED" ? "Fixed Rate" : "Daily Rate"}{" "}
                      ($)
                    </Label>
                    <Input
                      id="rate"
                      name="rate"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={
                        paymentMode === "FIXED" ? "e.g., 500" : "e.g., 50"
                      }
                      className={errors.rate ? "border-red-500" : ""}
                    />
                    {errors.rate && (
                      <p className="text-sm text-red-500">{errors.rate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeUnit">Time Unit</Label>
                    <Select name="timeUnit" defaultValue="DAY">
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
                      className={errors.estimatedTime ? "border-red-500" : ""}
                    />
                    {errors.estimatedTime && (
                      <p className="text-sm text-red-500">
                        {errors.estimatedTime}
                      </p>
                    )}
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

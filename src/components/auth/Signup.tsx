import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

type UserRole = "client" | "freelancer";

interface ValidationStatus {
  email: "available" | "taken" | "checking" | null;
  username: "available" | "taken" | "checking" | null;
}

export default function Signup() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("client");
  const [validation, setValidation] = useState<ValidationStatus>({
    email: null,
    username: null,
  });

  // Debounced validation function
  const validateField = async (field: "email" | "username", value: string) => {
    if (!value) return;

    setValidation((prev) => ({ ...prev, [field]: "checking" }));

    const table = role === "client" ? "Customer" : "Freelancer";
    const { data } = await supabase
      .from(table)
      .select(field)
      .eq(field, value)
      .single();

    setValidation((prev) => ({
      ...prev,
      [field]: data ? "taken" : "available",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const firstName = formData.get("firstName") as string;
    const middleName = formData.get("middleName") as string;
    const lastName = formData.get("lastName") as string;

    try {
      // Generate OTP
      const { data: otpData, error: otpError } = await supabase
        .from("Otp")
        .insert({
          email,
          otp: Math.floor(100000 + Math.random() * 900000).toString(),
          sessionId: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        })
        .select()
        .single();

      if (otpError) throw otpError;

      // Store signup data in session storage for after OTP verification
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          email,
          username,
          firstName,
          middleName,
          lastName,
          role,
          sessionId: otpData.sessionId,
        }),
      );

      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });

      // Redirect to OTP verification page
      // You'll need to create this page next
      // navigate("/verify-otp");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 py-12">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Get started with Najeekai</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg shadow-sm"
        >
          <div className="space-y-4">
            <Label>I want to</Label>
            <RadioGroup
              defaultValue="client"
              className="grid grid-cols-2 gap-4 pt-2"
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client">Client</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer">Freelancer</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name (Optional)</Label>
            <Input
              id="middleName"
              name="middleName"
              placeholder="Middle Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              placeholder="johndoe"
              required
              onChange={(e) => validateField("username", e.target.value)}
              className={
                validation.username === "taken" ? "border-red-500" : ""
              }
            />
            {validation.username === "checking" && (
              <p className="text-sm text-muted-foreground">
                Checking availability...
              </p>
            )}
            {validation.username === "taken" && (
              <p className="text-sm text-red-500">Username is already taken</p>
            )}
            {validation.username === "available" && (
              <p className="text-sm text-green-500">Username is available</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              onChange={(e) => validateField("email", e.target.value)}
              className={validation.email === "taken" ? "border-red-500" : ""}
            />
            {validation.email === "checking" && (
              <p className="text-sm text-muted-foreground">
                Checking availability...
              </p>
            )}
            {validation.email === "taken" && (
              <p className="text-sm text-red-500">
                Email is already registered
              </p>
            )}
            {validation.email === "available" && (
              <p className="text-sm text-green-500">Email is available</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              validation.email === "taken" ||
              validation.username === "taken" ||
              validation.email === "checking" ||
              validation.username === "checking"
            }
          >
            {isLoading ? "Creating Account..." : "Continue with Email"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { SendEmailNotification } from "@/lib/email";
import { setAuth, createSession } from "@/lib/auth";

export default function OTPVerification() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const signupData = sessionStorage.getItem("signupData");
      if (!signupData) {
        throw new Error("No signup data found");
      }

      const parsedData = JSON.parse(signupData);
      const role = parsedData.role || "client";

      // Verify OTP using the API
      const response = await fetch(
        "https://servicerentalbackend.onrender.com/api/auth/verifyOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: parsedData.email,
            otp: otp,
            sessionId: parsedData.sessionId,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid OTP");
      }

      // For new users, create record in appropriate table
      if (!result.isRegistered) {
        const userId = crypto.randomUUID();
        const table = role === "client" ? "Customer" : "Freelancer";

        const { error: userError } = await supabase.from(table).insert({
          id: userId,
          username: parsedData.username,
          firstName: parsedData.firstName,
          middleName: parsedData.middleName,
          lastName: parsedData.lastName,
          email: parsedData.email,
        });

        if (userError) {
          throw userError;
        }

        // Create user object
        const user = {
          id: userId,
          email: parsedData.email,
          firstName: parsedData.firstName,
          lastName: parsedData.lastName,
          username: parsedData.username,
          middleName: parsedData.middleName,
          role,
        };

        // Create our own session
        const session = await createSession(userId, role);

        // Store auth data
        setAuth(user, session);

        toast({
          title: "Success!",
          description: "Your account has been created successfully.",
        });
      } else {
        // For existing users, fetch their data from Supabase
        const existingRole = result.role?.toLowerCase() || "client";
        const table = existingRole === "client" ? "Customer" : "Freelancer";

        const { data: userData, error: userError } = await supabase
          .from(table)
          .select("*")
          .eq("email", parsedData.email)
          .single();

        if (userError || !userData) {
          throw new Error("Failed to fetch user data");
        }

        // Create our own session
        const session = await createSession(userData.id, existingRole);

        // Store auth data
        setAuth(
          {
            ...userData,
            role: existingRole,
          },
          session,
        );

        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
      }

      // Clear signup data
      sessionStorage.removeItem("signupData");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const signupData = sessionStorage.getItem("signupData");
      if (!signupData) {
        throw new Error("No signup data found");
      }

      const parsedData = JSON.parse(signupData);

      // Send new OTP email
      const response = await SendEmailNotification({
        email: [parsedData.email],
      });

      // Update sessionId in storage
      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          ...parsedData,
          sessionId: response.sessionId,
        }),
      );

      // Reset timer
      setTimeLeft(600);

      toast({
        title: "OTP Resent",
        description: "Please check your email for the new verification code.",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            Please enter the verification code sent to your email
          </p>
        </div>

        <form
          onSubmit={handleVerifyOTP}
          className="space-y-6 bg-white p-8 rounded-lg shadow-sm"
        >
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter 4-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
              className="text-center text-2xl tracking-widest"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.length !== 4}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Time remaining: {formatTime(timeLeft)}
            </p>
            <Button
              type="button"
              variant="ghost"
              className="text-sm"
              onClick={handleResendOTP}
              disabled={timeLeft > 0}
            >
              Resend Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

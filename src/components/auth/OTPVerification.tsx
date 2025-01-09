import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { SendEmailNotification } from "@/lib/email";

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

      // Verify OTP
      const { data: otpData, error: otpError } = await supabase
        .from("Otp")
        .select("*")
        .eq("sessionId", parsedData.sessionId)
        .eq("otp", otp)
        .single();

      if (otpError || !otpData) {
        throw new Error("Invalid OTP");
      }

      // Check if OTP is expired
      if (new Date(otpData.expiresAt) < new Date()) {
        throw new Error("OTP has expired");
      }

      // Create user record in appropriate table
      const table = parsedData.role === "client" ? "Customer" : "Freelancer";
      const { error: userError } = await supabase.from(table).insert({
        id: crypto.randomUUID(),
        username: parsedData.username,
        firstName: parsedData.firstName,
        middleName: parsedData.middleName,
        lastName: parsedData.lastName,
        email: parsedData.email,
      });

      if (userError) {
        throw userError;
      }

      // Clear signup data
      sessionStorage.removeItem("signupData");

      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });

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
      const emailResponse = await SendEmailNotification({
        email: [parsedData.email],
      });

      if (!emailResponse?.otp) {
        throw new Error("Failed to generate OTP");
      }

      // Store new OTP in Supabase
      const { error: otpError } = await supabase.from("Otp").insert({
        email: parsedData.email,
        otp: emailResponse.otp,
        sessionId: parsedData.sessionId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

      if (otpError) throw otpError;

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
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.length !== 6}
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

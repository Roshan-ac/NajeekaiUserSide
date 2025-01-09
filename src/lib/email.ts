// Email service for frontend
export async function SendEmailNotification({
  email,
  subject,
  text,
  template,
}: {
  email: string[];
  subject?: string;
  text?: string;
  template?: string;
}) {
  try {
    // Call the backend API
    const response = await fetch(
      "https://servicerentalbackend.onrender.com/api/auth/sendOtp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email[0], // API expects a single email
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

// Simple template for OTP emails
export function generateOTPEmailTemplate(otp: string) {
  return `
    <div>
      <h2>Verify Your Email</h2>
      <p>Your verification code is: ${otp}</p>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;
}

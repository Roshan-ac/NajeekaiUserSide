import { supabase } from "./supabase";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  middleName?: string;
  role: "client" | "freelancer";
}

// Login user
export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  try {
    // Try client table first
    const { data: clientData, error: clientError } = await supabase
      .from("Customer")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (clientData) {
      const user = {
        ...clientData,
        role: "client" as const,
      };
      localStorage.setItem("user", JSON.stringify(user));
      // Create session
      await createSession(user.id, "client");
      return user;
    }

    // Try freelancer table
    const { data: freelancerData, error: freelancerError } = await supabase
      .from("Freelancer")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (freelancerData) {
      const user = {
        ...freelancerData,
        role: "freelancer" as const,
      };
      localStorage.setItem("user", JSON.stringify(user));
      // Create session
      await createSession(user.id, "freelancer");
      return user;
    }

    throw new Error("Invalid email or password");
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid email or password");
  }
}

// Register new user
export async function registerUser(userData: {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: "client" | "freelancer";
}): Promise<void> {
  const table = userData.role === "client" ? "Customer" : "Freelancer";

  const { error } = await supabase.from(table).insert({
    id: crypto.randomUUID(),
    email: userData.email,
    password: userData.password,
    username: userData.username,
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
  });

  if (error) {
    console.error("Registration error:", error);
    throw new Error("Failed to create account");
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return localStorage.getItem("user") !== null;
}

// Get current user
export function getUser(): User | null {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

// Clear auth data
export function logout(): void {
  localStorage.removeItem("user");
}

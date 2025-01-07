import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Github } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Signup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
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
            <Label>I want to</Label>
            <RadioGroup
              defaultValue="client"
              className="grid grid-cols-2 gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client">Hire Services</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer">Offer Services</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I accept the{" "}
              <a href="#" className="text-primary hover:underline">
                terms and conditions
              </a>
            </label>
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Continue with Github
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
};

export default Signup;

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Calendar, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find the skilled locals near you
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with trusted local service providers for all your needs
            </p>
            <div className="flex gap-4">
              <Link to="/auth?tab=signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Home Maintenance", icon: "🏠" },
              { title: "Electrical Services", icon: "⚡" },
              { title: "Plumbing", icon: "🔧" },
              { title: "Landscaping", icon: "🌿" },
              { title: "Cleaning", icon: "✨" },
              { title: "Moving Services", icon: "📦" },
            ].map((category) => (
              <Card
                key={category.title}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold">{category.title}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8" />,
                title: "Search",
                description: "Find the right service provider in your area",
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Book",
                description: "Schedule a time that works for you",
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Done",
                description: "Get the job done and leave a review",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="p-4 bg-primary/10 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join our community of skilled professionals and customers
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
            >
              Browse Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Najeekai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

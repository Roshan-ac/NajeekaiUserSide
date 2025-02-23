import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function Posts() {
  const { toast } = useToast();
  const user = getUser();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Post")
        .select(
          `
          *,
          Customer (id, firstName, lastName, email),
          Proposal (id, freelancerId, isApproved)
        `,
        )
        .eq("customerId", user.id)
        .order("postedAt", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your posts",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Service Requests</h2>
        <Link to="/request-service">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Request
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center">Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              clientName={`${post.Customer.firstName} ${post.Customer.lastName}`}
              clientAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.Customer.email}`}
              customerId={post.customerId}
              onApplicationUpdate={fetchPosts}
            />
          ))}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            You haven't posted any service requests yet.
          </p>
          <Link to="/request-service">
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Create Your First Request
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

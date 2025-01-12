import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import PostCard from "./PostCard";

export default function Posts() {
  const navigate = useNavigate();
  const user = getUser();
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("Post")
          .select("*")
          .eq("customerId", user.id)
          .order("postedAt", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Posts</h2>
        <Button onClick={() => navigate("/request-service")}>
          <Plus className="w-4 h-4 mr-2" /> Request Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground col-span-full">Loading...</p>
        ) : posts?.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} {...post} />)
        ) : (
          <p className="text-muted-foreground col-span-full">
            You haven't posted any service requests yet.
          </p>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import PostCard from "./PostCard";
import FreelancerCard from "./FreelancerCard";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface SearchProps {
  isClientView?: boolean;
}

export default function Search({ isClientView = false }: SearchProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        if (!isClientView) {
          // For freelancers, load posts (filtered if there's a search query)
          const { data, error } = await supabase
            .from("Post")
            .select(
              `
              *,
              Customer (id, firstName, lastName, email)
            `
            )
            .order("postedAt", { ascending: false });

          if (error) throw error;
          
          let filteredData = data || [];
          if (searchQuery.trim()) {
            const searchTerm = searchQuery.toLowerCase();
            filteredData = filteredData.filter(post => 
              post.caption.toLowerCase().includes(searchTerm) ||
              post.description.toLowerCase().includes(searchTerm) ||
              post.location.toLowerCase().includes(searchTerm) ||
              post.requiredSkills?.some(skill => 
                skill.toLowerCase().includes(searchTerm)
              )
            );
          }
          
          setResults(filteredData);
          return;
        }

      setIsLoading(true);
      try {
        const query = searchQuery.toLowerCase();

        if (isClientView) {
          // Search freelancers
          const { data, error } = await supabase
            .from("Freelancer")
            .select("*")
            .or(
              `firstName.ilike.%${query}%,lastName.ilike.%${query}%,description.ilike.%${query}%`,
            )
            .order("firstName");

          if (error) throw error;
          setResults(data || []);
        } else {
          // Search posts for freelancers
          const { data, error } = await supabase
            .from("Post")
            .select(
              `
              *,
              Customer (id, firstName, lastName, email)
            `,
            )
            .or(
              `caption.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`,
            )
            .order("postedAt", { ascending: false });

          if (error) throw error;
          setResults(data || []);
        }
      } catch (error) {
        console.error("Error searching:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to search. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isClientView]);

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              isClientView
                ? "Search freelancers by name or skills..."
                : "Search posts by title, description, or location..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center">Searching...</p>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {isClientView
            ? results.map((freelancer) => (
                <FreelancerCard
                  key={freelancer.id}
                  name={`${freelancer.firstName} ${freelancer.lastName}`}
                  title={freelancer.description || "Freelancer"}
                  location={freelancer.location || "Remote"}
                  email={freelancer.email}
                  imageUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.email}`}
                />
              ))
            : results.map((post) => (
                <PostCard
                  key={post.id}
                  {...post}
                  clientName={`${post.Customer.firstName} ${post.Customer.lastName}`}
                  clientAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.Customer.email}`}
                  isFreelancer={true}
                />
              ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center">
          {searchQuery
            ? "No results found matching your search."
            : isClientView
              ? "Start searching for freelancers."
              : "No posts available."}
        </p>
      )}
    </div>
  );
}

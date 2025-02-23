import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface PostCardProps {
  id: string;
  caption: string;
  description: string;
  location: string;
  paymentMode: "FIXED" | "DAILY";
  fixedRate?: number;
  dailyRate?: number;
  estimatedTime: number;
  timeUnit: "HOUR" | "DAY" | "WEEK" | "MONTH";
  requiredSkills: string[];
  clientName?: string;
  clientAvatar?: string;
  postedAt: string;
  isFreelancer?: boolean;
  customerId?: string;
  onApplicationUpdate?: () => void;
}

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isApproved: boolean;
  note?: string;
}

export default function PostCard({
  id,
  caption,
  description,
  location,
  paymentMode,
  fixedRate,
  dailyRate,
  estimatedTime,
  timeUnit,
  requiredSkills,
  clientName,
  clientAvatar,
  postedAt,
  isFreelancer,
  customerId,
  onApplicationUpdate,
}: PostCardProps) {
  const { toast } = useToast();
  const user = getUser();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [proposalNote, setProposalNote] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsCount, setApplicantsCount] = useState(0);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

  // Check if user has already applied and fetch applicants count
  useEffect(() => {
    const loadInitialData = async () => {
      if (user && isFreelancer) {
        try {
          const { data } = await supabase
            .from("Proposal")
            .select("id, note")
            .eq("postId", id)
            .eq("freelancerId", user.id)
            .single();

          setHasApplied(!!data);
          if (data?.note) setProposalNote(data.note);
        } catch (error) {
          console.error("Error checking application:", error);
        }
      }

      if (!isFreelancer) {
        try {
          const { count } = await supabase
            .from("Proposal")
            .select("id", { count: "exact" })
            .eq("postId", id);

          setApplicantsCount(count || 0);
        } catch (error) {
          console.error("Error fetching applicants count:", error);
        }
      }
    };

    loadInitialData();
  }, [user, id, isFreelancer]);

  const handleApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !isFreelancer) return;

    if (!proposalNote.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add a note to your proposal",
      });
      return;
    }

    setIsApplying(true);
    try {
      const { error } = await supabase.from("Proposal").insert({
        id: crypto.randomUUID(),
        postId: id,
        freelancerId: user.id,
        note: proposalNote,
        isApproved: false,
      });

      if (error) throw error;

      // Create notification for client
      const { error: notifError } = await supabase.from("Notification").insert({
        id: crypto.randomUUID(),
        userId: customerId,
        type: "PROPOSAL_RECEIVED",
        message: `New proposal received for your post: ${caption}`,
        postId: id,
        createdAt: new Date().toISOString(),
        isRead: false,
      });

      if (notifError) throw notifError;

      setHasApplied(true);
      setShowProposalDialog(false);
      toast({
        title: "Success",
        description: "Your proposal has been submitted.",
      });

      if (onApplicationUpdate) {
        onApplicationUpdate();
      }
    } catch (error) {
      console.error("Error applying:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const fetchApplicants = async () => {
    if (!user || user.id !== customerId) return;

    setIsLoadingApplicants(true);
    try {
      const { data, error } = await supabase
        .from("Proposal")
        .select(
          `
          id,
          isApproved,
          note,
          Freelancer (id, firstName, lastName, email)
        `,
        )
        .eq("postId", id);

      if (error) throw error;

      setApplicants(
        data.map((item) => ({
          id: item.id,
          ...item.Freelancer,
          note: item.note,
          isApproved: item.isApproved,
        })),
      );
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load applicants.",
      });
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const handleApprove = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from("Proposal")
        .update({ isApproved: true })
        .eq("id", proposalId);

      if (error) throw error;

      // Refresh applicants list
      await fetchApplicants();
      if (onApplicationUpdate) onApplicationUpdate();

      toast({
        title: "Success",
        description: "Proposal has been approved.",
      });
    } catch (error) {
      console.error("Error approving proposal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve proposal.",
      });
    }
  };

  return (
    <>
      <Card className="p-6 bg-white hover:shadow-md transition-shadow group relative overflow-hidden border-muted max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              {clientName && clientAvatar && (
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={clientAvatar}
                    alt={clientName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    {clientName}
                  </span>
                </div>
              )}
              <h3 className="font-medium text-base">{caption}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
            {!isFreelancer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowApplicants(true);
                  fetchApplicants();
                }}
                className="min-w-[120px] bg-primary/5 hover:bg-primary/10 border-primary/10"
              >
                <Users className="w-4 h-4 mr-2" />
                {applicantsCount || 0} Applied
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {requiredSkills?.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {estimatedTime} {timeUnit.toLowerCase()}
                {estimatedTime > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>
                {paymentMode === "FIXED"
                  ? `$${fixedRate} fixed`
                  : `$${dailyRate}/day`}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Posted {formatDistanceToNow(new Date(postedAt))} ago
            </div>
            {isFreelancer && (
              <Button
                onClick={() => !hasApplied && setShowProposalDialog(true)}
                disabled={isApplying || hasApplied}
                variant={hasApplied ? "secondary" : "default"}
                className="w-[140px] transition-all"
                size="sm"
              >
                {isApplying ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : hasApplied ? (
                  "Proposal Sent"
                ) : (
                  "Send Proposal"
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={showApplicants} onOpenChange={setShowApplicants}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proposals for {caption}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {isLoadingApplicants ? (
                <p className="text-center text-muted-foreground">
                  Loading proposals...
                </p>
              ) : applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <Card
                    key={applicant.id}
                    className="p-4 hover:shadow-md transition-shadow border-muted"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">
                            {applicant.firstName} {applicant.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {applicant.email}
                          </p>
                        </div>
                        {!applicant.isApproved ? (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(applicant.id)}
                          >
                            Approve
                          </Button>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">
                            Approved
                          </Badge>
                        )}
                      </div>
                      {applicant.note && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm whitespace-pre-wrap">
                            {applicant.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No proposals yet.
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Proposal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApply} className="space-y-4">
            <div className="space-y-2">
              <Label>Proposal Note</Label>
              <Textarea
                placeholder="Describe why you're the best fit for this job..."
                value={proposalNote}
                onChange={(e) => setProposalNote(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProposalDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isApplying}>
                {isApplying ? "Sending..." : "Send Proposal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

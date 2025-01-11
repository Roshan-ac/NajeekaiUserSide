import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Loader2, Pencil, X, Plus } from "lucide-react";

interface Contact {
  id?: string;
  phoneNumber: string[];
  city: string;
  state: string;
  country: string;
  secondaryEmail: string;
}

interface FreelancerProfile {
  description?: string;
  skills?: string[];
  hourlyRate?: number;
  dailyRate?: number;
  availability?: boolean;
}

interface WorkExperience {
  id?: string;
  companyName: string;
  designation: string;
  location: string;
  joinedDate: string;
  endDate?: string;
}

export default function Profile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [newSkill, setNewSkill] = useState("");
  const [contact, setContact] = useState<Contact>({
    phoneNumber: [""],
    city: "",
    state: "",
    country: "",
    secondaryEmail: "",
  });
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile>(
    {
      description: "",
      skills: [],
      hourlyRate: 0,
      dailyRate: 0,
      availability: true,
    },
  );

  // Store user in state to prevent infinite rerenders
  const [user] = useState(getUser);

  // Fetch profile data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user || isLoading) return;

      try {
        setIsLoading(true);

        // Use Promise.all to fetch data concurrently
        const [avatarResponse, contactResponse] = await Promise.all([
          supabase
            .from("Avatar")
            .select("image")
            .eq(user.role === "client" ? "customerId" : "freelancerId", user.id)
            .single(),
          supabase
            .from("Contact")
            .select("*")
            .eq(user.role === "client" ? "customerId" : "freelancerId", user.id)
            .single(),
        ]);

        if (!isMounted) return;

        if (avatarResponse.data) {
          setAvatarUrl(avatarResponse.data.image);
        }

        if (contactResponse.data) {
          setContact(contactResponse.data);
        }

        // Only fetch freelancer data if user is a freelancer
        if (user.role === "freelancer") {
          const [profileResponse, skillsResponse] = await Promise.all([
            supabase
              .from("Freelancer")
              .select("description, hourlyRate, dailyRate, availability")
              .eq("id", user.id)
              .single(),
            supabase
              .from("SkillSet")
              .select("skillName")
              .eq("freelancerId", user.id),
          ]);

          if (!isMounted) return;

          if (profileResponse.data) {
            setFreelancerProfile((prev) => ({
              ...prev,
              ...profileResponse.data,
            }));
          }

          if (skillsResponse.data) {
            setFreelancerProfile((prev) => ({
              ...prev,
              skills: skillsResponse.data.map((s) => s.skillName),
            }));
          }
        }
      } catch (error: any) {
        if (!isMounted) return;

        if (!error.message?.includes("No rows found")) {
          console.error("Error fetching profile data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    setIsLoading(true);
    const file = e.target.files[0];

    try {
      // Check if avatar exists
      const { data: existingAvatar } = await supabase
        .from("Avatar")
        .select("id")
        .eq(user.role === "client" ? "customerId" : "freelancerId", user.id)
        .single();

      // Delete existing avatar from storage if any
      if (avatarUrl) {
        const oldFileName = avatarUrl.split("/").pop();
        if (oldFileName) {
          await supabase.storage.from("avatars").remove([oldFileName]);
        }
      }

      // Upload new avatar to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Prepare avatar data
      const avatarData = {
        image: publicUrl.publicUrl,
        ...(user.role === "client"
          ? { customerId: user.id }
          : { freelancerId: user.id }),
      };

      if (existingAvatar) {
        // Update existing avatar record
        const { error: dbError } = await supabase
          .from("Avatar")
          .update(avatarData)
          .eq("id", existingAvatar.id);

        if (dbError) throw dbError;
      } else {
        // Insert new avatar record
        const { error: dbError } = await supabase.from("Avatar").insert({
          id: crypto.randomUUID(),
          ...avatarData,
        });

        if (dbError) throw dbError;
      }

      setAvatarUrl(publicUrl.publicUrl);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update avatar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !avatarUrl) return;

    setIsLoading(true);
    try {
      const fileName = avatarUrl.split("/").pop();
      if (fileName) {
        await supabase.storage.from("avatars").remove([fileName]);
      }

      await supabase
        .from("Avatar")
        .delete()
        .eq(user.role === "client" ? "customerId" : "freelancerId", user.id);

      setAvatarUrl(undefined);
      toast({
        title: "Success",
        description: "Avatar removed successfully",
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove avatar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && newSkill.trim()) {
      e.preventDefault();
      const skillToAdd = newSkill.trim().replace(/,/g, "");
      setFreelancerProfile((prev) => ({
        ...prev,
        skills: [...new Set([...(prev.skills || []), skillToAdd])],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFreelancerProfile((prev) => ({
      ...prev,
      skills: prev.skills?.filter((skill) => skill !== skillToRemove) || [],
    }));
  };

  const handleToggleAvailability = async () => {
    if (!user || user.role !== "freelancer" || isLoading) return;

    setIsLoading(true);
    try {
      const newAvailability = !freelancerProfile.availability;

      const { error } = await supabase
        .from("Freelancer")
        .update({ availability: newAvailability })
        .eq("id", user.id);

      if (error) throw error;

      setFreelancerProfile((prev) => ({
        ...prev,
        availability: newAvailability,
      }));

      toast({
        title: "Success",
        description: `You are now ${newAvailability ? "available" : "unavailable"} for work`,
      });
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update availability",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBasicInfoUpdate = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First check if contact exists
      const { data: existingContact } = await supabase
        .from("Contact")
        .select("id")
        .eq(user.role === "client" ? "customerId" : "freelancerId", user.id)
        .single();

      // Update or insert contact information based on existence
      if (existingContact) {
        // Update existing contact
        const { error: contactError } = await supabase
          .from("Contact")
          .update({
            ...contact,
            ...(user.role === "client"
              ? { customerId: user.id }
              : { freelancerId: user.id }),
          })
          .eq("id", existingContact.id);

        if (contactError) throw contactError;
      } else {
        // Insert new contact
        const { error: contactError } = await supabase.from("Contact").insert({
          id: crypto.randomUUID(),
          ...contact,
          ...(user.role === "client"
            ? { customerId: user.id }
            : { freelancerId: user.id }),
        });

        if (contactError) throw contactError;
      }

      // Update freelancer specific information
      if (user.role === "freelancer") {
        // Update profile
        const { error: profileError } = await supabase
          .from("Freelancer")
          .update({
            description: freelancerProfile.description,
            hourlyRate: freelancerProfile.hourlyRate,
            dailyRate: freelancerProfile.dailyRate,
            availability: freelancerProfile.availability,
          })
          .eq("id", user.id);

        if (profileError) throw profileError;

        // Update skills
        if (freelancerProfile.skills?.length) {
          // Delete existing skills
          await supabase.from("SkillSet").delete().eq("freelancerId", user.id);

          // Insert new skills
          const { error: skillsError } = await supabase.from("SkillSet").insert(
            freelancerProfile.skills.map((skill) => ({
              id: crypto.randomUUID(),
              freelancerId: user.id,
              skillName: skill,
            })),
          );

          if (skillsError) throw skillsError;
        }
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-8">
          {/* Profile Header with Avatar and Edit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                  <img
                    src={
                      avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <div className="absolute -bottom-2 right-0 flex gap-1">
                    <label
                      htmlFor="avatar-upload"
                      className="p-1 rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
                    >
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isLoading}
                      />
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </label>
                    {avatarUrl && (
                      <button
                        onClick={handleRemoveAvatar}
                        className="p-1 rounded-full bg-red-500 hover:bg-red-600"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">
                    {user.firstName} {user.middleName} {user.lastName}
                  </h2>
                  {user.role === "freelancer" && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        freelancerProfile.availability
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                      onClick={handleToggleAvailability}
                    >
                      {freelancerProfile.availability
                        ? "Available for work"
                        : "Currently busy"}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                "Done Editing"
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Basic Information */}
          {isEditing ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Basic Information</h3>

              {user.role === "freelancer" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={freelancerProfile.description}
                      onChange={(e) =>
                        setFreelancerProfile((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Tell us about yourself and your expertise"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {freelancerProfile.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-primary/80"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type a skill and press Enter"
                        value={newSkill.replace(/,/g, "")}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleAddSkill}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          if (newSkill.trim()) {
                            handleAddSkill({
                              key: ",",
                              preventDefault: () => {},
                            } as React.KeyboardEvent<HTMLInputElement>);
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={freelancerProfile.hourlyRate}
                        onChange={(e) =>
                          setFreelancerProfile((prev) => ({
                            ...prev,
                            hourlyRate: parseFloat(e.target.value),
                          }))
                        }
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                      <Input
                        id="dailyRate"
                        type="number"
                        value={freelancerProfile.dailyRate}
                        onChange={(e) =>
                          setFreelancerProfile((prev) => ({
                            ...prev,
                            dailyRate: parseFloat(e.target.value),
                          }))
                        }
                        placeholder="400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={contact.phoneNumber[0]}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          phoneNumber: [e.target.value],
                        })
                      }
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-email">Secondary Email</Label>
                    <Input
                      id="secondary-email"
                      type="email"
                      value={contact.secondaryEmail}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          secondaryEmail: e.target.value,
                        })
                      }
                      placeholder="secondary@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={contact.city}
                      onChange={(e) =>
                        setContact({ ...contact, city: e.target.value })
                      }
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={contact.state}
                      onChange={(e) =>
                        setContact({ ...contact, state: e.target.value })
                      }
                      placeholder="NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={contact.country}
                      onChange={(e) =>
                        setContact({ ...contact, country: e.target.value })
                      }
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBasicInfoUpdate}
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                {user.role === "freelancer" && (
                  <>
                    {freelancerProfile.description && (
                      <p className="text-muted-foreground">
                        {freelancerProfile.description}
                      </p>
                    )}
                    {freelancerProfile.skills?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {freelancerProfile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Hourly Rate</Label>
                        <p className="text-muted-foreground">
                          ${freelancerProfile.hourlyRate}/hour
                        </p>
                      </div>
                      <div>
                        <Label>Daily Rate</Label>
                        <p className="text-muted-foreground">
                          ${freelancerProfile.dailyRate}/day
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-4">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {contact.phoneNumber[0] && (
                      <div>
                        <Label>Phone</Label>
                        <p className="text-muted-foreground">
                          {contact.phoneNumber[0]}
                        </p>
                      </div>
                    )}
                    {contact.secondaryEmail && (
                      <div>
                        <Label>Secondary Email</Label>
                        <p className="text-muted-foreground">
                          {contact.secondaryEmail}
                        </p>
                      </div>
                    )}
                    {contact.city && (
                      <div>
                        <Label>Location</Label>
                        <p className="text-muted-foreground">
                          {contact.city}, {contact.state}, {contact.country}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* History Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">History</h3>
            <div className="text-muted-foreground">
              {user.role === "client" ? (
                <p>Your service requests and bookings will appear here.</p>
              ) : (
                <p>Your completed jobs and reviews will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

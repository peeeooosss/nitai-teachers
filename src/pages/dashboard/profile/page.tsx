import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { useAuthState } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardProfile() {
  const { user } = useAuthState();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<any>("/api/users/me")
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await api.post("/api/users/onboarding");
      toast.success("Onboarding completed!");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {(user?.name ?? "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile && (
            <>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Subject Area</p>
                <p className="text-sm text-muted-foreground">
                  {profile.subjectArea ?? "Not set"}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Grade Level</p>
                <p className="text-sm text-muted-foreground">
                  {profile.gradeLevel ?? "Not set"}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Onboarding Complete</p>
                <p className="text-sm text-muted-foreground">
                  {profile.onboardingComplete ? "Yes" : "No"}
                </p>
              </div>
              {!profile.onboardingComplete && (
                <Button onClick={handleOnboardingComplete}>
                  Complete Onboarding
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage & Billing</CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm capitalize text-muted-foreground">
                {profile?.plan ?? "Free"}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard/pricing")}>
              Upgrade
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Content Generated</p>
              <p className="text-sm text-muted-foreground">
                {profile?.contentCount ?? 0} pieces
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

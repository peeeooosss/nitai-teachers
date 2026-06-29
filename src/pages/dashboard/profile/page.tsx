import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardProfile() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const [saving, setSaving] = useState(false);

  const handleCompleteOnboarding = async () => {
    setSaving(true);
    try {
      await completeOnboarding();
      toast.success("Onboarding completed");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
          <CardDescription>
            Your account information is synced from your authentication
            provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={currentUser?.name ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={currentUser?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <Input
              value={(currentUser?.plan ?? "free").toUpperCase()}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={(currentUser?.role ?? "user").toUpperCase()}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {!currentUser?.onboarded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Onboarding</CardTitle>
            <CardDescription>
              Complete your setup to get started with NITAI AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCompleteOnboarding} disabled={saving}>
              {saving ? "Saving..." : "Complete Onboarding"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

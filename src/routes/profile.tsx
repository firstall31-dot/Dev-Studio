import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader, PageContainer, PageSection } from "@/components/layout";
import { UserAvatar } from "@/components/ui/user-avatar";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForge } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Dev Studio" }] }),
  component: ProfilePage,
});

interface UserProfile {
  displayName: string;
  avatarUrl: string;
  location: string;
}

function ProfilePage() {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const { hardReset } = useForge();
  const [form, setForm] = useState<UserProfile>({ displayName: "", avatarUrl: "", location: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      displayName: authProfile.displayName ?? "",
      avatarUrl: authProfile.avatarUrl ?? "",
      location: authProfile.location ?? "",
    });
  }, [authProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      await refreshProfile();
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const displayedName = form.displayName || user?.name || "?";

  return (
    <PageContainer>
      <PageSection>
        <PageHeader
          icon={User}
          eyebrow="Account"
          title="Profile"
        />
      </PageSection>
      <div className="flex-1 min-h-0 rounded-2xl border border-border/60 bg-card overflow-y-auto p-4 sm:p-8">
        <div className="max-w-[600px] mx-auto space-y-6">

          {/* Avatar & name preview */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm flex items-center gap-4">
            <UserAvatar name={displayedName} avatarUrl={form.avatarUrl || null} size="lg" />
            <div>
              <p className="font-semibold">{displayedName}</p>
              {form.location ? (
                <p className="text-sm text-muted-foreground">{form.location}</p>
              ) : user?.name ? (
                <p className="text-sm text-muted-foreground">@{user.name}</p>
              ) : null}
            </div>
          </div>

          {/* Editable fields */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight">Edit Profile</h2>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Display name
              </label>
              <p className="text-[10px] text-muted-foreground mb-1">Your public name</p>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                placeholder={user?.name ?? "Enter display name…"}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Avatar URL
              </label>
              <input
                type="url"
                value={form.avatarUrl}
                onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                placeholder="https://example.com/avatar.png"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="City, Country"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-tight text-destructive">Danger Zone</h2>
            <div className="space-y-1">
              <p className="text-sm font-medium">Hard Reset Application</p>
              <p className="text-xs text-muted-foreground">
                This will clear all local settings, progress, and cache. Use this if you encounter duplicate data or synchronization issues.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm("Are you sure? This will reload the app and clear your local progress.")) {
                  hardReset();
                }
              }}
              className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Reset App Data
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Authentication is managed through your Replit account.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

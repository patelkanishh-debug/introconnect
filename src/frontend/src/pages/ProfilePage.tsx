import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useBackend } from "../hooks/useBackend";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Interest } from "../types";

const ALL_INTERESTS: { value: Interest; label: string; emoji: string }[] = [
  { value: Interest.Books, label: "Books", emoji: "📚" },
  { value: Interest.Gaming, label: "Gaming", emoji: "🎮" },
  { value: Interest.Music, label: "Music", emoji: "🎵" },
  { value: Interest.Sports, label: "Sports", emoji: "⚽" },
  { value: Interest.Art, label: "Art", emoji: "🎨" },
  { value: Interest.Tech, label: "Tech", emoji: "💻" },
  { value: Interest.Travel, label: "Travel", emoji: "✈️" },
  { value: Interest.Food, label: "Food", emoji: "🍜" },
];

export function ProfilePage() {
  const {
    profile,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useCurrentUser();
  const { backend } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isSetup = !profile?.displayName;

  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [selected, setSelected] = useState<Interest[]>(
    profile?.interests ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  // Pre-fill when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setSelected(profile.interests ?? []);
    }
  }, [profile]);

  const toggleInterest = (interest: Interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 3
          ? [...prev, interest]
          : prev,
    );
  };

  const validate = () => {
    const name = displayName.trim();
    if (!name) {
      setNameError("Please enter your first name");
      return false;
    }
    if (name.length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    if (name.length > 30) {
      setNameError("Name must be 30 characters or less");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSave = async () => {
    if (!validate() || !backend) return;
    setSaving(true);
    try {
      if (isSetup) {
        await backend.registerUser(displayName.trim(), selected);
      } else {
        await backend.updateProfile(displayName.trim(), selected);
      }
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(
        isSetup ? "Profile created! Welcome 🎉" : "Profile updated!",
      );
      if (isSetup) navigate({ to: "/explore" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading…</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    navigate({ to: "/welcome" });
    return null;
  }

  return (
    <Layout hideNav={isSetup}>
      <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-md mx-auto w-full">
        {/* Header */}
        <motion.div
          className="w-full text-center mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isSetup ? (
            <>
              <div className="text-4xl mb-3">👋</div>
              <h1 className="font-display text-2xl font-semibold text-foreground mb-1">
                Set up your profile
              </h1>
              <p className="text-muted-foreground text-sm">
                Just your first name — no email, no personal info needed.
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-2xl mx-auto mb-3">
                {displayName ? displayName[0].toUpperCase() : "?"}
              </div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Edit Profile
              </h1>
            </>
          )}
        </motion.div>

        {/* Name field */}
        <motion.div
          className="w-full mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Label
            htmlFor="display-name"
            className="text-sm font-medium mb-2 block"
          >
            Your first name
          </Label>
          <Input
            id="display-name"
            data-ocid="profile-name-input"
            placeholder="e.g. Alex"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (nameError) setNameError("");
            }}
            onBlur={validate}
            maxLength={30}
            className="h-12 rounded-xl text-base"
          />
          {nameError && (
            <p className="mt-1.5 text-sm text-destructive">{nameError}</p>
          )}
        </motion.div>

        {/* Interest picker */}
        <motion.div
          className="w-full mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3">
            <Label className="text-sm font-medium">Your interests</Label>
            <span className="text-xs text-muted-foreground">
              {selected.length}/3 selected
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ALL_INTERESTS.map((item, i) => {
              const isSelected = selected.includes(item.value);
              const isDisabled = !isSelected && selected.length >= 3;
              return (
                <motion.button
                  key={item.value}
                  data-ocid={`interest-${item.value.toLowerCase()}`}
                  type="button"
                  onClick={() => toggleInterest(item.value)}
                  disabled={isDisabled}
                  className={[
                    "flex flex-col items-center gap-1 py-3 rounded-xl border text-sm font-medium transition-smooth",
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : isDisabled
                        ? "opacity-40 cursor-not-allowed bg-muted/40 border-border text-muted-foreground"
                        : "bg-card border-border text-foreground hover:bg-muted/50",
                  ].join(" ")}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
          {selected.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Pick up to 3 — we'll find people who share them.
            </p>
          )}
        </motion.div>

        {/* Selected interests summary */}
        {selected.length > 0 && (
          <motion.div
            className="w-full mb-6 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {selected.map((interest) => {
              const meta = ALL_INTERESTS.find((i) => i.value === interest);
              return (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {meta?.emoji} {meta?.label}
                </Badge>
              );
            })}
          </motion.div>
        )}

        {/* Save button */}
        <motion.div
          className="w-full space-y-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Button
            data-ocid="profile-save-btn"
            onClick={handleSave}
            disabled={saving || !displayName.trim()}
            className="w-full h-12 text-base font-semibold rounded-xl"
            size="lg"
          >
            {saving
              ? "Saving…"
              : isSetup
                ? "Start connecting ✨"
                : "Save changes"}
          </Button>

          {/* Logout (only on edit, not setup) */}
          {!isSetup && (
            <Button
              data-ocid="profile-logout-btn"
              variant="ghost"
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              Sign out
            </Button>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}

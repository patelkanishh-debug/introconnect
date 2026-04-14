import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, RefreshCw, Shuffle, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { useBackend } from "../hooks/useBackend";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Interest } from "../types";

// Interest emoji map for warm visual identity
const INTEREST_EMOJI: Record<Interest, string> = {
  [Interest.Art]: "🎨",
  [Interest.Food]: "🍜",
  [Interest.Tech]: "💻",
  [Interest.Books]: "📚",
  [Interest.Travel]: "✈️",
  [Interest.Gaming]: "🎮",
  [Interest.Music]: "🎵",
  [Interest.Sports]: "⚽",
};

type MatchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; chatId: bigint }
  | { status: "none" };

export function ExplorePage() {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useCurrentUser();
  const { backend, isLoading: backendLoading } = useBackend();
  const [matchState, setMatchState] = useState<MatchState>({ status: "idle" });

  const interests: Interest[] = profile?.interests ?? [];

  const handleFindMatch = async () => {
    if (!backend) return;
    setMatchState({ status: "loading" });
    try {
      const result = await backend.findNewMatch();
      if (result !== null && result !== undefined) {
        setMatchState({ status: "found", chatId: result });
      } else {
        setMatchState({ status: "none" });
      }
    } catch {
      setMatchState({ status: "none" });
    }
  };

  const handleStartChat = () => {
    if (matchState.status !== "found") return;
    navigate({
      to: "/chats/$chatId",
      params: { chatId: String(matchState.chatId) },
    });
  };

  const handleReset = () => setMatchState({ status: "idle" });

  return (
    <Layout>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 py-6 gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Find a Match ✨
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            We'll find someone who shares your vibe
          </p>
        </motion.div>

        {/* Interests section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Your interests
          </p>

          {profileLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 rounded-full bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : interests.length > 0 ? (
            <div
              className="flex flex-wrap gap-2"
              data-ocid="explore-interest-pills"
            >
              {interests.map((interest, idx) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-sm px-3 py-1 rounded-full gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-smooth"
                  >
                    <span>{INTEREST_EMOJI[interest]}</span>
                    {interest}
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No interests set yet.{" "}
              <button
                type="button"
                onClick={() => navigate({ to: "/profile" })}
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-smooth"
              >
                Add some in your profile
              </button>
            </p>
          )}
        </motion.section>

        {/* Match result card */}
        <AnimatePresence mode="wait">
          {matchState.status === "found" && (
            <motion.div
              key="found"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -12 }}
              transition={{ duration: 0.35, type: "spring", bounce: 0.3 }}
              className="bg-card rounded-2xl border border-primary/25 p-5 shadow-sm"
              data-ocid="match-result-card"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg flex-shrink-0">
                  🎉
                </div>
                <div>
                  <p className="font-semibold text-foreground">Match found!</p>
                  <p className="text-sm text-muted-foreground">
                    Someone with similar interests is ready to chat
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2 transition-smooth"
                  onClick={handleStartChat}
                  data-ocid="start-chat-btn"
                >
                  <MessageCircle className="w-4 h-4" />
                  Start Chatting
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="border-border transition-smooth"
                  data-ocid="reset-match-btn"
                  aria-label="Find another match"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {matchState.status === "none" && (
            <motion.div
              key="none"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-muted/40 rounded-2xl border border-border p-5 text-center"
              data-ocid="no-match-result"
            >
              <div className="text-3xl mb-2">🌱</div>
              <p className="font-medium text-foreground">No match right now</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                The community is still growing — try a random match or check
                back soon!
              </p>
              <Button
                variant="outline"
                className="gap-2 transition-smooth"
                onClick={handleReset}
                data-ocid="try-again-btn"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main action buttons */}
        {(matchState.status === "idle" || matchState.status === "loading") && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <Button
              size="lg"
              className="w-full gap-2.5 text-base font-semibold py-6 rounded-2xl shadow-md transition-smooth hover:shadow-lg"
              onClick={handleFindMatch}
              disabled={matchState.status === "loading" || backendLoading}
              data-ocid="find-match-btn"
            >
              {matchState.status === "loading" ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Finding your match…
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Find a Match
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2.5 text-base py-6 rounded-2xl border-border transition-smooth"
              onClick={handleFindMatch}
              disabled={matchState.status === "loading" || backendLoading}
              data-ocid="random-match-btn"
            >
              <Shuffle className="w-5 h-5" />
              Surprise Me
            </Button>
          </motion.div>
        )}

        {/* Chats hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-center"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/chats" })}
            className="text-sm text-muted-foreground hover:text-primary transition-smooth inline-flex items-center gap-1.5"
            data-ocid="view-chats-link"
          >
            <MessageCircle className="w-4 h-4" />
            View your active chats
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}

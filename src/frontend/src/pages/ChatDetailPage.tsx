import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, RefreshCw, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { useBackend } from "../hooks/useBackend";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { usePolling } from "../hooks/usePolling";
import type {
  ChatId,
  IcebreakerPrompt,
  MessageId,
  MessagePublic,
} from "../types";

const EMOJI_REACTIONS = ["😂", "❤️", "👍", "🔥", "😮", "👏"] as const;

function formatTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Icebreaker Banner ────────────────────────────────────────────────────────
function IcebreakerBanner({
  prompt,
  onRefresh,
  isRefreshing,
}: {
  prompt: IcebreakerPrompt;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid="icebreaker-banner"
      className="mx-4 mt-3 mb-1 bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3 flex items-start gap-3"
    >
      <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={15} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary mb-0.5">Icebreaker</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={String(prompt.id)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-foreground/85 leading-snug"
          >
            {prompt.text}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        data-ocid="icebreaker-refresh"
        aria-label="Get a new icebreaker prompt"
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-primary/15 transition-smooth disabled:opacity-50"
      >
        <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
      </button>
    </motion.div>
  );
}

// ─── Reaction Row ─────────────────────────────────────────────────────────────
function ReactionRow({
  message,
  isSent,
  onReact,
}: {
  message: MessagePublic;
  isSent: boolean;
  onReact: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const counts = message.reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});

  const hasReactions = Object.keys(counts).length > 0;

  return (
    <div
      className={`flex flex-col gap-1 ${isSent ? "items-end" : "items-start"}`}
    >
      {hasReactions && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(counts).map(([emoji, count]) => (
            <button
              type="button"
              key={emoji}
              onClick={() => onReact(emoji)}
              data-ocid={`reaction-${emoji}`}
              className="emoji-reaction text-base"
            >
              {emoji}
              {count > 1 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          data-ocid="reaction-add"
          aria-label="Add reaction"
          className="text-xs text-muted-foreground hover:text-foreground transition-smooth opacity-50 hover:opacity-100 focus:opacity-100 px-1"
        >
          +😊
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-10 bottom-full mb-1 bg-card border border-border rounded-2xl shadow-lg p-1.5 flex gap-1 ${isSent ? "right-0" : "left-0"}`}
            >
              {EMOJI_REACTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    onReact(emoji);
                    setOpen(false);
                  }}
                  data-ocid={`reaction-picker-${emoji}`}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-lg hover:bg-muted/60 transition-smooth"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  message,
  isSent,
  senderName,
  onReact,
  index,
}: {
  message: MessagePublic;
  isSent: boolean;
  senderName: string;
  onReact: (emoji: string) => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.03, 0.3) }}
      data-ocid={`message-${message.id}`}
      className={`group flex flex-col gap-1 max-w-[78%] ${isSent ? "self-end items-end" : "self-start items-start"}`}
    >
      <div
        className={`flex items-center gap-1.5 px-1 ${isSent ? "flex-row-reverse" : ""}`}
      >
        <span className="text-xs font-semibold text-foreground/70 truncate max-w-[120px]">
          {senderName}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {formatTime(message.sentAt)}
        </span>
      </div>

      <div
        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
          ${
            isSent
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border text-foreground rounded-tl-sm"
          }`}
      >
        {message.text}
      </div>

      <ReactionRow message={message} isSent={isSent} onReact={onReact} />
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ChatDetailPage() {
  const { chatId: chatIdStr } = useParams({ from: "/chats/$chatId" });
  const chatId: ChatId = BigInt(chatIdStr);

  const { isAuthenticated, identity } = useCurrentUser();
  const { backend, isLoading: backendLoading } = useBackend();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const myPrincipalStr = identity?.getPrincipal().toText() ?? "";

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: messages, isLoading: msgsLoading } = useQuery<MessagePublic[]>({
    queryKey: ["messages", chatIdStr],
    queryFn: async () => {
      if (!backend) return [];
      return backend.getChatMessages(chatId);
    },
    enabled: isAuthenticated && !!backend && !backendLoading,
    staleTime: 2500,
  });

  const { data: prompt, isLoading: promptLoading } = useQuery<IcebreakerPrompt>(
    {
      queryKey: ["icebreaker", chatIdStr],
      queryFn: async () => {
        if (!backend) throw new Error("no backend");
        return backend.getIcebreakerPrompt(chatId);
      },
      enabled: isAuthenticated && !!backend && !backendLoading,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

  // ── Polling ────────────────────────────────────────────────────────────────
  usePolling([["messages", chatIdStr]], 3000);

  // ── Mark as read on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!backend || !isAuthenticated) return;
    void backend.markMessagesRead(chatId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    });
  }, [backend, isAuthenticated, chatId, queryClient]);

  // ── Auto-scroll on new messages ────────────────────────────────────────────
  const messageCount = messages?.length;
  useEffect(() => {
    if (messageCount) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageCount]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const sendMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!backend) throw new Error("no backend");
      return backend.sendMessage(chatId, messageText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatIdStr] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const refreshPromptMutation = useMutation({
    mutationFn: async () => {
      if (!backend || !prompt) throw new Error("no backend");
      return backend.refreshIcebreakerPrompt(chatId, prompt.id);
    },
    onSuccess: (newPrompt) => {
      queryClient.setQueryData(["icebreaker", chatIdStr], newPrompt);
    },
  });

  const reactMutation = useMutation({
    mutationFn: async ({
      messageId,
      emoji,
    }: { messageId: MessageId; emoji: string }) => {
      if (!backend) throw new Error("no backend");
      return backend.addReaction(chatId, messageId, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatIdStr] });
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    setText("");
    sendMutation.mutate(trimmed);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Derive partner display name from chats list cache
  const cachedChats = queryClient.getQueryData<
    Array<{ chatId: ChatId; partnerDisplayName: string }>
  >(["chats"]);
  const partnerDisplayName =
    cachedChats?.find((c) => String(c.chatId) === chatIdStr)
      ?.partnerDisplayName ?? "Chat";

  return (
    <Layout>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
          <Link
            to="/chats"
            data-ocid="chat-back"
            aria-label="Back to chats"
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted/60 transition-smooth text-foreground/70"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-base font-semibold text-foreground truncate">
              {partnerDisplayName}
            </h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>

        {/* Icebreaker */}
        {!promptLoading && prompt && (
          <IcebreakerBanner
            prompt={prompt}
            onRefresh={() => refreshPromptMutation.mutate()}
            isRefreshing={refreshPromptMutation.isPending}
          />
        )}

        {/* Messages area */}
        <div
          data-ocid="messages-area"
          className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-background/60"
          style={{ minHeight: 0 }}
        >
          {msgsLoading ? (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <div className="space-y-1 max-w-[60%]">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : !messages || messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="messages-empty-state"
              className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center"
            >
              <div className="text-4xl">✨</div>
              <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
                No messages yet. Say hello and use the icebreaker above to get
                the conversation started!
              </p>
            </motion.div>
          ) : (
            messages.map((msg, i) => {
              const isSent = msg.senderId.toText() === myPrincipalStr;
              return (
                <MessageBubble
                  key={String(msg.id)}
                  message={msg}
                  isSent={isSent}
                  senderName={isSent ? "You" : partnerDisplayName}
                  onReact={(emoji) =>
                    reactMutation.mutate({ messageId: msg.id, emoji })
                  }
                  index={i}
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div
          data-ocid="message-input-bar"
          className="bg-card border-t border-border px-4 py-3 flex items-center gap-3"
          style={{
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something kind…"
            maxLength={1000}
            data-ocid="message-input"
            className="flex-1 bg-muted/40 border border-input rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/50 transition-smooth min-w-0"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sendMutation.isPending}
            data-ocid="message-send"
            aria-label="Send message"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send
              size={16}
              className={sendMutation.isPending ? "opacity-60" : ""}
            />
          </button>
        </div>
      </div>
    </Layout>
  );
}

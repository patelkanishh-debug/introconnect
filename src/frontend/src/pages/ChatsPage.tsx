import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Compass, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Layout } from "../components/Layout";
import { useBackend } from "../hooks/useBackend";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { usePolling } from "../hooks/usePolling";
import type { ChatSummary } from "../types";

function formatRelativeTime(ts: bigint): string {
  const nowMs = Date.now();
  const thenMs = Number(ts) / 1_000_000; // nanoseconds → ms
  const diffSec = Math.floor((nowMs - thenMs) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function ChatCard({ chat, index }: { chat: ChatSummary; index: number }) {
  const hasUnread = chat.unreadCount > 0n;
  const initial = chat.partnerDisplayName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06 }}
    >
      <Link
        to="/chats/$chatId"
        params={{ chatId: String(chat.chatId) }}
        data-ocid={`chat-card-${chat.chatId}`}
        className="flex items-center gap-3.5 px-4 py-3.5 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-smooth active:scale-[0.99] group"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold font-display flex-shrink-0 transition-smooth
            ${
              hasUnread
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-secondary/40"
            }`}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-sm font-semibold truncate ${hasUnread ? "text-foreground" : "text-foreground/80"}`}
            >
              {chat.partnerDisplayName}
            </span>
            {chat.lastMessageAt != null && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatRelativeTime(chat.lastMessageAt)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-0.5 gap-2">
            <p
              className={`text-xs truncate ${hasUnread ? "text-foreground/70 font-medium" : "text-muted-foreground"}`}
            >
              {chat.lastMessageText ?? "Start the conversation ✨"}
            </p>
            {hasUnread && (
              <span
                data-ocid="unread-badge"
                className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold leading-none flex-shrink-0"
              >
                {chat.unreadCount > 99n ? "99+" : String(chat.unreadCount)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3.5 px-4 py-3.5 bg-card rounded-2xl border border-border"
        >
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3 rounded-md" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatsPage() {
  const { isAuthenticated } = useCurrentUser();
  const { backend, isLoading: backendLoading } = useBackend();

  const { data: chats, isLoading } = useQuery<ChatSummary[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listChats();
    },
    enabled: isAuthenticated && !!backend && !backendLoading,
    staleTime: 4000,
  });

  usePolling([["chats"]], 5000);

  return (
    <Layout>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Active Chats
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {chats && chats.length > 0
                ? `${chats.length} conversation${chats.length !== 1 ? "s" : ""}`
                : "Your conversations live here"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle size={18} className="text-primary" />
          </div>
        </motion.div>

        {isLoading ? (
          <ChatListSkeleton />
        ) : !chats || chats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            data-ocid="chats-empty-state"
            className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-16"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center text-4xl">
              💬
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display text-xl font-semibold text-foreground">
                No chats yet
              </h2>
              <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
                Explore new connections and start a conversation with someone
                interesting.
              </p>
            </div>
            <Link
              to="/explore"
              data-ocid="chats-explore-cta"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-smooth"
            >
              <Compass size={16} />
              Explore People
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3" data-ocid="chats-list">
            {chats.map((chat, i) => (
              <ChatCard key={String(chat.chatId)} chat={chat} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

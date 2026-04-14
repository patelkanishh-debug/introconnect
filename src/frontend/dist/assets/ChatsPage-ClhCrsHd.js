import { u as useCurrentUser, b as useBackend, d as useQuery, j as jsxRuntimeExports, L as Layout, M as MessageCircle, e as Link, C as Compass, S as Skeleton } from "./index-DSt5PXRa.js";
import { u as usePolling } from "./usePolling-DGGh1DED.js";
import { m as motion } from "./proxy-CuX_jfbq.js";
function formatRelativeTime(ts) {
  const nowMs = Date.now();
  const thenMs = Number(ts) / 1e6;
  const diffSec = Math.floor((nowMs - thenMs) / 1e3);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}
function ChatCard({ chat, index }) {
  const hasUnread = chat.unreadCount > 0n;
  const initial = chat.partnerDisplayName.charAt(0).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.28, delay: index * 0.06 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/chats/$chatId",
          params: { chatId: String(chat.chatId) },
          "data-ocid": `chat-card-${chat.chatId}`,
          className: "flex items-center gap-3.5 px-4 py-3.5 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-smooth active:scale-[0.99] group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold font-display flex-shrink-0 transition-smooth
            ${hasUnread ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-secondary/40"}`,
                children: initial
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-sm font-semibold truncate ${hasUnread ? "text-foreground" : "text-foreground/80"}`,
                    children: chat.partnerDisplayName
                  }
                ),
                chat.lastMessageAt != null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0", children: formatRelativeTime(chat.lastMessageAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-0.5 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-xs truncate ${hasUnread ? "text-foreground/70 font-medium" : "text-muted-foreground"}`,
                    children: chat.lastMessageText ?? "Start the conversation ✨"
                  }
                ),
                hasUnread && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    "data-ocid": "unread-badge",
                    className: "min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold leading-none flex-shrink-0",
                    children: chat.unreadCount > 99n ? "99+" : String(chat.unreadCount)
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function ChatListSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3.5 px-4 py-3.5 bg-card rounded-2xl border border-border",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-1/3 rounded-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3 rounded-md" })
        ] })
      ]
    },
    i
  )) });
}
function ChatsPage() {
  const { isAuthenticated } = useCurrentUser();
  const { backend, isLoading: backendLoading } = useBackend();
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listChats();
    },
    enabled: isAuthenticated && !!backend && !backendLoading,
    staleTime: 4e3
  });
  usePolling([["chats"]], 5e3);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: "Active Chats" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: chats && chats.length > 0 ? `${chats.length} conversation${chats.length !== 1 ? "s" : ""}` : "Your conversations live here" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 18, className: "text-primary" }) })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChatListSkeleton, {}) : !chats || chats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.35, delay: 0.1 },
        "data-ocid": "chats-empty-state",
        className: "flex-1 flex flex-col items-center justify-center text-center gap-5 py-16",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center text-4xl", children: "💬" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "No chats yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-[260px] leading-relaxed", children: "Explore new connections and start a conversation with someone interesting." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/explore",
              "data-ocid": "chats-explore-cta",
              className: "inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { size: 16 }),
                "Explore People"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", "data-ocid": "chats-list", children: chats.map((chat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ChatCard, { chat, index: i }, String(chat.chatId))) })
  ] }) });
}
export {
  ChatsPage
};

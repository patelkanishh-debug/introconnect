import { c as createLucideIcon, a as useNavigate, u as useCurrentUser, b as useBackend, r as reactExports, j as jsxRuntimeExports, L as Layout, B as Button, M as MessageCircle, I as Interest } from "./index-DSt5PXRa.js";
import { B as Badge } from "./badge-D55NJUIZ.js";
import { m as motion } from "./proxy-CuX_jfbq.js";
import { A as AnimatePresence, R as RefreshCw, S as Sparkles } from "./index-DKpAPT3E.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
  ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
];
const Shuffle = createLucideIcon("shuffle", __iconNode);
const INTEREST_EMOJI = {
  [Interest.Art]: "🎨",
  [Interest.Food]: "🍜",
  [Interest.Tech]: "💻",
  [Interest.Books]: "📚",
  [Interest.Travel]: "✈️",
  [Interest.Gaming]: "🎮",
  [Interest.Music]: "🎵",
  [Interest.Sports]: "⚽"
};
function ExplorePage() {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useCurrentUser();
  const { backend, isLoading: backendLoading } = useBackend();
  const [matchState, setMatchState] = reactExports.useState({ status: "idle" });
  const interests = (profile == null ? void 0 : profile.interests) ?? [];
  const handleFindMatch = async () => {
    if (!backend) return;
    setMatchState({ status: "loading" });
    try {
      const result = await backend.findNewMatch();
      if (result !== null && result !== void 0) {
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
      params: { chatId: String(matchState.chatId) }
    });
  };
  const handleReset = () => setMatchState({ status: "idle" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col max-w-md mx-auto w-full px-5 py-6 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: "Find a Match ✨" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "We'll find someone who shares your vibe" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.1 },
        className: "bg-card rounded-2xl border border-border p-5 shadow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Your interests" }),
          profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-8 w-20 rounded-full bg-muted animate-pulse"
            },
            i
          )) }) : interests.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-wrap gap-2",
              "data-ocid": "explore-interest-pills",
              children: interests.map((interest, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.85 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: idx * 0.06 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-sm px-3 py-1 rounded-full gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: INTEREST_EMOJI[interest] }),
                        interest
                      ]
                    }
                  )
                },
                interest
              ))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "No interests set yet.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: "/profile" }),
                className: "text-primary underline underline-offset-2 hover:text-primary/80 transition-smooth",
                children: "Add some in your profile"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      matchState.status === "found" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.94, y: 12 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.94, y: -12 },
          transition: { duration: 0.35, type: "spring", bounce: 0.3 },
          className: "bg-card rounded-2xl border border-primary/25 p-5 shadow-sm",
          "data-ocid": "match-result-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg flex-shrink-0", children: "🎉" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Match found!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Someone with similar interests is ready to chat" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "flex-1 gap-2 transition-smooth",
                  onClick: handleStartChat,
                  "data-ocid": "start-chat-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
                    "Start Chatting"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  onClick: handleReset,
                  className: "border-border transition-smooth",
                  "data-ocid": "reset-match-btn",
                  "aria-label": "Find another match",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
                }
              )
            ] })
          ]
        },
        "found"
      ),
      matchState.status === "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -12 },
          transition: { duration: 0.3 },
          className: "bg-muted/40 rounded-2xl border border-border p-5 text-center",
          "data-ocid": "no-match-result",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-2", children: "🌱" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No match right now" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: "The community is still growing — try a random match or check back soon!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "gap-2 transition-smooth",
                onClick: handleReset,
                "data-ocid": "try-again-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                  "Try again"
                ]
              }
            )
          ]
        },
        "none"
      )
    ] }),
    (matchState.status === "idle" || matchState.status === "loading") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.2 },
        className: "flex flex-col gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              className: "w-full gap-2.5 text-base font-semibold py-6 rounded-2xl shadow-md transition-smooth hover:shadow-lg",
              onClick: handleFindMatch,
              disabled: matchState.status === "loading" || backendLoading,
              "data-ocid": "find-match-btn",
              children: matchState.status === "loading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5 animate-spin" }),
                "Finding your match…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5" }),
                "Find a Match"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "lg",
              className: "w-full gap-2.5 text-base py-6 rounded-2xl border-border transition-smooth",
              onClick: handleFindMatch,
              disabled: matchState.status === "loading" || backendLoading,
              "data-ocid": "random-match-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "w-5 h-5" }),
                "Surprise Me"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, delay: 0.35 },
        className: "text-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/chats" }),
            className: "text-sm text-muted-foreground hover:text-primary transition-smooth inline-flex items-center gap-1.5",
            "data-ocid": "view-chats-link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
              "View your active chats"
            ]
          }
        )
      }
    )
  ] }) });
}
export {
  ExplorePage
};

import { u as useCurrentUser, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, B as Button } from "./index-DSt5PXRa.js";
import { m as motion } from "./proxy-CuX_jfbq.js";
const interestEmojis = ["📚", "🎮", "🎵", "⚽", "🎨", "💻", "✈️", "🍜"];
function WelcomePage() {
  const { isAuthenticated, isLoading, login, profile } = useCurrentUser();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    if (!(profile == null ? void 0 : profile.displayName)) {
      navigate({ to: "/profile" });
    } else {
      navigate({ to: "/explore" });
    }
  }, [isAuthenticated, isLoading, profile, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { hideNav: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-3rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
        className: "flex gap-2 mb-8",
        children: interestEmojis.map((emoji, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.span,
          {
            className: "text-2xl select-none",
            animate: { y: [0, -6, 0] },
            transition: {
              duration: 2.4,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            },
            children: emoji
          },
          emoji
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "text-center max-w-sm space-y-4 mb-10",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.15, ease: "easeOut" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold leading-tight text-foreground", children: [
            "Meet people who ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "get you" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base leading-relaxed", children: "IntroConnect is a low-pressure space to meet new people based on shared interests — no awkward small talk, just real connections." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "flex flex-wrap justify-center gap-2 mb-10 max-w-xs",
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
        children: [
          "✨ Name-only, no pressure",
          "🎯 Interest matching",
          "💬 Icebreaker prompts",
          "🎲 Random match option"
        ].map((pill) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground border border-border",
            children: pill
          },
          pill
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "w-full max-w-xs space-y-3",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.45, ease: "easeOut" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "welcome-login-btn",
              onClick: () => login(),
              disabled: isLoading,
              className: "w-full h-12 text-base font-semibold rounded-xl",
              size: "lg",
              children: isLoading ? "Signing in…" : "Get started — it's free"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Secure login via Internet Identity · No email required" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.p,
      {
        className: "mt-8 text-sm text-muted-foreground text-center",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, delay: 0.65 },
        children: "Open to everyone — introverts, extroverts & everyone in between 🌈"
      }
    )
  ] }) });
}
export {
  WelcomePage
};

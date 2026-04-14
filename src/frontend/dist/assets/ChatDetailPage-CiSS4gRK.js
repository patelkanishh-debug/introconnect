var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { f as Subscribable, s as shallowEqualObjects, h as hashKey, g as getDefaultState, n as notifyManager, i as useQueryClient, r as reactExports, k as noop, l as shouldThrowError, c as createLucideIcon, m as useParams, u as useCurrentUser, b as useBackend, d as useQuery, j as jsxRuntimeExports, L as Layout, e as Link, S as Skeleton } from "./index-DSt5PXRa.js";
import { u as usePolling } from "./usePolling-DGGh1DED.js";
import { m as motion } from "./proxy-CuX_jfbq.js";
import { S as Sparkles, A as AnimatePresence, R as RefreshCw } from "./index-DKpAPT3E.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const EMOJI_REACTIONS = ["😂", "❤️", "👍", "🔥", "😮", "👏"];
function formatTime(ts) {
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function IcebreakerBanner({
  prompt,
  onRefresh,
  isRefreshing
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      "data-ocid": "icebreaker-banner",
      className: "mx-4 mt-3 mb-1 bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3 flex items-start gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 15, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary mb-0.5", children: "Icebreaker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -4 },
              transition: { duration: 0.2 },
              className: "text-sm text-foreground/85 leading-snug",
              children: prompt.text
            },
            String(prompt.id)
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onRefresh,
            disabled: isRefreshing,
            "data-ocid": "icebreaker-refresh",
            "aria-label": "Get a new icebreaker prompt",
            className: "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-primary/15 transition-smooth disabled:opacity-50",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: isRefreshing ? "animate-spin" : "" })
          }
        )
      ]
    }
  );
}
function ReactionRow({
  message,
  isSent,
  onReact
}) {
  const [open, setOpen] = reactExports.useState(false);
  const counts = message.reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});
  const hasReactions = Object.keys(counts).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex flex-col gap-1 ${isSent ? "items-end" : "items-start"}`,
      children: [
        hasReactions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: Object.entries(counts).map(([emoji, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onReact(emoji),
            "data-ocid": `reaction-${emoji}`,
            className: "emoji-reaction text-base",
            children: [
              emoji,
              count > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground", children: count })
            ]
          },
          emoji
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setOpen((v) => !v),
              "data-ocid": "reaction-add",
              "aria-label": "Add reaction",
              className: "text-xs text-muted-foreground hover:text-foreground transition-smooth opacity-50 hover:opacity-100 focus:opacity-100 px-1",
              children: "+😊"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.85, y: 6 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.85, y: 6 },
              transition: { duration: 0.15 },
              className: `absolute z-10 bottom-full mb-1 bg-card border border-border rounded-2xl shadow-lg p-1.5 flex gap-1 ${isSent ? "right-0" : "left-0"}`,
              children: EMOJI_REACTIONS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    onReact(emoji);
                    setOpen(false);
                  },
                  "data-ocid": `reaction-picker-${emoji}`,
                  className: "w-8 h-8 flex items-center justify-center rounded-xl text-lg hover:bg-muted/60 transition-smooth",
                  children: emoji
                },
                emoji
              ))
            }
          ) })
        ] })
      ]
    }
  );
}
function MessageBubble({
  message,
  isSent,
  senderName,
  onReact,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12, scale: 0.97 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.22, delay: Math.min(index * 0.03, 0.3) },
      "data-ocid": `message-${message.id}`,
      className: `group flex flex-col gap-1 max-w-[78%] ${isSent ? "self-end items-end" : "self-start items-start"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center gap-1.5 px-1 ${isSent ? "flex-row-reverse" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground/70 truncate max-w-[120px]", children: senderName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: formatTime(message.sentAt) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words
          ${isSent ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border text-foreground rounded-tl-sm"}`,
            children: message.text
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReactionRow, { message, isSent, onReact })
      ]
    }
  );
}
function ChatDetailPage() {
  var _a2;
  const { chatId: chatIdStr } = useParams({ from: "/chats/$chatId" });
  const chatId = BigInt(chatIdStr);
  const { isAuthenticated, identity } = useCurrentUser();
  const { backend, isLoading: backendLoading } = useBackend();
  const queryClient = useQueryClient();
  const messagesEndRef = reactExports.useRef(null);
  const [text, setText] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const myPrincipalStr = (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "";
  const { data: messages, isLoading: msgsLoading } = useQuery({
    queryKey: ["messages", chatIdStr],
    queryFn: async () => {
      if (!backend) return [];
      return backend.getChatMessages(chatId);
    },
    enabled: isAuthenticated && !!backend && !backendLoading,
    staleTime: 2500
  });
  const { data: prompt, isLoading: promptLoading } = useQuery(
    {
      queryKey: ["icebreaker", chatIdStr],
      queryFn: async () => {
        if (!backend) throw new Error("no backend");
        return backend.getIcebreakerPrompt(chatId);
      },
      enabled: isAuthenticated && !!backend && !backendLoading,
      staleTime: Number.POSITIVE_INFINITY
    }
  );
  usePolling([["messages", chatIdStr]], 3e3);
  reactExports.useEffect(() => {
    if (!backend || !isAuthenticated) return;
    void backend.markMessagesRead(chatId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    });
  }, [backend, isAuthenticated, chatId, queryClient]);
  const messageCount = messages == null ? void 0 : messages.length;
  reactExports.useEffect(() => {
    var _a3;
    if (messageCount) {
      (_a3 = messagesEndRef.current) == null ? void 0 : _a3.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageCount]);
  const sendMutation = useMutation({
    mutationFn: async (messageText) => {
      if (!backend) throw new Error("no backend");
      return backend.sendMessage(chatId, messageText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatIdStr] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  });
  const refreshPromptMutation = useMutation({
    mutationFn: async () => {
      if (!backend || !prompt) throw new Error("no backend");
      return backend.refreshIcebreakerPrompt(chatId, prompt.id);
    },
    onSuccess: (newPrompt) => {
      queryClient.setQueryData(["icebreaker", chatIdStr], newPrompt);
    }
  });
  const reactMutation = useMutation({
    mutationFn: async ({
      messageId,
      emoji
    }) => {
      if (!backend) throw new Error("no backend");
      return backend.addReaction(chatId, messageId, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatIdStr] });
    }
  });
  const handleSend = () => {
    var _a3;
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    setText("");
    sendMutation.mutate(trimmed);
    (_a3 = inputRef.current) == null ? void 0 : _a3.focus();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const cachedChats = queryClient.getQueryData(["chats"]);
  const partnerDisplayName = ((_a2 = cachedChats == null ? void 0 : cachedChats.find((c) => String(c.chatId) === chatIdStr)) == null ? void 0 : _a2.partnerDisplayName) ?? "Chat";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col max-w-lg mx-auto w-full h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/chats",
          "data-ocid": "chat-back",
          "aria-label": "Back to chats",
          className: "w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted/60 transition-smooth text-foreground/70",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground truncate", children: partnerDisplayName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active now" })
      ] })
    ] }),
    !promptLoading && prompt && /* @__PURE__ */ jsxRuntimeExports.jsx(
      IcebreakerBanner,
      {
        prompt,
        onRefresh: () => refreshPromptMutation.mutate(),
        isRefreshing: refreshPromptMutation.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "messages-area",
        className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-background/60",
        style: { minHeight: 0 },
        children: [
          msgsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-w-[60%]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16 rounded-md" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-2xl" })
              ] })
            },
            i
          )) }) : !messages || messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              "data-ocid": "messages-empty-state",
              className: "flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "✨" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-[220px] leading-relaxed", children: "No messages yet. Say hello and use the icebreaker above to get the conversation started!" })
              ]
            }
          ) : messages.map((msg, i) => {
            const isSent = msg.senderId.toText() === myPrincipalStr;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              MessageBubble,
              {
                message: msg,
                isSent,
                senderName: isSent ? "You" : partnerDisplayName,
                onReact: (emoji) => reactMutation.mutate({ messageId: msg.id, emoji }),
                index: i
              },
              String(msg.id)
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "message-input-bar",
        className: "bg-card border-t border-border px-4 py-3 flex items-center gap-3",
        style: {
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: text,
              onChange: (e) => setText(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: "Say something kind…",
              maxLength: 1e3,
              "data-ocid": "message-input",
              className: "flex-1 bg-muted/40 border border-input rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/50 transition-smooth min-w-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleSend,
              disabled: !text.trim() || sendMutation.isPending,
              "data-ocid": "message-send",
              "aria-label": "Send message",
              className: "w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Send,
                {
                  size: 16,
                  className: sendMutation.isPending ? "opacity-60" : ""
                }
              )
            }
          )
        ]
      }
    )
  ] }) });
}
export {
  ChatDetailPage
};

import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Compass, MessageCircle, User } from "lucide-react";
import { useBackend } from "../hooks/useBackend";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { ChatSummary } from "../types";

const NAV_ITEMS = [
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/chats", label: "Active Chats", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useCurrentUser();
  const { backend } = useBackend();

  const { data: chats } = useQuery<ChatSummary[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listChats();
    },
    enabled: isAuthenticated && !!backend,
    staleTime: 3000,
  });

  const totalUnread =
    chats?.reduce((acc, c) => acc + Number(c.unreadCount), 0) ?? 0;

  return (
    <nav
      data-ocid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around h-16">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive =
            location.pathname === to ||
            (to === "/chats" && location.pathname.startsWith("/chats"));
          const showBadge = to === "/chats" && totalUnread > 0;

          return (
            <Link
              key={to}
              to={to}
              data-ocid={`bottom-nav-${label.toLowerCase().replace(" ", "-")}`}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 text-xs transition-smooth ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={isActive ? "text-primary" : ""}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-semibold leading-none">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </div>
              <span
                className={`font-body leading-none ${isActive ? "font-semibold" : ""}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

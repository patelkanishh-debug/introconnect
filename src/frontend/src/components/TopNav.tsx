import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Compass, MessageCircle, User, Waves } from "lucide-react";
import { useBackend } from "../hooks/useBackend";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { ChatSummary } from "../types";

const NAV_LINKS = [
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/chats", label: "Active Chats", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function TopNav() {
  const location = useLocation();
  const { isAuthenticated, profile, login } = useCurrentUser();
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
    <header
      data-ocid="top-nav"
      className="hidden md:flex sticky top-0 z-50 bg-card border-b border-border shadow-sm h-16 items-center px-6"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mr-10 group">
        <Waves
          size={24}
          className="text-primary group-hover:scale-110 transition-smooth"
        />
        <span className="font-display text-xl font-semibold text-foreground tracking-tight">
          Echoes
        </span>
      </Link>

      {/* Nav links */}
      {isAuthenticated && (
        <nav className="flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const isActive =
              location.pathname === to ||
              (to === "/chats" && location.pathname.startsWith("/chats"));
            const showBadge = to === "/chats" && totalUnread > 0;

            return (
              <Link
                key={to}
                to={to}
                data-ocid={`top-nav-${label.toLowerCase().replace(" ", "-")}`}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon size={16} />
                {label}
                {showBadge && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-semibold">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {isAuthenticated && profile ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[120px] truncate">
              {profile.displayName}
            </span>
          </div>
        ) : (
          <Button
            data-ocid="top-nav-login"
            onClick={login}
            size="sm"
            className="rounded-full"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}

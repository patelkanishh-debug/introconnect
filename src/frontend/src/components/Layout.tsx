import type { ReactNode } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";

interface LayoutProps {
  children: ReactNode;
  /** Set to true on the welcome/auth screen — hides all navigation */
  hideNav?: boolean;
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useCurrentUser();

  const showNav = !hideNav && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Desktop top nav */}
      {showNav && <TopNav />}

      {/* Main content */}
      <main
        className={`flex-1 flex flex-col ${showNav && isMobile ? "pb-16" : ""}`}
      >
        {children}
      </main>

      {/* Mobile bottom nav */}
      {showNav && isMobile && <BottomNav />}

      {/* Footer — only on non-mobile when authenticated, or on welcome screen */}
      {(!isMobile || !isAuthenticated) && (
        <footer className="bg-card border-t border-border py-3 px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline transition-smooth"
          >
            caffeine.ai
          </a>
        </footer>
      )}
    </div>
  );
}

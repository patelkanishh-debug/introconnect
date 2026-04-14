import { Skeleton } from "@/components/ui/skeleton";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { useCurrentUser } from "./hooks/useCurrentUser";

// Lazy-loaded pages
const WelcomePage = lazy(() =>
  import("./pages/WelcomePage").then((m) => ({ default: m.WelcomePage })),
);
const ExplorePage = lazy(() =>
  import("./pages/ExplorePage").then((m) => ({ default: m.ExplorePage })),
);
const ChatsPage = lazy(() =>
  import("./pages/ChatsPage").then((m) => ({ default: m.ChatsPage })),
);
const ChatDetailPage = lazy(() =>
  import("./pages/ChatDetailPage").then((m) => ({ default: m.ChatDetailPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);

// Root shell with auth guard
function RootShell() {
  return (
    <Suspense
      fallback={
        <Layout hideNav>
          <div className="flex-1 flex flex-col gap-4 p-6">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </Layout>
      }
    >
      <Outlet />
    </Suspense>
  );
}

// Auth guard wrapper
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <Layout hideNav>
        <div className="flex-1 flex flex-col gap-4 p-6 max-w-md mx-auto w-full">
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" />;
  }

  return <>{children}</>;
}

// Route definitions
const rootRoute = createRootRoute({ component: RootShell });

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  component: () => <WelcomePage />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/explore" />,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: () => (
    <AuthGuard>
      <ExplorePage />
    </AuthGuard>
  ),
});

const chatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chats",
  component: () => (
    <AuthGuard>
      <ChatsPage />
    </AuthGuard>
  ),
});

const chatDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chats/$chatId",
  component: () => (
    <AuthGuard>
      <ChatDetailPage />
    </AuthGuard>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  welcomeRoute,
  exploreRoute,
  chatsRoute,
  chatDetailRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

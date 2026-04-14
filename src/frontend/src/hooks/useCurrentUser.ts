import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfilePublic } from "../types";
import { useBackend } from "./useBackend";

export function useCurrentUser() {
  const { loginStatus, login, clear, identity } = useInternetIdentity();
  const { backend, isLoading: backendLoading } = useBackend();
  const queryClient = useQueryClient();

  const isAuthenticated = loginStatus === "success" && !!identity;

  const {
    data: profile,
    isLoading: profileLoading,
    refetch,
  } = useQuery<UserProfilePublic | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!backend) return null;
      return backend.getMyProfile();
    },
    enabled: isAuthenticated && !!backend && !backendLoading,
    staleTime: 30_000,
  });

  const logout = async () => {
    clear();
    queryClient.clear();
  };

  return {
    profile: profile ?? null,
    isAuthenticated,
    isLoading:
      loginStatus === "logging-in" || (isAuthenticated && profileLoading),
    loginStatus,
    login,
    logout,
    refetch,
    identity,
  };
}

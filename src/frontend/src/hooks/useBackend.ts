import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../types";

/**
 * Returns the typed backend actor and a loading flag.
 * Wraps useActor with the generated createActor factory from backend.ts.
 */
export function useBackend(): {
  backend: backendInterface | null;
  isLoading: boolean;
} {
  const { actor, isFetching } = useActor(createActor);
  return {
    backend: actor as backendInterface | null,
    isLoading: isFetching,
  };
}

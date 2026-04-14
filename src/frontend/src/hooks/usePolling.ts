import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

/**
 * Polls one or more React Query keys at a given interval.
 * Defaults to 3000ms (3 seconds) per the spec.
 */
export function usePolling(queryKeys: string[][], intervalMs = 3000) {
  const queryClient = useQueryClient();
  const keysRef = useRef(queryKeys);
  keysRef.current = queryKeys;

  useEffect(() => {
    if (queryKeys.length === 0) return;

    const id = setInterval(() => {
      for (const key of keysRef.current) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [queryClient, intervalMs, queryKeys.length]);
}

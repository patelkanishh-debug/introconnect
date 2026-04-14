import { i as useQueryClient, r as reactExports } from "./index-DSt5PXRa.js";
function usePolling(queryKeys, intervalMs = 3e3) {
  const queryClient = useQueryClient();
  const keysRef = reactExports.useRef(queryKeys);
  keysRef.current = queryKeys;
  reactExports.useEffect(() => {
    if (queryKeys.length === 0) return;
    const id = setInterval(() => {
      for (const key of keysRef.current) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [queryClient, intervalMs, queryKeys.length]);
}
export {
  usePolling as u
};

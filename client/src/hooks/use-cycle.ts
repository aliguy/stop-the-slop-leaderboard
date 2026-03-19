import { useQuery } from "@tanstack/react-query";
import type { CycleInfoResponse } from "@shared/types";

export function useCycleInfo() {
  return useQuery<CycleInfoResponse>({
    queryKey: ["cycle-info"],
    queryFn: async () => {
      const res = await fetch("/api/cycle-info");
      if (!res.ok) throw new Error("Failed to fetch cycle info");
      return res.json();
    },
    refetchInterval: 60000,
  });
}

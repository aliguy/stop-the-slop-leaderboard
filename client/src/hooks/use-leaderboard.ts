import { useQuery } from "@tanstack/react-query";
import type { ReporterRanking, OffenderRanking, Cycle } from "@shared/types";

interface LeaderboardData {
  reporters?: ReporterRanking[];
  offenders?: OffenderRanking[];
  cycle: Cycle | null;
}

export function useLeaderboard(tab: "reporters" | "offenders", cycleId?: string) {
  return useQuery<LeaderboardData>({
    queryKey: ["leaderboard", tab, cycleId],
    queryFn: async () => {
      const params = new URLSearchParams({ tab, limit: "50" });
      if (cycleId) params.set("cycle_id", cycleId);
      const res = await fetch(`/api/leaderboard?${params}`);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    },
    refetchInterval: 30000,
  });
}

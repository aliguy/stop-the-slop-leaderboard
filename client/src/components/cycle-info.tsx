import { Trophy } from "lucide-react";
import type { Cycle } from "@shared/types";
import { formatPrizeCents, daysRemaining, formatMonth } from "@/lib/utils";

interface CycleInfoProps {
  cycle: Cycle | null;
}

export function CycleInfo({ cycle }: CycleInfoProps) {
  if (!cycle) return null;

  const days = daysRemaining(cycle.end_date);

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="px-5 py-2.5 border border-yellow-500/30 text-sm font-bold flex items-center gap-2 bg-yellow-500/10 text-yellow-700 rounded-sm">
        <Trophy className="w-4 h-4" />
        Prize Pool: {formatPrizeCents(cycle.prize_pool_cents)}
      </div>
      <div className="px-5 py-2.5 border border-border text-sm font-semibold text-black/70 rounded-sm">
        {formatMonth(cycle.start_date)}
      </div>
      <div className="px-5 py-2.5 border border-border text-sm font-semibold text-black/70 rounded-sm">
        {days} {days === 1 ? "day" : "days"} remaining
      </div>
    </div>
  );
}

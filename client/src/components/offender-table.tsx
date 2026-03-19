import { ShieldAlert, AlertTriangle, Skull, Flame } from "lucide-react";
import type { OffenderRanking } from "@shared/types";

function getRankIcon(index: number) {
  switch (index) {
    case 0:
      return <Skull className="w-6 h-6 text-red-600 fill-red-600/20 animate-pulse" />;
    case 1:
      return <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />;
    case 2:
      return <AlertTriangle className="w-6 h-6 text-amber-500 fill-amber-500/20" />;
    default:
      return (
        <span className="text-lg font-semibold text-black/40 w-6 text-center">
          {index + 1}
        </span>
      );
  }
}

interface OffenderTableProps {
  offenders: OffenderRanking[];
}

export function OffenderTable({ offenders }: OffenderTableProps) {
  return (
    <div className="bg-white border-t border-b md:border border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 border-b border-border gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            Worst Offenders
          </h2>
          <p className="text-sm text-black/60 mt-1">
            Accounts with the highest concentration of AI-generated filler.
          </p>
        </div>

        {offenders.length > 0 && (
          <div className="px-5 py-2.5 border border-red-500/30 text-sm font-bold flex items-center gap-2 bg-red-500/10 text-red-700 rounded-sm">
            <AlertTriangle className="w-4 h-4" />
            High Toxicity Detected
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-xs font-medium text-black/50 border-b border-border bg-[#F8F7F4]/50 uppercase tracking-wider">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-6 md:col-span-6">Account</div>
          <div className="col-span-4 hidden md:block text-right">Posts Analyzed</div>
          <div className="col-span-4 md:col-span-1 text-right">Score</div>
        </div>

        {offenders.length === 0 && (
          <div className="px-8 py-16 text-center text-black/40 text-sm">
            No offenders flagged yet this cycle.
          </div>
        )}

        {offenders.map((offender, index) => (
          <div
            key={offender.author_handle + index}
            className={`grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-5 border-b border-border last:border-0 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm ${
              index === 0
                ? "bg-red-50/50 hover:bg-red-50"
                : index === 1
                  ? "bg-orange-50/50 hover:bg-orange-50"
                  : index === 2
                    ? "bg-amber-50/50 hover:bg-amber-50"
                    : "hover:bg-[#F8F7F4]"
            }`}
          >
            <div className="col-span-2 md:col-span-1 flex justify-center items-center">
              {getRankIcon(index)}
            </div>

            <div className="col-span-6 md:col-span-6 flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[#F8F7F4] text-black font-semibold text-sm ${
                    index === 0
                      ? "border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                      : index === 1
                        ? "border-orange-500"
                        : index === 2
                          ? "border-amber-500"
                          : "border-border"
                  }`}
                >
                  {(offender.author_name || offender.author_handle).charAt(0)}
                </div>
                {index === 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center border-2 border-white text-[10px] text-white font-bold">
                    1
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-sm md:text-base ${
                      index === 0
                        ? "text-red-700"
                        : index === 1
                          ? "text-orange-700"
                          : index === 2
                            ? "text-amber-700"
                            : "text-black"
                    }`}
                  >
                    {offender.author_name || offender.author_handle}
                  </span>
                </div>
                <span className="text-xs font-medium text-black/50">
                  @{offender.author_handle}
                </span>
              </div>
            </div>

            <div className="col-span-4 hidden md:flex justify-end items-center">
              <span className="text-sm font-semibold text-black/70 bg-[#F8F7F4] px-3 py-1 rounded-full border border-border">
                {offender.posts_analyzed}
              </span>
            </div>

            <div className="col-span-4 md:col-span-1 flex justify-end items-center">
              <span
                className={`text-lg font-black ${
                  index === 0
                    ? "text-red-600"
                    : index === 1
                      ? "text-orange-600"
                      : index === 2
                        ? "text-amber-600"
                        : "text-black"
                }`}
              >
                {Math.round(offender.avg_ai_score)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

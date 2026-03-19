import { Trophy, Medal, Award } from "lucide-react";
import type { ReporterRanking } from "@shared/types";

function getRankIcon(index: number) {
  switch (index) {
    case 0:
      return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />;
    case 1:
      return <Medal className="w-6 h-6 text-slate-400 fill-slate-400/20" />;
    case 2:
      return <Award className="w-6 h-6 text-amber-700 fill-amber-700/20" />;
    default:
      return (
        <span className="text-lg font-semibold text-black/40 w-6 text-center">
          {index + 1}
        </span>
      );
  }
}

interface ReporterTableProps {
  reporters: ReporterRanking[];
}

export function ReporterTable({ reporters }: ReporterTableProps) {
  return (
    <div className="bg-white border-t border-b md:border border-border relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 border-b border-border gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black flex items-center gap-2">
            <Trophy className="w-5 h-5 text-black" />
            Top Reporters
          </h2>
          <p className="text-sm text-black/60 mt-1">
            Users flagging the most AI-generated content.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-xs font-medium text-black/50 border-b border-border bg-[#F8F7F4]/50 uppercase tracking-wider">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-6 md:col-span-5">Operative</div>
          <div className="col-span-3 hidden md:block text-right">Targets Neutralized</div>
          <div className="col-span-4 md:col-span-3 text-right">Points</div>
        </div>

        {reporters.length === 0 && (
          <div className="px-8 py-16 text-center text-black/40 text-sm">
            No reporters yet this cycle. Install the extension to start flagging!
          </div>
        )}

        {reporters.map((reporter, index) => (
          <div
            key={reporter.display_name + index}
            className={`grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-5 border-b border-border last:border-0 transition-all duration-200 ${
              index === 0
                ? "bg-yellow-50/50 hover:bg-yellow-50"
                : index === 1
                  ? "bg-slate-50/50 hover:bg-slate-50"
                  : index === 2
                    ? "bg-amber-50/50 hover:bg-amber-50"
                    : "hover:bg-[#F8F7F4]"
            }`}
          >
            <div className="col-span-2 md:col-span-1 flex justify-center items-center">
              {getRankIcon(index)}
            </div>

            <div className="col-span-6 md:col-span-5 flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-[#F8F7F4] text-black font-semibold text-xs ${
                    index === 0
                      ? "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                      : index === 1
                        ? "border-slate-400"
                        : index === 2
                          ? "border-amber-700"
                          : "border-border"
                  }`}
                >
                  {reporter.avatar_url ? (
                    <img
                      src={reporter.avatar_url}
                      alt={reporter.display_name}
                      className={`w-full h-full rounded-full object-cover ${index > 2 ? "grayscale" : ""}`}
                    />
                  ) : (
                    reporter.display_name.charAt(0)
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-bold text-sm md:text-base ${
                    index === 0 ? "text-yellow-700" : "text-black"
                  }`}
                >
                  {reporter.display_name}
                </span>
                {reporter.linkedin_handle && (
                  <span className="text-xs font-medium text-black/50">
                    @{reporter.linkedin_handle}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-3 hidden md:flex justify-end items-center">
              <span className="text-sm font-semibold text-black/70 bg-[#F8F7F4] px-3 py-1 rounded-full border border-border">
                {reporter.total_flags}
              </span>
            </div>

            <div className="col-span-4 md:col-span-3 flex justify-end items-center">
              <span
                className={`text-lg font-bold ${
                  index === 0
                    ? "text-yellow-600"
                    : index === 1
                      ? "text-slate-600"
                      : index === 2
                        ? "text-amber-800"
                        : "text-black/80"
                }`}
              >
                {reporter.total_points.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

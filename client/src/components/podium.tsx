import { Trophy, Medal, Award } from "lucide-react";
import type { ReporterRanking } from "@shared/types";

interface PodiumProps {
  reporters: ReporterRanking[];
}

export function Podium({ reporters }: PodiumProps) {
  if (reporters.length < 3) return null;

  const top3 = reporters.slice(0, 3);
  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="flex justify-center items-end h-[280px] gap-2 md:gap-4 px-4 pt-12 pb-8 bg-white border border-border mb-16 shadow-sm relative">
      <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest text-black/40">
        Top Vanguard Operatives
      </div>
      {podiumOrder.map((reporter, i) => {
        const isFirst = i === 1;
        const isSecond = i === 0;

        const rank = isFirst ? 1 : isSecond ? 2 : 3;
        const heightClass = isFirst ? "h-[140px]" : isSecond ? "h-[110px]" : "h-[90px]";
        const colorClass = isFirst
          ? "bg-yellow-100 border-yellow-200"
          : isSecond
            ? "bg-slate-100 border-slate-200"
            : "bg-amber-100/50 border-amber-200";
        const textClass = isFirst
          ? "text-yellow-700"
          : isSecond
            ? "text-slate-700"
            : "text-amber-800";

        return (
          <div key={reporter.display_name + rank} className="flex flex-col items-center w-28 md:w-36 relative">
            {/* Avatar & Info */}
            <div
              className={`flex flex-col items-center text-center mb-4 transition-transform duration-500 hover:-translate-y-2 ${isFirst ? "z-10" : ""}`}
            >
              <div className="relative mb-2">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center bg-[#F8F7F4] text-black font-semibold text-xl ${
                    isFirst
                      ? "border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                      : isSecond
                        ? "border-slate-300"
                        : "border-amber-600"
                  }`}
                >
                  {reporter.avatar_url ? (
                    <img
                      src={reporter.avatar_url}
                      alt={reporter.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    reporter.display_name.charAt(0)
                  )}
                </div>
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white text-white font-bold text-xs ${
                    isFirst ? "bg-yellow-500" : isSecond ? "bg-slate-400" : "bg-amber-600"
                  }`}
                >
                  {rank}
                </div>
              </div>
              <div className="font-bold text-sm md:text-base text-black truncate w-full">
                {reporter.display_name}
              </div>
              <div className={`font-black text-lg ${textClass}`}>
                {reporter.total_points.toLocaleString()}
              </div>
            </div>

            {/* Podium Block */}
            <div
              className={`w-full ${heightClass} ${colorClass} border-t-4 flex flex-col justify-end items-center pb-4 rounded-t-lg shadow-inner`}
            >
              {isFirst && <Trophy className="w-8 h-8 text-yellow-500 mb-2 opacity-50" />}
              {isSecond && <Medal className="w-8 h-8 text-slate-400 mb-2 opacity-50" />}
              {!isFirst && !isSecond && (
                <Award className="w-8 h-8 text-amber-700 mb-2 opacity-50" />
              )}
              <span className="text-3xl font-black opacity-20">{rank}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

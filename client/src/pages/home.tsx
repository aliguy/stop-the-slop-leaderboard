import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Podium } from "@/components/podium";
import { ReporterTable } from "@/components/reporter-table";
import { OffenderTable } from "@/components/offender-table";
import { CycleInfo } from "@/components/cycle-info";
import { Footer } from "@/components/footer";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useCycleInfo } from "@/hooks/use-cycle";

const MOCK_REPORTERS = [
  { display_name: "Alex Chen", linkedin_handle: "alexc_dev", avatar_url: null, total_flags: 342, total_points: 1450 },
  { display_name: "Sarah Jenkins", linkedin_handle: "sarahj_tech", avatar_url: null, total_flags: 289, total_points: 1220 },
  { display_name: "David Kim", linkedin_handle: "davidk_ux", avatar_url: null, total_flags: 215, total_points: 980 },
  { display_name: "Elena Rodriguez", linkedin_handle: "elenar_pm", avatar_url: null, total_flags: 188, total_points: 840 },
  { display_name: "Marcus Johnson", linkedin_handle: "marcusj_eng", avatar_url: null, total_flags: 156, total_points: 720 },
  { display_name: "Priya Patel", linkedin_handle: "priyap_design", avatar_url: null, total_flags: 142, total_points: 650 },
  { display_name: "Tom Wilson", linkedin_handle: "tomw_data", avatar_url: null, total_flags: 128, total_points: 590 },
];

const MOCK_OFFENDERS = [
  { author_handle: "growth_hacker", author_name: "Growth Hacker Pro", total_flags_received: 142, avg_ai_score: 98, posts_analyzed: 142 },
  { author_handle: "synergy_sol", author_name: "Synergy Solutions AI", total_flags_received: 89, avg_ai_score: 94, posts_analyzed: 89 },
  { author_handle: "b2b_leads", author_name: "B2B Lead Gen Expert", total_flags_received: 215, avg_ai_score: 89, posts_analyzed: 215 },
  { author_handle: "innovate_ai", author_name: "Innovate AI", total_flags_received: 64, avg_ai_score: 85, posts_analyzed: 64 },
  { author_handle: "mktg_guru", author_name: "Marketing Guru", total_flags_received: 112, avg_ai_score: 78, posts_analyzed: 112 },
];

const MOCK_CYCLE = {
  id: "mock",
  start_date: "2026-03-01",
  end_date: "2026-03-31",
  prize_pool_cents: 50000,
  status: "active" as const,
  winner_id: null,
  created_at: "2026-03-01",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"reporters" | "offenders">("reporters");

  const reporterQuery = useLeaderboard("reporters");
  const offenderQuery = useLeaderboard("offenders");
  const cycleQuery = useCycleInfo();

  const reporters = reporterQuery.data?.reporters || MOCK_REPORTERS;
  const offenders = offenderQuery.data?.offenders || MOCK_OFFENDERS;
  const cycle = cycleQuery.data?.active || MOCK_CYCLE;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      {/* Leaderboard */}
      <div className="w-full flex justify-center flex-1 bg-[#F8F7F4]">
        <div className="w-full max-w-[1300px] border-x border-border py-16 md:py-24 px-6 md:px-12 flex flex-col bg-[#F8F7F4]">
          <Podium reporters={reporters} />

          <div className="mb-12">
            <div className="text-[14px] uppercase tracking-widest font-semibold mb-4 text-black/40">
              Live Rankings
            </div>
            <h2 className="text-[48px] md:text-[64px] font-semibold tracking-[-0.03em] leading-[1.05] mb-4">
              The Leaderboard
            </h2>
            <p className="text-[18px] text-black/50 max-w-2xl">
              Monitor the ecosystem. See who is polluting the network and who is
              actively cleaning it up.
            </p>
          </div>

          <CycleInfo cycle={cycle} />

          <div className="flex w-full max-w-md border border-black bg-white mb-8">
            <button
              onClick={() => setActiveTab("reporters")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === "reporters"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-50"
              }`}
            >
              Top Reporters
            </button>
            <button
              onClick={() => setActiveTab("offenders")}
              className={`flex-1 py-3 text-sm font-semibold border-l border-black transition-colors ${
                activeTab === "offenders"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-50"
              }`}
            >
              Worst Offenders
            </button>
          </div>

          <div className="flex-1 w-full">
            {activeTab === "reporters" ? (
              <ReporterTable reporters={reporters} />
            ) : (
              <OffenderTable offenders={offenders} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

import { Download, Search, Flag, Trophy, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    label: "INSTALL",
    icon: Download,
    headline: "Install the Chrome extension.",
    description:
      "Add the LinkedIn AI Detector to your browser. It scans every post in your feed using 17+ heuristic signals — entirely client-side, zero API cost.",
  },
  {
    number: "02",
    label: "DETECT",
    icon: Search,
    headline: "Browse LinkedIn. We score every post.",
    description:
      "Our detection engine analyzes trigger words, phrase patterns, em dash abuse, sentence uniformity, burstiness, and more. Each post gets an AI confidence score from 0–100.",
  },
  {
    number: "03",
    label: "FLAG",
    icon: Flag,
    headline: "Hit 'Stop the Slop' to flag it.",
    description:
      "When you spot AI-generated content, click the button. Your flag is submitted to the leaderboard — post hash, score, and signals are recorded. One click, done.",
  },
  {
    number: "04",
    label: "COMPETE",
    icon: Trophy,
    headline: "Climb the leaderboard. Win prizes.",
    description:
      "Each flag earns points based on the AI score. Monthly cycles crown a Top Slop Identifier with a real cash prize. Track your rank in the extension popup.",
  },
];

export function HowItWorks() {
  return (
    <div id="how-it-works" className="w-full flex justify-center border-b border-border bg-white">
      <div className="w-full max-w-[1300px] border-x border-border">
        {/* Section header */}
        <div className="p-10 md:p-16 border-b border-border">
          <div className="text-[14px] uppercase tracking-widest font-semibold mb-4 text-black/40">
            How It Works
          </div>
          <h2 className="text-[48px] md:text-[64px] font-semibold tracking-[-0.03em] leading-[1.05]">
            Four steps to cleaner feeds.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`p-8 flex flex-col h-full group cursor-default ${
                i !== 3 ? "md:border-r border-border" : ""
              } border-b md:border-b-0 border-border last:border-b-0`}
            >
              <div className="mb-8 p-3 bg-[#F8F7F4] w-12 h-12 flex items-center justify-center">
                <step.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-[12px] uppercase tracking-widest font-semibold text-black/40 mb-2">
                {step.label}
              </span>
              <h3 className="text-[20px] font-semibold tracking-tight mb-3 leading-snug">
                {step.headline}
              </h3>
              <p className="text-[15px] leading-relaxed text-black/50 flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { XCircle } from "lucide-react";

const SIGNALS = [
  "AI buzzwords: 'delve', 'leverage', 'seamless', 'tapestry'",
  "Formulaic hook → body → CTA structure",
  "Relentless positivity with zero negative words",
  "Em dash abuse — compounding penalty",
  "\"It's not about X, it's about Y\" rhetorical flip",
  "Uniform sentence lengths (low coefficient of variation)",
  "Low vocabulary diversity (< 50% unique words)",
  "Emoji bullet lists (3+ lines)",
  "Hashtag stuffing at the end",
  "No contractions in 25+ word posts",
  "LinkedIn closers: \"Agree?\", \"Thoughts?\", \"Follow for more\"",
  "Dramatic one-liner formatting",
];

export function DetectionSignals() {
  return (
    <div className="w-full flex justify-center border-b border-border bg-white">
      <div className="w-full max-w-[1300px] border-x border-border">
        <div className="flex flex-col md:flex-row">
          {/* Left: text */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center md:border-r border-border">
            <div className="text-[14px] uppercase tracking-widest font-semibold mb-4 text-black/40">
              Detection Engine
            </div>
            <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.05] mb-6">
              17 signals. Zero API calls.
            </h2>
            <p className="text-[16px] leading-relaxed text-black/50 max-w-md">
              Everything runs client-side in your browser. No data leaves your machine.
              Pure heuristic pattern matching — fast, free, and private.
            </p>
          </div>

          {/* Right: signal list */}
          <div className="w-full md:w-1/2 p-10 md:p-16 bg-[#F8F7F4]">
            <div className="border border-border bg-white p-8">
              <div className="text-[14px] uppercase tracking-widest font-semibold mb-6 text-black/40">
                What We Catch
              </div>
              <div className="flex flex-col gap-3">
                {SIGNALS.map((signal, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle
                      className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <span className="text-[15px] text-black/60 leading-snug">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

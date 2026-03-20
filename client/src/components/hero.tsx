import { Trophy } from "lucide-react";

export function Hero() {
  return (
    <div className="w-full flex justify-center border-b border-border bg-white">
      <div className="w-full max-w-[1300px] border-x border-border p-10 md:p-16 lg:p-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-500/30 bg-yellow-500/10 text-yellow-700 text-[13px] font-bold uppercase tracking-widest mb-8">
          <Trophy className="w-4 h-4" />
          Win $500
        </div>
        <h1 className="text-[56px] md:text-[80px] font-semibold leading-[0.92] tracking-[-0.04em] text-black mb-6">
          Stop the Slop.
        </h1>
        <p className="text-[18px] md:text-[20px] text-black/50 font-medium max-w-[520px] leading-relaxed mb-10">
          Download the extension. Flag AI-generated content on LinkedIn. Top identifier each month wins $500.
        </p>
        <a
          href="https://flywheelos.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-[16px] font-medium px-10 py-4 hover:bg-black/80 transition-colors"
        >
          Download Extension
        </a>
      </div>
    </div>
  );
}

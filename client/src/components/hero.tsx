import { Shield, Zap, Flag, Users } from "lucide-react";

export function Hero() {
  return (
    <div className="w-full flex justify-center border-b border-border bg-white">
      <div className="w-full max-w-[1300px] border-x border-border relative min-h-[500px] md:min-h-[600px] flex flex-col">
        {/* Centered Title */}
        <div className="flex items-center justify-center flex-grow px-6">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 text-[13px] uppercase tracking-widest font-semibold text-black/40">
              <Shield className="w-4 h-4" />
              Feed Defense Platform
            </div>
            <h1 className="text-[64px] md:text-[84px] font-semibold leading-[0.92] tracking-[-0.04em] text-center">
              Stop the Slop.
            </h1>
            <p className="text-[18px] md:text-[20px] text-black/50 font-medium max-w-[500px] text-center leading-relaxed">
              The community-powered AI detection platform for LinkedIn. Flag slop. Climb the ranks. Win prizes.
            </p>
            <a
              href="https://flywheelos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white text-[16px] font-medium px-10 py-4 hover:bg-black/80 transition-colors"
            >
              Install Extension
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="w-full border-t border-border">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flag className="w-4 h-4 text-black/30" />
                <span className="text-[28px] md:text-[36px] font-bold tracking-tight">0</span>
              </div>
              <span className="text-[12px] uppercase tracking-widest font-semibold text-black/40">Posts Flagged</span>
            </div>
            <div className="p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-black/30" />
                <span className="text-[28px] md:text-[36px] font-bold tracking-tight">0</span>
              </div>
              <span className="text-[12px] uppercase tracking-widest font-semibold text-black/40">Reporters</span>
            </div>
            <div className="p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-black/30" />
                <span className="text-[28px] md:text-[36px] font-bold tracking-tight">$500</span>
              </div>
              <span className="text-[12px] uppercase tracking-widest font-semibold text-black/40">Prize Pool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

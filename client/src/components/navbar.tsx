import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-border bg-white sticky top-0 z-50">
      <div className="w-full max-w-[1300px] border-x border-border flex items-center justify-between px-6 md:px-10 h-[72px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-bold text-[15px] tracking-[-0.02em] shrink-0">
          <Shield className="w-5 h-5" strokeWidth={2.5} />
          FlywheelOS
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-black/60">
          <a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a>
          <a href="#leaderboard" className="hover:text-black transition-colors">Leaderboard</a>
          <a href="https://flywheelos.com" className="hover:text-black transition-colors" target="_blank" rel="noreferrer">Flywheel</a>
        </div>

        {/* CTA */}
        <a
          href="https://flywheelos.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-[14px] font-medium px-6 py-2.5 hover:bg-black/80 transition-colors"
        >
          Get Extension
        </a>
      </div>
    </nav>
  );
}

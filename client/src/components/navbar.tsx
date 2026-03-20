import { ArrowRight } from "lucide-react";
import { FlywheelLogo } from "./flywheel-logo";

export function Navbar() {
  return (
    <header className="sticky top-0 w-full flex justify-center z-50 bg-white border-b border-border">
      <div className="w-full max-w-[1300px] border-x border-border flex items-center justify-between px-6 md:px-10 h-24">
        {/* Logo */}
        <a href="https://flywheelos.com" className="flex items-center gap-3 shrink-0">
          <FlywheelLogo className="w-5 h-5" />
          <span
            className="font-semibold text-[15px] tracking-[-0.02em] leading-none text-black"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Flywheel
          </span>
        </a>

        {/* Nav links — same as flywheelos.com */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <a href="https://flywheelos.com" className="px-4 py-2 text-[15px] font-medium text-black/50 hover:text-black hover:bg-gray-50 rounded-md transition-all">
            Home
          </a>
          <a href="https://map.flywheelos.com" target="_blank" rel="noreferrer" className="px-4 py-2 text-[15px] font-medium text-black/50 hover:text-black hover:bg-gray-50 rounded-md transition-all">
            Content Globe
          </a>
          <a href="https://flywheelos.com/pricing" className="px-4 py-2 text-[15px] font-medium text-black/50 hover:text-black hover:bg-gray-50 rounded-md transition-all">
            Pricing
          </a>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <a href="https://flywheelos.com/login" className="text-[15px] font-medium text-black/50 hover:text-black transition-colors">
            Login
          </a>
          <a
            href="https://cal.com/peter-wong/discovery"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[15px] font-medium text-black hover:opacity-70 transition-opacity"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Get in touch</span>
          </a>
        </div>
      </div>
    </header>
  );
}

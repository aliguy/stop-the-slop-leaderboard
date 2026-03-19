import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-white sticky top-0 z-50">
      <div className="grid-container">
        <div className="grid-content flex items-center justify-between h-20 px-6 md:px-12">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <Shield className="w-6 h-6" strokeWidth={2.5} />
            FlywheelOS
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black/70">
            <a href="https://flywheelos.com" className="hover:text-black transition-colors">
              Modules
            </a>
            <a href="#leaderboard" className="hover:text-black transition-colors">
              Leaderboard
            </a>
            <a href="https://flywheelos.com" className="hover:text-black transition-colors">
              About
            </a>
          </div>

          <a
            href="https://flywheelos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white text-sm font-medium px-6 py-3 hover:bg-black/80 transition-colors"
          >
            Get Extension
          </a>
        </div>
      </div>
    </nav>
  );
}

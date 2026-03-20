import { FlywheelLogo } from "./flywheel-logo";

export function Footer() {
  return (
    <footer className="w-full flex justify-center bg-white border-t border-border">
      <div className="w-full max-w-[1300px] border-x border-border flex items-center justify-between px-6 md:px-10 h-[72px]">
        <a href="https://flywheelos.com" className="flex items-center gap-3 shrink-0">
          <FlywheelLogo className="w-5 h-5" />
          <span
            className="font-semibold text-[15px] tracking-[-0.02em] leading-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Flywheel
          </span>
        </a>
        <div className="flex items-center gap-6 text-[13px] text-black/40">
          <span>&copy; {new Date().getFullYear()} Flywheel</span>
        </div>
      </div>
    </footer>
  );
}

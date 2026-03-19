import { Shield } from "lucide-react";

export function CTAFooter() {
  return (
    <div className="w-full flex justify-center border-b border-border bg-white">
      <div className="w-full max-w-[1300px] border-x border-border p-10 md:p-24 flex flex-col items-center text-center bg-[#F8F7F4]">
        <h2 className="text-[48px] md:text-[72px] font-semibold tracking-[-0.03em] max-w-[900px] mb-8 leading-[1.05] text-black">
          Ready to clean up the network?
        </h2>
        <p className="text-[20px] text-black/50 max-w-[600px] mb-12">
          Install the extension. Flag the slop. Win prizes.
        </p>
        <a
          href="https://flywheelos.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-[16px] font-medium px-10 py-4 hover:bg-black/80 transition-colors"
        >
          Install Chrome Extension
        </a>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full flex justify-center bg-white border-t border-border">
      <div className="w-full max-w-[1300px] border-x border-border flex items-center justify-between px-6 md:px-10 h-[72px]">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Shield className="w-4 h-4" strokeWidth={2.5} />
          <span className="font-bold text-[15px] tracking-[-0.02em]">FlywheelOS</span>
        </a>
        <div className="flex items-center gap-6 text-[13px] text-black/40">
          <span>&copy; {new Date().getFullYear()} Flywheel</span>
        </div>
      </div>
    </footer>
  );
}

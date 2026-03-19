export function Hero() {
  return (
    <header className="w-full">
      <div className="grid-container">
        <div className="grid-content">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
            {/* Left: Heading */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-black mb-8">
                Feed defense on <br />
                autopilot.
              </h1>
              <div>
                <a
                  href="https://flywheelos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white text-lg font-medium px-8 py-4 hover:bg-black/80 transition-colors"
                >
                  Get Extension
                </a>
              </div>
            </div>

            {/* Right: Description */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#F8F7F4]/50">
              <p className="text-lg md:text-xl text-black font-medium max-w-md">
                FlywheelOS is the AI detection platform for LinkedIn professionals.
                <br />
                <br />
                <span className="font-bold">
                  Track offenders. Source reporters. Keep it clean.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

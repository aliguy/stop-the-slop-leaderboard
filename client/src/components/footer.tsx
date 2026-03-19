export function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="grid-container">
        <div className="grid-content p-12 md:p-24 text-center border-t border-border">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Ready to clean up the network?
          </h2>
          <a
            href="https://flywheelos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white text-lg font-medium px-10 py-5 hover:bg-black/80 transition-colors"
          >
            Install the Chrome Extension
          </a>
        </div>
      </div>
    </footer>
  );
}

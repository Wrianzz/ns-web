export function Footer() {
  return (
    <footer className="mt-auto bg-[#000000] border-t border-[var(--border)] px-[40px] py-[24px]">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-[16px]">
        {/* Simulating the "live-dot" vibe from the design in the footer */}
        <div className="flex items-center gap-[12px] text-[13px] text-[var(--text-secondary)]">
          <span className="w-[8px] h-[8px] bg-[#10B981] rounded-full"></span>
          <span>Next Event: <strong className="text-[var(--text-primary)] font-medium">NS x NetRider Polibatam</strong> (Sabtu 11 Juli 2026, 13:00 WIB)</span>
        </div>
        
        <div className="flex gap-[20px] text-[13px] text-[var(--text-secondary)] font-[500]">
          <a href="https://discord.gg/BQkKysKZfe" className="hover:text-[var(--text-primary)] transition-colors">Discord</a>
          <a href="https://www.instagram.com/nusasiber/" className="hover:text-[var(--text-primary)] transition-colors">Instagram</a>
        </div>
        
        <div className="text-[12px] text-[#4B5563]">
          &copy; {new Date().getFullYear()} Nusa Siber Community. Beyond Expectation.
        </div>
      </div>
    </footer>
  );
}

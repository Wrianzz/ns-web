import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Sun, Moon, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../constants";

export function Navbar({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-[10px]">
      <div className="container mx-auto px-[40px] h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-[8px] group">
          <img src="/Logo.png" alt="Logo" className="h-[32px] w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-[32px]">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} to={link.href} className="text-[14px] font-[500] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-[20px]">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="border border-[var(--border)] text-[var(--text-secondary)] p-[6px] rounded-[6px] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/admin-login" className="bg-[var(--accent)] text-white px-[16px] py-[8px] rounded-[8px] font-[600] text-[13px] hover:opacity-90 transition-opacity">
            Login
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-[6px] border border-[var(--border)] rounded-[6px] text-[var(--text-primary)]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-[var(--bg)] border-b border-[var(--border)] py-[16px] space-y-[16px]">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} to={link.href} className="text-[var(--text-secondary)] font-[500] hover:text-[var(--text-primary)] text-[14px]" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <div className="w-full h-px bg-[var(--border)] my-2"></div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-[8px] text-[var(--text-secondary)] font-[500] text-[14px]"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <Link to="/admin-login" className="w-11/12 text-center bg-[var(--accent)] text-white px-[16px] py-[8px] rounded-[8px] font-[600] text-[13px] hover:opacity-90" onClick={() => setIsOpen(false)}>
            Login Admin
          </Link>
        </div>
      )}
    </header>
  );
}

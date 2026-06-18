import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative px-[40px] pt-[60px] pb-[40px] flex flex-col items-center text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl flex flex-col items-center"
      >
        <div className="text-[20px] uppercase tracking-[0.1em] text-[var(--accent)] font-[700] mb-[16px] text-center">
          Nusa Siber
        </div>
        <h1 className="text-[40px] sm:text-[48px] font-[800] tracking-[-0.03em] leading-[1.1] mb-[24px] max-w-[800px] text-[var(--text-primary)] text-balance">
          Membangun Ekosistem Keamanan Siber & IT Indonesia
        </h1>
        <p className="text-[18px] text-[var(--text-secondary)] max-w-[600px] mb-[32px] text-balance">
          Nusa Siber adalah pusat belajar, dokumentasi, dan diskusi teknis bagi para enthusiast maupun profesional.
        </p>
        <div className="flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto justify-center">
          <a href="https://discord.gg/BQkKysKZfe" className="inline-flex items-center justify-center gap-[8px] bg-[var(--accent)] text-white px-[28px] py-[12px] rounded-[8px] font-[600] text-[15px] border-none transition-all hover:opacity-90">
            Gabung Komunitas
          </a>
          <a href="#about" className="inline-flex items-center justify-center gap-[8px] bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] px-[28px] py-[12px] rounded-[8px] font-[600] text-[15px] transition-all hover:border-[var(--accent)]">
            Mulai Eksplorasi
          </a>
        </div>
      </motion.div>
    </section>
  );
}

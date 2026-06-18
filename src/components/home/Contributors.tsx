import { motion } from "motion/react";
import { Github, Linkedin } from "lucide-react";
import { CONTRIBUTORS } from "../../constants";

export function Contributors() {
  return (
    <section id="contributors" className="px-[40px] py-[60px] bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-[32px] text-center md:text-left">
          <h2 className="text-[12px] uppercase tracking-[0.1em] text-[var(--accent)] font-[700] mb-[8px]">Tim Pengembang</h2>
          <h3 className="text-[28px] md:text-[32px] font-bold tracking-tight text-[var(--text-primary)]">Kontributor Utama</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[20px]">
          {CONTRIBUTORS.map((person, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group flex flex-col items-center bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px] p-[32px] hover:border-[var(--accent)] hover:shadow-[0_0_15px_rgba(225,29,72,0.1)] transition-all duration-300"
            >
              <div className="w-[80px] h-[80px] rounded-full overflow-hidden mb-[16px] border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors p-1">
                <img 
                  src={person.avatar} 
                  alt={person.name} 
                  className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-300" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              
              <h4 className="text-[16px] font-[600] text-[var(--text-primary)] mb-[4px]">{person.name}</h4>
              <p className="text-[12px] font-[500] text-[var(--text-secondary)] mb-[20px] pb-[16px] border-b border-[var(--border)] w-full text-center">
                {person.role}
              </p>
              
              <div className="flex items-center gap-[16px]">
                <a href={person.github} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="GitHub Profile">
                  <Github size={18} strokeWidth={2} />
                </a>
                <a href={person.linkedin} className="text-[var(--text-secondary)] hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn Profile">
                  <Linkedin size={18} strokeWidth={2} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Shield, Users, Target, BookOpen } from "lucide-react";

export function AboutUs() {
  const values = [
    {
      icon: Users,
      title: "Komunitas Inklusif",
      description: "Kami adalah rumah bagi siapa saja yang tertarik pada keamanan siber, belajar bersama tanpa memandang latar belakang.",
    },
    {
      icon: Target,
      title: "Misi Edukasi",
      description: "Meningkatkan literasi dan kemampuan praktis keamanan siber melalui diskusi terbuka dan berbagi pengetahuan.",
    },
    {
      icon: BookOpen,
      title: "Belajar Mandiri",
      description: "Menyediakan sumber daya dan koneksi agar anggota dapat tumbuh dan mengeksplorasi secara independen.",
    },
    {
      icon: Shield,
      title: "Etika Siber",
      description: "Mengedepankan praktik keamanan siber yang etis dan profesional untuk membangun ekosistem digital yang lebih aman.",
    },
  ];

  return (
    <section id="about" className="px-[40px] py-[40px] flex flex-col items-center mb-auto flex-grow bg-[var(--card-bg)] border-y border-[var(--border)]">
      <div className="w-full max-w-7xl">
        <div className="mb-[48px] md:mb-[64px]">
          <h2 className="text-[12px] uppercase tracking-[0.1em] text-[var(--accent)] font-[700] mb-[4px] text-center">Tentang Kami</h2>
          <h3 className="text-[28px] md:text-[32px] font-bold tracking-tight text-center text-[var(--text-primary)]">Apa itu Nusa Siber?</h3>
          <p className="text-[15px] text-[var(--text-secondary)] mt-[8px] max-w-2xl mx-auto text-center leading-[1.6]">
            Kami bukan sekadar lembaga pembelajaran, melainkan ruang kolektif tempat para penggiat, praktisi, dan pemula berkumpul. Kami berbagi wawasan, berkolaborasi dalam menyelesaikan tantangan, dan tumbuh bersama membangun keamanan ranah digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="p-[32px] rounded-[16px] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors flex flex-col items-start"
            >
              <div className="w-[48px] h-[48px] rounded-[12px] bg-white/5 border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-[24px]">
                <value.icon size={24} />
              </div>
              <h4 className="text-[18px] font-[600] mb-[12px] text-[var(--text-primary)]">{value.title}</h4>
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

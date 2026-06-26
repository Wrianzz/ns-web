import { useEffect, useRef } from "react";
import { Github, Linkedin } from "lucide-react";
import { CONTRIBUTORS } from "../../constants";

export function Contributors() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const displayContributors = [...CONTRIBUTORS, ...CONTRIBUTORS, ...CONTRIBUTORS, ...CONTRIBUTORS];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (!isInteracting.current && !isDragging.current) {
        el.scrollLeft += (deltaTime * 30) / 1000;
        
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || (!isInteracting.current && !isDragging.current)) return;
    
    if (el.scrollLeft >= el.scrollWidth / 2) {
      el.scrollLeft -= el.scrollWidth / 2;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += el.scrollWidth / 2 - 2; 
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isInteracting.current = true;
    isDragging.current = true;
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeftStart.current = scrollRef.current.scrollLeft;
      scrollRef.current.style.cursor = 'grabbing';
      scrollRef.current.style.userSelect = 'none';
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isDragging.current = false;
    isInteracting.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = 'auto';
    }
  };

  const onTouchStart = () => {
    isInteracting.current = true;
  };

  const onTouchEnd = () => {
    isInteracting.current = false;
  };

  return (
    <section id="contributors" className="py-[60px] bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="container mx-auto px-[40px] max-w-6xl mb-[32px]">
        <div className="text-center md:text-left">
          <h2 className="text-[12px] uppercase tracking-[0.1em] text-[var(--accent)] font-[700] mb-[8px]">Tim Pengembang</h2>
          <h3 className="text-[28px] md:text-[32px] font-bold tracking-tight text-[var(--text-primary)]">Kontributor Utama</h3>
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-[40px] md:w-[100px] bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[40px] md:w-[100px] bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none"></div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={onTouchStart}
          onMouseLeave={onMouseUpOrLeave}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex gap-[20px] px-[20px] w-full overflow-x-auto items-stretch cursor-grab [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayContributors.map((person, idx) => (
            <div
              key={idx + '-' + person.name}
              className="group flex flex-col items-center bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px] p-[32px] hover:border-[var(--accent)] hover:shadow-[0_0_15px_rgba(225,29,72,0.1)] transition-all duration-300 shrink-0 w-[250px] md:w-[280px]"
            >
              <div className="w-[80px] h-[80px] rounded-full overflow-hidden mb-[16px] border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors p-1">
                <img 
                  src={person.avatar} 
                  alt={person.name} 
                  draggable={false}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

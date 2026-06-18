import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, Query } from "../../lib/appwrite";

export function EventDocumentation() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_DB_ID,
          APPWRITE_COLLECTION_EVENTS,
          [Query.orderDesc("createdAt"), Query.limit(6)]
        );
        const fetched = response.documents.map(doc => ({ id: doc.$id, ...doc }));
        setEvents(fetched);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const halfEvents = [...events, ...events];
  const displayEvents = [...halfEvents, ...halfEvents];

  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      if (!isInteracting.current && !isDragging.current) {
        // Slow speed (approx 30 pixels per second)
        el.scrollLeft += (deltaTime * 30) / 1000;
        
        // Loop seamlessly
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
    
    // Allow seamless scrolling backwards or forwards manually
    if (el.scrollLeft >= el.scrollWidth / 2) {
      el.scrollLeft -= el.scrollWidth / 2;
    } else if (el.scrollLeft <= 0) {
      // Small buffer to prevent locking at 0
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
    <section id="event" className="py-[60px] bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="container mx-auto px-[40px] max-w-6xl">
        <div className="mb-[32px] flex flex-col md:flex-row md:items-end justify-between gap-[16px]">
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.1em] text-[var(--accent)] font-[700] mb-[8px]">Komunitas &amp; Event</h2>
            <h3 className="text-[28px] md:text-[32px] font-bold tracking-tight text-[var(--text-primary)]">Dokumentasi Event</h3>
          </div>
          <Link to="/events" className="text-[13px] font-[500] text-[var(--accent)] flex items-center gap-[4px] hover:underline">
            Lihat Semua Event <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        {/* Gradients on the edges for a smoother fade-in/fade-out marquee look */}
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
          {displayEvents.map((item, idx) => (
            <Link
              to={`/events/${item.id}`}
              key={idx + '-' + item.id}
              className="group/card flex flex-col bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px] overflow-hidden hover:border-[var(--accent)] transition-colors shrink-0 w-[300px] md:w-[350px] block"
              draggable={false}
            >
              <div className="h-[180px] w-full overflow-hidden border-b border-[var(--border)] relative bg-[#111]">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  draggable={false} // Important for drag-to-scroll compatibility
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover/card:opacity-100" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-[24px] flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-[16px]">
                  <div className="w-[48px] h-[48px] bg-[var(--bg)] border border-[var(--border)] rounded-[8px] flex flex-col justify-center items-center shadow-sm">
                    <span className="text-[14px] font-bold font-mono text-[var(--text-primary)] leading-none">{item.date?.split(' ')[0] || ''}</span>
                    <span className="text-[10px] uppercase text-[var(--text-secondary)] mt-[2px]">{item.date?.split(' ')[1] || ''}</span>
                  </div>
                </div>
                <h4 className="font-[600] text-[16px] mb-[8px] text-[var(--text-primary)] whitespace-normal">{item.title}</h4>
                <p className="text-[13px] text-[var(--text-secondary)] mt-auto pt-[8px] whitespace-normal">{item.type}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

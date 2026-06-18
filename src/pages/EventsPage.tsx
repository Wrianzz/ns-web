import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, Query } from "../lib/appwrite";

const ITEMS_PER_PAGE = 6;

export function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_DB_ID,
          APPWRITE_COLLECTION_EVENTS,
          [Query.orderDesc("createdAt")]
        );
        const fetched = response.documents.map(doc => ({ id: doc.$id, ...doc }));
        setEvents(fetched);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--bg)] items-center justify-center p-[40px]">
        <div className="animate-spin text-[var(--accent)] w-8 h-8 rounded-full border-2 border-t-[var(--accent)] border-r-[var(--accent)] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)]">
      <div className="container mx-auto px-[40px] max-w-6xl py-[60px]">
        <div className="mb-[40px] text-center md:text-left">
          <h1 className="text-[32px] md:text-[40px] font-[800] tracking-tight text-[var(--text-primary)] mb-[16px]">Semua Event</h1>
          <p className="text-[16px] text-[var(--text-secondary)] max-w-2xl">
            Jelajahi seluruh dokumentasi dan jadwal kegiatan dari Nusa Siber.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] py-[40px]">Belum ada event yang dipublikasikan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[48px]">
            <AnimatePresence mode="popLayout">
              {currentEvents.map((item, idx) => (
                <Link
                  to={`/events/${item.id}`}
                  key={item.id + startIndex} // Force re-animation on page change
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="group h-full flex flex-col bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px] overflow-hidden hover:border-[var(--accent)] transition-colors cursor-pointer"
                  >
                    <div className="h-[200px] w-full overflow-hidden border-b border-[var(--border)] relative bg-[#111]">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100" 
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
                      <h4 className="font-[600] text-[18px] mb-[8px] text-[var(--text-primary)] whitespace-normal leading-[1.3]">{item.title}</h4>
                      <p className="text-[14px] text-[var(--text-secondary)] mt-auto pt-[12px] whitespace-normal">{item.type}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-[8px] pt-[24px] border-t border-[var(--border)]">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-[16px] py-[8px] bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)] rounded-[8px] text-[14px] font-[500] hover:text-[var(--text-primary)] hover:border-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              Prev
            </button>
            
            <div className="flex items-center gap-[4px]">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] text-[14px] font-[500] transition-all
                    ${currentPage === i + 1 
                      ? "bg-[var(--accent)] text-white border border-[var(--accent)]" 
                      : "bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-[16px] py-[8px] bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-secondary)] rounded-[8px] text-[14px] font-[500] hover:text-[var(--text-primary)] hover:border-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS } from "../lib/appwrite";
import { format } from "date-fns";

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const docSnap = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, id);
        if (docSnap) {
          setEvent({ id: docSnap.$id, ...docSnap });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--bg)] items-center justify-center p-[40px]">
        <div className="animate-spin text-[var(--accent)] w-8 h-8 rounded-full border-2 border-t-[var(--accent)] border-r-[var(--accent)] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-[40px] text-center bg-[var(--bg)]">
        <h1 className="text-[32px] font-bold text-[var(--text-primary)] mb-[16px]">Event tidak ditemukan</h1>
        <p className="text-[var(--text-secondary)] mb-[24px]">Event yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
        <button onClick={() => navigate('/events')} className="text-[var(--accent)] font-[500] hover:underline">
          Kembali ke Daftar Event
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto w-full px-[24px] py-[40px] md:py-[60px]">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-[8px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-[40px] font-[500]"
        >
          <ChevronLeft size={20} />
          <span>Kembali ke Events</span>
        </button>

        {/* Header */}
        <div className="mb-[40px]">
          <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-[800] tracking-tight leading-[1.1] text-[var(--text-primary)] mb-[24px]">
            {event.title}
          </h1>
          <div className="flex flex-col md:flex-row gap-[16px] md:items-center text-[var(--text-secondary)] mb-[24px]">
            <div className="flex items-center gap-[8px]">
              <span className="font-[600] text-[var(--text-primary)]">Tipe/Lokasi:</span>
              <span>{event.type}</span>
            </div>
            <div className="hidden md:block w-[4px] h-[4px] rounded-full bg-[var(--border)]"></div>
            <div className="flex items-center gap-[8px]">
              <span className="font-[600] text-[var(--text-primary)]">Tanggal:</span>
              <span>{event.date}</span>
            </div>
            <div className="hidden md:block w-[4px] h-[4px] rounded-full bg-[var(--border)]"></div>
            <div className="flex items-center gap-[8px]">
              <span className="font-[600] text-[var(--text-primary)]">Ditambahkan pada:</span>
              <span>{event.createdAt ? format(new Date(event.createdAt), "dd MMM yyyy") : ""}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-full mb-[56px] overflow-hidden rounded-[16px]">
          <img 
            src={event.image || "https://picsum.photos/1200/600"} 
            alt={event.title} 
            className="w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--accent)]"
          dangerouslySetInnerHTML={{ __html: event.content }}
        />
      </div>
    </div>
  );
}

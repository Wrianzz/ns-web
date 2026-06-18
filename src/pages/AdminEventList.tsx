import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, Query } from "../lib/appwrite";
import { Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface EventItem {
  id: string;
  title: string;
  type: string;
  date: string;
  createdAt: any;
}

export function AdminEventList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_DB_ID,
          APPWRITE_COLLECTION_EVENTS,
          [Query.orderDesc("createdAt")]
        );
        const docs = response.documents.map(doc => ({
          id: doc.$id,
          title: doc.title,
          type: doc.type,
          date: doc.date,
          createdAt: doc.createdAt
        })) as EventItem[];
        setEvents(docs);
      } catch (error) {
        console.error("Failed to list events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      try {
        await databases.deleteDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, id);
        setEvents(events.filter(e => e.id !== id));
      } catch (error) {
        console.error("Failed to delete event", error);
      }
    }
  };

  if (loading) {
    return <div className="p-[40px] text-center text-[var(--text-secondary)]">Memuat data...</div>;
  }

  return (
    <div className="p-[40px]">
      <div className="flex justify-between items-center mb-[32px]">
        <div>
          <h1 className="text-[28px] font-[700] text-[var(--text-primary)] tracking-tight">Kumpulan Event</h1>
          <p className="text-[var(--text-secondary)]">Kelola dokumentasi event.</p>
        </div>
        <Link to="/admin/events/new" className="bg-[var(--accent)] text-white px-[20px] py-[10px] rounded-[8px] font-[600] hover:opacity-90 transition-opacity">
          Event Baru
        </Link>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px] overflow-hidden">
        {events.length === 0 ? (
          <div className="p-[40px] text-center text-[var(--text-secondary)]">Belum ada event yang dibuat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)]">Event</th>
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)]">Tipe/Lokasi</th>
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)]">Tanggal</th>
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                    <td className="p-[16px]">
                      <p className="font-[600] text-[var(--text-primary)] text-[15px]">{ev.title}</p>
                    </td>
                    <td className="p-[16px] text-[14px] text-[var(--text-primary)]">{ev.type}</td>
                    <td className="p-[16px] text-[14px] text-[var(--text-secondary)]">{ev.date}</td>
                    <td className="p-[16px] text-right">
                      <div className="flex items-center justify-end gap-[8px]">
                        <Link 
                          to={`/events/${ev.id}`} 
                          target="_blank"
                          className="px-[12px] py-[6px] text-[13px] font-[500] border border-[var(--border)] rounded-[6px] hover:bg-[var(--bg)] text-[var(--text-secondary)]"
                        >
                          Lihat
                        </Link>
                        <Link 
                          to={`/admin/events/edit/${ev.id}`} 
                          className="p-[6px] text-[var(--text-secondary)] hover:bg-[var(--bg)] border border-[var(--border)] rounded-[6px] transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(ev.id)}
                          className="p-[6px] text-red-500 hover:bg-red-500/10 rounded-[6px] transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, ID, useAuthState } from "../lib/appwrite";
import { Save, ArrowLeft } from "lucide-react";

export function AdminEventEditor() {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Tulis ringkasan dokumentasi event di sini...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        className: "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !editor) return;
      try {
        const docSnap = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, id);
        if (docSnap) {
          setTitle(docSnap.title || "");
          setType(docSnap.type || "");
          setDate(docSnap.date || "");
          setImage(docSnap.image || "");
          editor.commands.setContent(docSnap.content || "");
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchEvent();
  }, [id, editor]);

  const handleSave = async () => {
    if (!title.trim() || !type.trim() || !date.trim() || !image.trim() || !editor?.getHTML() || !user) return;
    
    setSaving(true);
    try {
      const payload = {
        title,
        type,
        date,
        image,
        content: editor.getHTML(),
        updatedAt: new Date().toISOString(),
      };

      if (id) {
        await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, id, payload);
      } else {
        await databases.createDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, ID.unique(), {
          ...payload,
          authorId: user.$id,
          createdAt: new Date().toISOString(),
        });
      }
      navigate("/admin/events");
    } catch (error) {
      console.error("Failed to save event", error);
      setSaving(false);
    }
  };

  if (!editor || initialLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin text-[var(--accent)]">Memuat...</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center bg-[var(--bg)] font-sans">
      <header className="sticky top-0 z-10 w-full bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] px-[24px] py-[16px] flex items-center justify-between">
        <button 
          onClick={() => navigate("/admin/events")}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-[8px]"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        <div className="flex gap-[16px]">
          <button 
            onClick={handleSave} 
            disabled={saving || !title.trim() || !type.trim() || !date.trim() || !image.trim()}
            className="bg-[var(--accent)] text-white px-[20px] py-[8px] rounded-[100px] font-[600] text-[14px] hover:opacity-90 transition-opacity flex items-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} /> {saving ? "Menyimpan..." : "Publish Event"}
          </button>
        </div>
      </header>

      <div className="w-full max-w-3xl py-[40px] px-[24px]">
        <input
          type="text"
          placeholder="Nama Event"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-[40px] md:text-[48px] font-[800] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 mb-[24px]"
        />

        <div className="flex flex-col gap-[16px] mb-[40px] p-[24px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px]">
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Tipe / Lokasi (Contoh: Offline - Jakarta)</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Offline - Jakarta"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Tanggal (Contoh: 12 Nov 2026)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="12 Nov 2026"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">URL Gambar Thumbnail/Cover</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="flex items-center gap-[8px] mb-[24px] border-b border-[var(--border)] pb-[16px]">
          <button 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            className={`p-[8px] rounded-[6px] ${editor.isActive('bold') ? 'bg-white/10' : 'hover:bg-white/5'} font-bold text-[var(--text-primary)]`}
          >
            B
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            className={`p-[8px] rounded-[6px] ${editor.isActive('italic') ? 'bg-white/10' : 'hover:bg-white/5'} italic text-[var(--text-primary)]`}
          >
            I
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            className={`p-[8px] rounded-[6px] ${editor.isActive('heading', { level: 2 }) ? 'bg-white/10' : 'hover:bg-white/5'} font-bold text-[var(--text-primary)]`}
          >
            H2
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            className={`p-[8px] rounded-[6px] ${editor.isActive('blockquote') ? 'bg-white/10' : 'hover:bg-white/5'} text-[var(--text-primary)] font-serif`}
          >
            "
          </button>
          <button 
            onClick={() => {
              const url = window.prompt("URL Gambar:");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }} 
            className={`p-[8px] rounded-[6px] hover:bg-white/5 text-[var(--text-primary)]`}
          >
            Img
          </button>
        </div>

        <EditorContent editor={editor} className="text-[18px] md:text-[20px] text-[var(--text-secondary)] leading-[1.8]" />
      </div>
    </div>
  );
}

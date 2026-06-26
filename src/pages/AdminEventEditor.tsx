import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, ID, useAuthState } from "../lib/appwrite";
import { Save, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    tinymce: any;
  }
}

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const contentRef = useRef<string>("");

  useEffect(() => {
    const scriptId = "tinymce-cdn";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initEditor = () => {
      if (!window.tinymce || !textareaRef.current) return;

      window.tinymce.remove();
      window.tinymce.init({
        target: textareaRef.current,
        height: 500,
        menubar: false,
        skin: "oxide-dark",
        content_css: "dark",
        plugins: "lists link image table code wordcount",
        toolbar: "undo redo | blocks | bold italic strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | table image | code removeformat",
        branding: false,
        promotion: false,
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on("change keyup undo redo", () => {
            contentRef.current = editor.getContent();
          });
          editor.on("init", () => {
            if (contentRef.current) {
              editor.setContent(contentRef.current);
            }
          });
        },
      });
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js";
      script.referrerPolicy = "origin";
      script.onload = () => {
        initEditor();
      };
      document.body.appendChild(script);
    } else {
      if (window.tinymce) {
        initEditor();
      } else {
        script.onload = () => initEditor();
      }
    }

    return () => {
      if (window.tinymce) {
        window.tinymce.remove();
      }
    };
  }, []);

  // Ambil data Event dari Appwrite jika dalam mode edit
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const docSnap = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, id);
        if (docSnap) {
          setTitle(docSnap.title || "");
          setType(docSnap.type || "");
          setDate(docSnap.date || "");
          setImage(docSnap.image || "");
          
          const rawContent = docSnap.content || "";
          contentRef.current = rawContent;
          if (editorRef.current && editorRef.current.initialized) {
            editorRef.current.setContent(rawContent);
          }
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSave = async () => {
    const currentContent = editorRef.current ? editorRef.current.getContent() : contentRef.current;
    if (!title.trim() || !type.trim() || !date.trim() || !image.trim() || !currentContent || !user) return;
    
    setSaving(true);
    try {
      const payload = {
        title,
        type,
        date,
        image,
        content: currentContent,
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

  if (initialLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin text-[var(--accent)]">Memuat...</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center bg-[var(--bg)] font-sans">
      <header className="sticky top-0 z-20 w-full bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] px-[24px] py-[16px] flex items-center justify-between">
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

      <div className="w-full max-w-4xl py-[40px] px-[24px]">
        <input
          type="text"
          placeholder="Nama Event"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-[40px] md:text-[48px] font-[800] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 mb-[24px]"
        />

        <div className="flex flex-col gap-[16px] mb-[40px] p-[24px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
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

        {/* Kotak Kontainer TinyMCE */}
        <div className="rounded-[8px] overflow-hidden border border-[var(--border)] shadow-md">
          <textarea ref={textareaRef} />
        </div>

      </div>
    </div>
  );
}
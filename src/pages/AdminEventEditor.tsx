import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { databases, storage, APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, APPWRITE_BUCKET_ID, ID, useAuthState } from "../lib/appwrite";
import { Permission, Role } from "appwrite";
import { Save, ArrowLeft, Upload } from "lucide-react";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id && id !== "new");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const contentRef = useRef<string>("");

  const uploadToAppwrite = async (file: File | Blob, filename = "image.png") => {
    const actualFile = file instanceof File ? file : new File([file], filename, { type: file.type });
    
    const uploadedFile = await storage.createFile(
      APPWRITE_BUCKET_ID, 
      ID.unique(), 
      actualFile,
      [Permission.read(Role.any())]
    );
    
    const fileView = storage.getFileView(APPWRITE_BUCKET_ID, uploadedFile.$id);
    const url = typeof fileView === "string" ? fileView : fileView.toString();
    return url;
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadToAppwrite(file, file.name);
      setImage(url);
    } catch (error: any) {
      console.error("Gagal upload thumbnail:", error);
      alert("Gagal mengunggah gambar thumbnail: " + error.message);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

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
        
        images_upload_handler: async (blobInfo: any) => {
          try {
            const url = await uploadToAppwrite(blobInfo.blob(), blobInfo.filename());
            return url;
          } catch (err: any) {
            throw new Error("Gagal mengunggah: " + err.message);
          }
        },

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
      script.onload = () => initEditor();
      document.body.appendChild(script);
    } else {
      if (window.tinymce) initEditor();
      else script.onload = () => initEditor();
    }

    return () => { if (window.tinymce) window.tinymce.remove(); };
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || id === "new") return;
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
    if (!title.trim() || !type.trim() || !date.trim() || !image || !currentContent || !user) return;
    
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

      if (id && id !== "new") {
        await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, id, payload);
      } else {
        await databases.createDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_EVENTS, ID.unique(), {
          ...payload,
          authorId: user.$id,
          createdAt: new Date().toISOString(),
        });
      }
      navigate("/admin/events");
    } catch (error: any) {
      console.error("Failed to save event", error);
      alert("Gagal menyimpan ke database: " + error.message);
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
        <button onClick={() => navigate("/admin/events")} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-[8px]">
          <ArrowLeft size={18} /> Kembali
        </button>
        <div className="flex gap-[16px]">
          <button onClick={handleSave} disabled={saving || uploadingImage || !title.trim() || !type.trim() || !date.trim() || !image} className="bg-[var(--accent)] text-white px-[20px] py-[8px] rounded-[100px] font-[600] text-[14px] hover:opacity-90 transition-opacity flex items-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed">
            <Save size={16} /> {saving ? "Menyimpan..." : "Publish Event"}
          </button>
        </div>
      </header>

      <div className="w-full max-w-4xl py-[40px] px-[24px]">
        <input type="text" placeholder="Nama Event" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-[40px] md:text-[48px] font-[800] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 mb-[24px]" />

        <div className="flex flex-col gap-[16px] mb-[40px] p-[24px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div>
              <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Tipe / Lokasi</label>
              <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Offline - Jakarta" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
            </div>
            <div>
              <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Tanggal</label>
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="12 Nov 2026" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Gambar Thumbnail Event</label>
            <div className="flex items-center gap-[12px]">
              {image && (
                <img src={image} alt="Thumbnail Preview" className="h-[42px] w-[60px] object-cover rounded-[4px] border border-[var(--border)]" />
              )}
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-[8px] bg-[var(--bg)] border border-[var(--border)] border-dashed rounded-[8px] px-[16px] py-[10px] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
                <Upload size={16} />
                <span className="text-[14px]">{uploadingImage ? "Mengunggah..." : "Pilih File Gambar Lokal"}</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploadingImage} />
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-[8px] overflow-hidden border border-[var(--border)] shadow-md">
          <textarea ref={textareaRef} />
        </div>
      </div>
    </div>
  );
}
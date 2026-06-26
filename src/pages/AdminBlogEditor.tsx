import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, ID, useAuthState } from "../lib/appwrite";
import { Save, ArrowLeft } from "lucide-react";

// Daftarkan properti tinymce di objek window global
declare global {
  interface Window {
    tinymce: any;
  }
}

export function AdminBlogEditor() {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
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

      // Bersihkan instance lama jika ada sebelum inisialisasi ulang
      window.tinymce.remove();
      window.tinymce.init({
        target: textareaRef.current,
        height: 500,
        menubar: false,
        skin: "oxide-dark",       // Aktifkan skin dark mode TinyMCE
        content_css: "dark",      // Sesuaikan isi canvas teks dengan mode gelap
        plugins: "lists link image table code wordcount",
        toolbar: "undo redo | blocks | bold italic strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | table image | code removeformat",
        branding: false,          // Sembunyikan logo TinyMCE di kanan bawah
        promotion: false,         // Sembunyikan tombol upgrade premium
        setup: (editor: any) => {
          editorRef.current = editor;
          
          // Sinkronisasi isi text editor ke ref state lokal saat ada perubahan
          editor.on("change keyup undo redo", () => {
            contentRef.current = editor.getContent();
          });

          // Inject data awal jika proses fetching database selesai sebelum editor siap
          editor.on("init", () => {
            if (contentRef.current) {
              editor.setContent(contentRef.current);
            }
          });
        },
      });
    };

    // Load TinyMCE dari CDN Komunitas secara asinkron
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

  // Ambil data Blog dari Appwrite jika dalam mode edit
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const docSnap = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, id);
        if (docSnap) {
          setTitle(docSnap.title || "");
          setExcerpt(docSnap.excerpt || "");
          setCoverImage(docSnap.coverImage || "");
          setTags(docSnap.tags?.join(", ") || "");
          
          const rawContent = docSnap.content || "";
          contentRef.current = rawContent;
          
          // Jika editor sudah terlanjur dirender, langsung inject isinya
          if (editorRef.current && editorRef.current.initialized) {
            editorRef.current.setContent(rawContent);
          }
        }
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    const currentContent = editorRef.current ? editorRef.current.getContent() : contentRef.current;
    if (!title.trim() || !currentContent || !user) return;
    
    setSaving(true);
    try {
      const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      
      // Ambil teks murni tanpa HTML tag untuk kalkulasi readTime
      const plainText = editorRef.current ? editorRef.current.getContent({ format: 'text' }) : "";
      const wordCount = plainText.split(/\s+/).filter(Boolean).length;

      const payload = {
        title,
        excerpt,
        content: currentContent,
        coverImage: coverImage || "https://picsum.photos/seed/cyber/1200/600",
        tags: tagArray,
        updatedAt: new Date().toISOString(),
        readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`
      };

      if (id) {
        await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, id, payload);
      } else {
        await databases.createDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, ID.unique(), {
          ...payload,
          authorId: user.$id,
          authorName: user.name || user.email,
          authorAvatar: `https://picsum.photos/seed/${user.$id}/200/200`,
          createdAt: new Date().toISOString(),
        });
      }
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Failed to save blog", error);
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
          onClick={() => navigate("/admin/blogs")}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-[8px]"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        <div className="flex gap-[16px]">
          <button 
            onClick={handleSave} 
            disabled={saving || !title.trim()}
            className="bg-[var(--accent)] text-white px-[20px] py-[8px] rounded-[100px] font-[600] text-[14px] hover:opacity-90 transition-opacity flex items-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} /> {saving ? "Menyimpan..." : "Publish"}
          </button>
        </div>
      </header>

      <div className="w-full max-w-4xl py-[40px] px-[24px]">
        <input
          type="text"
          placeholder="Judul Artikel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-[40px] md:text-[48px] font-[800] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 mb-[24px]"
        />

        <div className="flex flex-col gap-[16px] mb-[40px] p-[24px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px]">
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Ringkasan (Excerpt)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[12px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div>
              <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">URL Gambar Sampul</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Tags (Pisahkan dengan koma)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Security, Web, Tutorial"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>
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
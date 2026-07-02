import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { databases, storage, APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, APPWRITE_BUCKET_ID, ID, useAuthState } from "../lib/appwrite";
import { Save, ArrowLeft, Upload } from "lucide-react";

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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const contentRef = useRef<string>("");

  // Fungsi untuk upload gambar (dipakai TinyMCE & Cover)
  const uploadImageToAppwrite = async (file: File) => {
    const uploadedFile = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
    const fileUrl = storage.getFileView(APPWRITE_BUCKET_ID, uploadedFile.$id);

    // Periksa apakah fileUrl berupa string atau objek URL
    return typeof fileUrl === 'string' ? fileUrl : fileUrl.href;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImageToAppwrite(file);
      setCoverImage(url);
    } catch (error) {
      console.error("Gagal upload cover:", error);
      alert("Gagal mengunggah gambar cover.");
    } finally {
      setUploadingCover(false);
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
        
        // KONFIGURASI UPLOAD GAMBAR TINYMCE KE APPWRITE
        images_upload_handler: async (blobInfo: any) => {
          try {
            const file = blobInfo.blob() as File;
            const url = await uploadImageToAppwrite(file);
            return url; // TinyMCE otomatis memasang URL ini ke tag <img>
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
      const plainText = editorRef.current ? editorRef.current.getContent({ format: 'text' }) : "";
      const wordCount = plainText.split(/\s+/).filter(Boolean).length;

      const payload = {
        title,
        excerpt,
        content: currentContent,
        coverImage,
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
        <button onClick={() => navigate("/admin/blogs")} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-[8px]">
          <ArrowLeft size={18} /> Kembali
        </button>
        <div className="flex gap-[16px]">
          <button onClick={handleSave} disabled={saving || uploadingCover || !title.trim()} className="bg-[var(--accent)] text-white px-[20px] py-[8px] rounded-[100px] font-[600] text-[14px] hover:opacity-90 transition-opacity flex items-center gap-[8px] disabled:opacity-50 disabled:cursor-not-allowed">
            <Save size={16} /> {saving ? "Menyimpan..." : "Publish"}
          </button>
        </div>
      </header>

      <div className="w-full max-w-4xl py-[40px] px-[24px]">
        <input type="text" placeholder="Judul Artikel" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-[40px] md:text-[48px] font-[800] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 mb-[24px]" />

        <div className="flex flex-col gap-[16px] mb-[40px] p-[24px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px]">
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Ringkasan (Excerpt)</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[12px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div>
              <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Gambar Sampul</label>
              
              {/* UPLOAD COVER IMAGE AREA */}
              <div className="w-full">
                {coverImage ? (
                  <div className="relative group w-full h-[160px] rounded-[8px] overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    
                    {/* Overlay yang muncul saat di-hover */}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white backdrop-blur-sm">
                      <Upload size={24} className="mb-2" />
                      <span className="text-[14px] font-[600]">
                        {uploadingCover ? "Mengunggah..." : "Ganti Gambar Sampul"}
                      </span>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full h-[160px] cursor-pointer flex flex-col items-center justify-center gap-[12px] bg-[var(--bg)] border border-[var(--border)] border-dashed rounded-[8px] px-[16px] py-[10px] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
                    <Upload size={28} />
                    <span className="text-[14px]">
                      {uploadingCover ? "Mengunggah..." : "Pilih File Gambar Lokal"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Tags (Pisahkan dengan koma)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Security, Web, Tutorial" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
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
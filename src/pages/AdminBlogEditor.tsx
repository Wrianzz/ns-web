import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, ID, useAuthState } from "../lib/appwrite";
import { Save, ArrowLeft } from "lucide-react";

export function AdminBlogEditor() {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Tulis ceritamu di sini...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        className: "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px]",
      },
    },
  });

  const handleSave = async () => {
    if (!title.trim() || !editor?.getHTML() || !user) return;
    
    setSaving(true);
    try {
      const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      
      const payload = {
        title,
        excerpt,
        content: editor.getHTML(),
        coverImage: coverImage || "https://picsum.photos/seed/cyber/1200/600",
        tags: tagArray,
        authorId: user.$id,
        authorName: user.name || user.email,
        authorAvatar: `https://picsum.photos/seed/${user.$id}/200/200`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readTime: `${Math.max(1, Math.ceil(editor.getText().split(" ").length / 200))} min read`
      };

      await databases.createDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, ID.unique(), payload);
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Failed to save blog", error);
      setSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="flex-1 flex flex-col items-center bg-[var(--bg)] font-sans">
      <header className="sticky top-0 z-10 w-full bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] px-[24px] py-[16px] flex items-center justify-between">
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

      <div className="w-full max-w-3xl py-[40px] px-[24px]">
        <input
          type="text"
          placeholder="Judul"
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

        {/* Medium-like Toolbar (Simple inline or top) */}
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
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            className={`p-[8px] rounded-[6px] ${editor.isActive('heading', { level: 3 }) ? 'bg-white/10' : 'hover:bg-white/5'} font-bold text-[var(--text-primary)]`}
          >
            H3
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

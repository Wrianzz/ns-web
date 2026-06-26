import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, ID, useAuthState } from "../lib/appwrite";
import { 
  Save, ArrowLeft, Bold, Italic, Strikethrough, 
  List, ListOrdered, Quote, Code, Image as ImageIcon, 
  Undo, Redo, Heading1, Heading2, Heading3
} from "lucide-react";

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
        className: "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[500px]",
      },
    },
  });

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || !editor) return;
      try {
        const docSnap = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, id);
        if (docSnap) {
          setTitle(docSnap.title || "");
          setExcerpt(docSnap.excerpt || "");
          setCoverImage(docSnap.coverImage || "");
          setTags(docSnap.tags?.join(", ") || "");
          editor.commands.setContent(docSnap.content || "");
        }
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchBlog();
  }, [id, editor]);

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
        updatedAt: new Date().toISOString(),
        readTime: `${Math.max(1, Math.ceil(editor.getText().split(" ").length / 200))} min read`
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

  if (!editor || initialLoading) return (
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

        {/* BookStack Style WYSIWYG Editor */}
        <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg)] shadow-sm overflow-hidden flex flex-col">
          
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-[4px] p-[8px] bg-[var(--card-bg)] border-b border-[var(--border)] sticky top-[72px] z-10">
            {/* Format Group */}
            <div className="flex items-center gap-[2px] pr-[8px] mr-[4px] border-r border-[var(--border)]">
              <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('bold') ? 'bg-[var(--border)]' : ''}`} title="Bold"><Bold size={18} /></button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('italic') ? 'bg-[var(--border)]' : ''}`} title="Italic"><Italic size={18} /></button>
              <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('strike') ? 'bg-[var(--border)]' : ''}`} title="Strikethrough"><Strikethrough size={18} /></button>
            </div>

            {/* Heading Group */}
            <div className="flex items-center gap-[2px] pr-[8px] mr-[4px] border-r border-[var(--border)]">
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('heading', { level: 1 }) ? 'bg-[var(--border)]' : ''}`} title="Heading 1"><Heading1 size={18} /></button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('heading', { level: 2 }) ? 'bg-[var(--border)]' : ''}`} title="Heading 2"><Heading2 size={18} /></button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('heading', { level: 3 }) ? 'bg-[var(--border)]' : ''}`} title="Heading 3"><Heading3 size={18} /></button>
            </div>

            {/* Lists & Quotes Group */}
            <div className="flex items-center gap-[2px] pr-[8px] mr-[4px] border-r border-[var(--border)]">
              <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('bulletList') ? 'bg-[var(--border)]' : ''}`} title="Bullet List"><List size={18} /></button>
              <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('orderedList') ? 'bg-[var(--border)]' : ''}`} title="Numbered List"><ListOrdered size={18} /></button>
              <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('blockquote') ? 'bg-[var(--border)]' : ''}`} title="Quote"><Quote size={18} /></button>
            </div>

            {/* Media Group */}
            <div className="flex items-center gap-[2px] pr-[8px] mr-[4px] border-r border-[var(--border)]">
              <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] ${editor.isActive('codeBlock') ? 'bg-[var(--border)]' : ''}`} title="Code Block"><Code size={18} /></button>
              <button onClick={() => { const url = window.prompt("URL Gambar:"); if (url) editor.chain().focus().setImage({ src: url }).run(); }} className={`p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)]`} title="Insert Image"><ImageIcon size={18} /></button>
            </div>

            {/* History Group */}
            <div className="flex items-center gap-[2px] ml-auto">
              <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] disabled:opacity-30" title="Undo"><Undo size={18} /></button>
              <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-[6px] rounded hover:bg-[var(--border)] text-[var(--text-primary)] disabled:opacity-30" title="Redo"><Redo size={18} /></button>
            </div>
          </div>

          {/* Editor Canvas */}
          <div 
            className="p-[32px] md:p-[48px] cursor-text min-h-[500px]" 
            onClick={() => editor.commands.focus()}
          >
            <EditorContent editor={editor} className="outline-none" />
          </div>
        </div>

      </div>
    </div>
  );
}
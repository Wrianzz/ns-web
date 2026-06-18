import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS } from "../lib/appwrite";
import { format } from "date-fns";

export function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const docSnap = await databases.getDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, id);
        if (docSnap) {
          setBlog({ id: docSnap.$id, ...docSnap });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch blog", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--bg)] items-center justify-center p-[40px]">
        <div className="animate-spin text-[var(--accent)] w-8 h-8 rounded-full border-2 border-t-[var(--accent)] border-r-[var(--accent)] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-[40px] text-center bg-[var(--bg)]">
        <h1 className="text-[32px] font-bold text-[var(--text-primary)] mb-[16px]">Artikel tidak ditemukan</h1>
        <p className="text-[var(--text-secondary)] mb-[24px]">Artikel yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
        <button onClick={() => navigate('/blog')} className="text-[var(--accent)] font-[500] hover:underline">
          &larr; Kembali ke Daftar Blog
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)] font-sans">
      <article className="container mx-auto px-[24px] md:px-[40px] max-w-3xl py-[60px]">
        {/* Navigation & Thread */}
        <Link to="/blog" className="inline-flex items-center text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-[40px]">
          <ChevronLeft size={16} className="mr-[4px]" /> Kembali ke Daftar Blog
        </Link>

        {/* Header Section */}
        <header className="mb-[40px]">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[36px] md:text-[48px] font-[800] tracking-tight text-[var(--text-primary)] leading-[1.2] mb-[24px]"
          >
            {blog.title}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[20px] md:text-[22px] text-[var(--text-secondary)] leading-[1.5] mb-[32px] font-[400]"
          >
            {blog.excerpt}
          </motion.h2>

          {/* Author Block */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-[16px] py-[24px] border-t border-b border-[var(--border)]"
          >
            <img 
              src={blog.authorAvatar || `https://picsum.photos/seed/${blog.authorName}/200/200`} 
              alt={blog.authorName} 
              className="w-[48px] h-[48px] rounded-full object-cover" 
            />
            <div className="flex flex-col">
              <span className="text-[16px] font-[600] text-[var(--text-primary)]">{blog.authorName}</span>
              <div className="flex items-center gap-[8px] text-[14px] text-[var(--text-secondary)]">
                <span>{blog.readTime}</span>
                <span>•</span>
                <span>{blog.createdAt ? format(new Date(blog.createdAt), "dd MMM yyyy") : ""}</span>
              </div>
            </div>
            
            <div className="ml-auto">
              <button className="px-[16px] py-[6px] bg-[var(--accent)] text-white text-[13px] font-[600] rounded-[100px] hover:opacity-90 transition-opacity">
                Ikuti
              </button>
            </div>
          </motion.div>
        </header>

        {/* Cover Image */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="w-full mb-[56px] overflow-hidden rounded-[16px]"
        >
          <img 
            src={blog.coverImage || "https://picsum.photos/1200/600"} 
            alt={blog.title} 
            className="w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--accent)]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer Tags */}
        <div className="mt-[64px] pt-[32px] border-t border-[var(--border)] flex flex-wrap gap-[12px]">
          {(blog.tags || []).map((tag: string) => (
            <span key={tag} className="px-[16px] py-[6px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[8px] text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

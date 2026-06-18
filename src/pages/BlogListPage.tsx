import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, Query } from "../lib/appwrite";
import { format } from "date-fns";

export function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_DB_ID,
          APPWRITE_COLLECTION_BLOGS,
          [Query.orderDesc("createdAt")]
        );
        const fetched = response.documents.map(doc => ({ id: doc.$id, ...doc }));
        setBlogs(fetched);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--bg)] items-center justify-center p-[40px]">
        <div className="animate-spin text-[var(--accent)] w-8 h-8 rounded-full border-2 border-t-[var(--accent)] border-r-[var(--accent)] border-b-transparent border-l-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)]">
      <div className="container mx-auto px-[40px] max-w-5xl py-[60px]">
        <div className="mb-[48px] text-center md:text-left">
          <h1 className="text-[40px] md:text-[48px] font-[800] tracking-tight text-[var(--text-primary)] mb-[16px]">Blog & Artikel</h1>
          <p className="text-[18px] text-[var(--text-secondary)] max-w-2xl">
            Tingkatkan wawasan keamanan siber Anda dengan tulisan mendalam, panduan teknis, dan opini dari para ahli di komunitas kami.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] py-[40px]">Belum ada artikel yang dipublikasikan.</div>
        ) : (
          <div className="flex flex-col gap-[40px]">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group flex flex-col md:flex-row gap-[32px] items-start pb-[40px] border-b border-[var(--border)] last:border-b-0"
              >
                {/* Blog Metadata & Excerept */}
                <div className="flex-1 order-2 md:order-1">
                  {/* Author Info */}
                  <div className="flex items-center gap-[12px] mb-[16px]">
                    <img 
                      src={blog.authorAvatar || `https://picsum.photos/seed/${blog.authorName}/200/200`} 
                      alt={blog.authorName} 
                      className="w-[32px] h-[32px] rounded-full object-cover" 
                    />
                    <div>
                      <span className="text-[14px] font-[600] text-[var(--text-primary)] mr-[8px]">{blog.authorName}</span>
                      <span className="text-[13px] text-[var(--text-secondary)]">
                        • {blog.createdAt ? format(new Date(blog.createdAt), "dd MMM yyyy") : ""}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <Link to={`/blog/${blog.id}`} className="block">
                    <h2 className="text-[24px] md:text-[28px] font-[700] tracking-tight text-[var(--text-primary)] mb-[12px] group-hover:text-[var(--accent)] transition-colors leading-[1.3]">
                      {blog.title}
                    </h2>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-[1.6] mb-[24px]">
                      {blog.excerpt}
                    </p>
                  </Link>

                  {/* Footer details (Tags & Read Time) */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-[8px]">
                      {(blog.tags || []).map((tag: string) => (
                        <span key={tag} className="px-[12px] py-[4px] bg-[var(--card-bg)] border border-[var(--border)] rounded-[100px] text-[12px] text-[var(--text-secondary)] font-[500]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[13px] text-[var(--text-secondary)] font-[500]">
                      {blog.readTime}
                    </span>
                  </div>
                </div>

                {/* Cover Image Thumbnail */}
                <Link to={`/blog/${blog.id}`} className="w-full md:w-[300px] lg:w-[350px] shrink-0 order-1 md:order-2 overflow-hidden rounded-[12px]">
                  <img 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

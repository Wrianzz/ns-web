import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { databases, APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, Query } from "../lib/appwrite";
import { Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  createdAt: any;
  authorName: string;
}

export function AdminBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_DB_ID,
          APPWRITE_COLLECTION_BLOGS,
          [Query.orderDesc("createdAt")]
        );
        const docs = response.documents.map(doc => ({
          id: doc.$id,
          title: doc.title,
          excerpt: doc.excerpt,
          createdAt: doc.createdAt,
          authorName: doc.authorName
        })) as Blog[];
        setBlogs(docs);
      } catch(error) {
        console.error("Failed to list blogs", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus blog ini?")) {
      try {
        await databases.deleteDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_BLOGS, id);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (error) {
        console.error("Failed to delete blog", error);
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
          <h1 className="text-[28px] font-[700] text-[var(--text-primary)] tracking-tight">Kumpulan Blog</h1>
          <p className="text-[var(--text-secondary)]">Kelola artikel dan tulisan Anda.</p>
        </div>
        <Link to="/admin/blogs/new" className="bg-[var(--accent)] text-white px-[20px] py-[10px] rounded-[8px] font-[600] hover:opacity-90 transition-opacity">
          Tulis Baru
        </Link>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[12px] overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-[40px] text-center text-[var(--text-secondary)]">Belum ada blog yang dibuat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)]">Judul</th>
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)]">Penulis</th>
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)]">Tanggal</th>
                  <th className="p-[16px] text-[14px] font-[600] text-[var(--text-secondary)] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                    <td className="p-[16px]">
                      <p className="font-[600] text-[var(--text-primary)] text-[15px]">{blog.title}</p>
                      <p className="text-[13px] text-[var(--text-secondary)] line-clamp-1 max-w-[400px]">{blog.excerpt}</p>
                    </td>
                    <td className="p-[16px] text-[14px] text-[var(--text-primary)]">{blog.authorName}</td>
                    <td className="p-[16px] text-[14px] text-[var(--text-secondary)]">
                      {blog.createdAt?.toDate ? format(blog.createdAt.toDate(), "dd MMM yyyy") : "-"}
                    </td>
                    <td className="p-[16px] text-right">
                      <div className="flex items-center justify-end gap-[8px]">
                        <Link 
                          to={`/blog/${blog.id}`} 
                          target="_blank"
                          className="px-[12px] py-[6px] text-[13px] font-[500] border border-[var(--border)] rounded-[6px] hover:bg-[var(--bg)] text-[var(--text-secondary)]"
                        >
                          Lihat
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id)}
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

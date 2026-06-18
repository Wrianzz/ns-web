import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { account, useAuthState } from "../../lib/appwrite";
import { Shield, FileText, PlusCircle, LogOut } from "lucide-react";

export function AdminLayout() {
  const [user, loading] = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin-login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin text-[var(--accent)]">
          <Shield size={32} />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/admin-login');
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-full md:w-[250px] bg-[var(--card-bg)] border-r border-b md:border-b-0 border-[var(--border)] flex flex-col shrink-0">
        <div className="p-[24px]">
          <h2 className="text-[18px] font-[700] text-[var(--text-primary)] flex items-center gap-[8px]">
            <Shield size={18} className="text-[var(--accent)]" /> 
            Admin Panel
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-[8px] break-all">{user.email}</p>
        </div>

        <nav className="flex-1 flex flex-col gap-[8px] px-[16px] py-[8px]">
          <Link 
            to="/admin/blogs" 
            className={`flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] font-[500] text-[14px] transition-colors ${location.pathname === '/admin/blogs' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'}`}
          >
            <FileText size={18} />
            Daftar Blog
          </Link>
          <Link 
            to="/admin/events" 
            className={`flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] font-[500] text-[14px] transition-colors ${location.pathname === '/admin/events' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'}`}
          >
            <FileText size={18} />
            Daftar Event
          </Link>
          <Link 
            to="/admin/blogs/new" 
            className={`flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] font-[500] text-[14px] transition-colors ${location.pathname === '/admin/blogs/new' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'}`}
          >
            <PlusCircle size={18} />
            Tulis Baru
          </Link>
        </nav>

        <div className="p-[16px] mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-[12px] px-[16px] py-[10px] w-full rounded-[8px] border border-[var(--border)] text-[var(--text-primary)] hover:border-red-500/50 hover:text-red-500 transition-colors font-[500] text-[14px]"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full md:h-[calc(100vh-64px)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

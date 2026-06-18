import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account, useAuthState } from "../lib/appwrite";
import { Shield } from "lucide-react";

export function AdminLogin() {
  const [user, loading] = useAuthState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorObj, setErrorObj] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/admin/blogs');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    setErrorObj(null);
    try {
      await account.createEmailPasswordSession(email, password);
      // Wait a bit to ensure session is created and reload occurs mostly through state or navigate
      navigate('/admin/blogs');
    } catch (err: any) {
      console.error(err);
      setErrorObj(err);
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin text-[var(--accent)]">
          <Shield size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg)] p-[40px]">
      <div className="max-w-md w-full bg-[var(--card-bg)] border border-[var(--border)] p-[40px] rounded-[16px] text-center shadow-xl">
        <div className="w-[48px] h-[48px] bg-[var(--accent)] rounded-[12px] flex items-center justify-center text-white mx-auto mb-[24px]">
          <Shield size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-[24px] font-[800] text-[var(--text-primary)] mb-[8px]">Admin Portal</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mb-[32px]">
          Login dengan email dan password administrator Anda untuk mengakses dashboard.
        </p>

        {errorObj && (
          <div className="mb-[24px] p-[12px] bg-red-500/10 border border-red-500/20 text-red-500 rounded-[8px] text-[13px]">
            {errorObj.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-[16px] text-left">
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" 
              placeholder="admin@nusa-siber.com"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-[600] text-[var(--text-secondary)] mb-[8px]">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[8px] px-[16px] py-[10px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" 
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full py-[12px] px-[24px] bg-[var(--accent)] text-white font-[600] rounded-[8px] hover:opacity-90 transition-opacity mt-[8px] disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}


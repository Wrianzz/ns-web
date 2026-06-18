import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { EventsPage } from "./pages/EventsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminBlogList } from "./pages/AdminBlogList";
import { AdminBlogEditor } from "./pages/AdminBlogEditor";
import { AdminEventList } from "./pages/AdminEventList";
import { AdminEventEditor } from "./pages/AdminEventEditor";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[var(--accent-glow)]">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="blogs" element={<AdminBlogList />} />
            <Route path="blogs/new" element={<AdminBlogEditor />} />
            <Route path="events" element={<AdminEventList />} />
            <Route path="events/new" element={<AdminEventEditor />} />
          </Route>

          {/* Public Routes with Navbar & Footer */}
          <Route path="*" element={
            <>
              <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

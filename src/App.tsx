import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

// Wrapper component to selectively hide Navbar and Footer on admin/login if needed
// (Though we want them globally consistent, we can coordinate paths here)
function AppLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("nbi_dark_mode") === "true";
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("nbi_dark_mode", String(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.documentElement.classList.add("dark");
    } else {
      document.body.classList.remove("dark-theme");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const isAdminOrLoginPath = location.pathname === "/admin" || location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen text-brand-text dark:text-slate-100 bg-brand-bg dark:bg-slate-950 transition-colors duration-300">
      {/* Sticky Top Header */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Body */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Academic Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

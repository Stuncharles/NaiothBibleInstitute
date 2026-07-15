import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, BookOpen, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authService } from "../services/authService";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user session has changed (e.g. login/logout)
    setUser(authService.getCurrentUser());
  }, [location]);

  const navLinks = [
    { name: "Home", href: "home-section" },
    { name: "About", href: "about-section" },
    { name: "Why Join", href: "why-join-section" },
    { name: "Courses", href: "courses-section" },
    { name: "Timeline", href: "timeline-section" },
    { name: "Instructors", href: "instructors-section" },
    { name: "FAQ", href: "faq-section" },
    { name: "Contact", href: "contact-section" },
  ];

  const handleLinkClick = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate(`/?scroll=${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-slate-900/90 shadow-md backdrop-blur-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            id="nav-logo"
            to="/"
            onClick={() => handleLinkClick("home-section")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="p-2 bg-brand-blue dark:bg-brand-accent rounded-xl text-white group-hover:rotate-6 transition-transform duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-brand-blue dark:text-white tracking-tight">
                NAIOTH
              </span>
              <span className="block text-[10px] font-bold text-brand-gold tracking-widest uppercase">
                BIBLE INSTITUTE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                id={`nav-link-${link.href}`}
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-accent dark:hover:text-brand-gold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Actions & Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-accent dark:hover:text-brand-gold transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Register Action */}
            <button
              id="nav-register-btn"
              onClick={() => handleLinkClick("register-section")}
              className="px-5 py-2.5 bg-brand-blue hover:bg-brand-accent text-white dark:bg-brand-accent dark:hover:bg-brand-blue text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border border-brand-accent/20"
            >
              Apply Now
            </button>

            {/* Admin Dashboard Connection */}
            {user ? (
              <Link
                id="nav-dashboard-link"
                to="/admin"
                className="flex items-center space-x-1 px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            ) : (
              <Link
                id="nav-login-link"
                to="/login"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-white transition-colors flex items-center gap-1.5 text-sm font-semibold"
                title="Admin Portal"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              id="mobile-dark-mode-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-20 left-0 w-full glass dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl py-6 px-4"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  id={`mobile-nav-link-${link.href}`}
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="px-4 py-3 text-left font-bold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-accent transition-colors"
                >
                  {link.name}
                </button>
              ))}

              <div className="border-t border-slate-200 dark:border-slate-800 my-4 pt-4 flex flex-col gap-3">
                <button
                  id="mobile-drawer-apply-btn"
                  onClick={() => handleLinkClick("register-section")}
                  className="w-full text-center py-3 bg-brand-blue hover:bg-brand-accent text-white dark:bg-brand-accent dark:hover:bg-brand-blue font-bold rounded-xl"
                >
                  Apply Now
                </button>

                {user ? (
                  <Link
                    id="mobile-drawer-dashboard-link"
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 rounded-xl font-bold"
                  >
                    Go to Admin Portal
                  </Link>
                ) : (
                  <Link
                    id="mobile-drawer-login-link"
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold rounded-xl"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

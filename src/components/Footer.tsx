import { BookOpen, MapPin, Mail, Phone, Calendar, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-blue text-slate-300 border-t border-brand-accent/20">
      
      {/* Top Footer Widgets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Logo Column */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-brand-accent rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight">NAIOTH</span>
                <span className="block text-[10px] font-bold text-brand-gold tracking-widest uppercase">
                  BIBLE INSTITUTE
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-sm">
              Naioth Bible Institute is a premier educational center dedicated to raising sound theologians and leaders grounded in the absolute truth of Scripture and spiritual character.
            </p>

            <div className="flex items-center space-x-3 pt-2 text-xs">
              <span className="px-2.5 py-1 bg-brand-gold/10 text-brand-gold rounded-md font-black uppercase tracking-wider">
                COHORT 2026
              </span>
              <span className="text-slate-400 font-bold">Admissions Active</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <a href="#about-section" className="hover:text-brand-gold transition-colors">
                  About NBI
                </a>
              </li>
              <li>
                <a href="#courses-section" className="hover:text-brand-gold transition-colors">
                  Course Outline
                </a>
              </li>
              <li>
                <a href="#timeline-section" className="hover:text-brand-gold transition-colors">
                  Academic Schedule
                </a>
              </li>
              <li>
                <a href="#instructors-section" className="hover:text-brand-gold transition-colors">
                  Faculty Lecturers
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Support Portal</h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <a href="#faq-section" className="hover:text-brand-gold transition-colors">
                  FAQs & Answers
                </a>
              </li>
              <li>
                <a href="#contact-section" className="hover:text-brand-gold transition-colors">
                  Inquire Now
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-gold transition-colors text-slate-400">
                  Registrar Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Contact Contacts</h4>
            <ul className="space-y-3.5 text-xs font-bold text-slate-400">
              <li className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  God's Army Revival Tent,<br />
                  No. 293 Okigwe Road,<br />
                  Opposite Nipcogas Station,<br />
                  Off Orji Junction,<br />
                  Owerri, Imo State.
                </span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="mailto:Ihuomaifeanyi51@gmail.com" className="hover:text-brand-gold">
                  Ihuomaifeanyi51@gmail.com
                </a>
              </li>
              <li className="flex gap-2.5 items-start">
                <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+2347038482307" className="hover:text-brand-gold">+234 703 848 2307</a>
                  <a href="tel:+2349036261007" className="hover:text-brand-gold">+234 903 626 1007</a>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal / Copyright & Back to Top */}
      <div className="bg-slate-950 text-slate-500 py-6 text-xs font-bold border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div>
            <p>© {currentYear} Naioth Bible Institute. All Rights Reserved. Accredited Module Program.</p>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300">
              Admin Login
            </Link>
            <button
              id="footer-back-to-top-btn"
              onClick={scrollToTop}
              className="p-2 bg-brand-blue border border-brand-accent/20 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Scroll Top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}

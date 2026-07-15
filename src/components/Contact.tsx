import { MapPin, Mail, Phone, Clock, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { motion } from "motion/react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: "", email: "", msg: "" });
    }, 4000);
  };

  return (
    <section id="contact-section" className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
            Contact Our Administrative Office
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
            Have custom inquiries or partner sponsorship questions? Send us a direct message or contact us through our administrative channels.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md space-y-8">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Administrative Information</h3>
              
              <div className="space-y-6">
                
                {/* Office address */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">OFFICE LOCATION</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                      God's Army Revival Tent,<br />
                      No. 293 Okigwe Road,<br />
                      Opposite Nipcogas Station,<br />
                      Off Orji Junction,<br />
                      Owerri, Imo State.
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-xl shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">EMAIL ADDRESS</span>
                    <a href="mailto:info@naioth.org" className="text-sm font-bold text-brand-accent dark:text-brand-gold hover:underline">
                      info@naioth.org
                    </a>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">TELEPHONE CONTACT</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      +234 803 456 7890, +234 812 987 6543
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">OPERATING HOURS</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-medium">
                      Mon – Fri: 9:00 AM – 4:00 PM (GMT+1)
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column - Direct Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-6">Send Direct Message</h3>
              
              <form onSubmit={handleSend} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel Uchenna"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. sam@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message Text</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your inquiry..."
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                  />
                </div>

                {/* Notification banners */}
                {sent && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Inquiry sent successfully! Our academic registrar will respond via email.</span>
                  </div>
                )}

                <button
                  id="contact-btn-submit"
                  type="submit"
                  className="w-full py-3.5 bg-brand-blue hover:bg-brand-accent text-white font-extrabold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

import { Calendar, Monitor, MapPin, Sparkles, BookOpen, Clock, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onRegisterClick: () => void;
  onLearnMoreClick: () => void;
}

export default function Hero({ onRegisterClick, onLearnMoreClick }: HeroProps) {
  const badges = [
    { icon: <Monitor className="w-4 h-4 text-brand-gold" />, label: "Online (Zoom & Classroom)" },
    { icon: <MapPin className="w-4 h-4 text-brand-gold" />, label: "Onsite Classes" },
    { icon: <Calendar className="w-4 h-4 text-brand-gold" />, label: "Weekend Classes" },
    { icon: <Clock className="w-4 h-4 text-brand-gold" />, label: "Recorded Sessions" },
  ];

  return (
    <section
      id="home-section"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Animated Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-blue/10 dark:bg-brand-accent/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-gold/10 dark:bg-brand-gold/5 blur-[150px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-brand-accent/10 dark:bg-brand-blue/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-blue/10 dark:bg-brand-accent/20 border border-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0"
            >
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              <span>Basic Theology Module 2026</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-blue dark:text-white leading-none"
              >
                Equipping Saints for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold dark:from-brand-accent dark:to-amber-400">
                  Marketplace Ministry
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl font-bold text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0"
              >
                Six Weeks Intensive Training of deep biblical studies, theological foundations, and leadership development designed for today's global influencers.
              </motion.p>
            </div>

            {/* Event Dates Flag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200/60 dark:border-slate-700/60 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-gold/20 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">MODULE TIMELINE</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white">Aug 21 – Sept 27, 2026</span>
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-left sm:text-right">
                <span className="text-xs font-extrabold text-brand-accent dark:text-brand-gold block">NOW OPEN FOR</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Cohort Registration</span>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 pt-2"
            >
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 text-left"
                >
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    {b.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{b.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                id="hero-register-btn"
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-brand-accent dark:bg-brand-accent dark:hover:bg-brand-blue text-white font-extrabold rounded-2xl shadow-xl hover:shadow-brand-accent/20 hover:-translate-y-0.5 transition-all text-base cursor-pointer border border-brand-accent/20"
              >
                Register Now
              </button>
              <button
                id="hero-learn-more-btn"
                onClick={onLearnMoreClick}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-extrabold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-base cursor-pointer"
              >
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Hero Right Visuals - High Polish Theological Card Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-900/90"
            >
              {/* Card Banner */}
              <div className="h-44 bg-gradient-to-tr from-brand-blue to-indigo-900 relative p-6 flex flex-col justify-between text-white">
                <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507697364665-69eec30ea71e?auto=format&fit=crop&q=80')" }} />
                <div className="flex justify-between items-start z-10">
                  <div className="px-3 py-1 bg-brand-gold/20 border border-brand-gold/30 rounded-full text-brand-gold text-[10px] font-bold tracking-widest uppercase">
                    PROSPECTUS 2026
                  </div>
                  <BookOpen className="w-6 h-6 text-brand-gold animate-bounce" />
                </div>
                <div className="z-10">
                  <span className="block text-2xl font-black tracking-tight leading-none text-white">NAIOTH</span>
                  <span className="text-xs font-bold text-slate-300 tracking-wider">Bible Institute Admission Portal</span>
                </div>
              </div>

              {/* Card Body Information */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">ELIGIBILITY & FOCUS</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                    Designed for pastors, ministry leaders, marketplace professionals, and anyone desiring deep spiritual formation and solid theological structure.
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400 dark:text-slate-500">TUITION STATUS</span>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold rounded-md">FREE (Sponsored)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400 dark:text-slate-500">MODULE STATUS</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">Six Weeks Intensive</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400 dark:text-slate-500">CERTIFICATE</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">Yes, upon completion</span>
                  </div>
                </div>

                <div className="p-4 bg-brand-blue/5 dark:bg-brand-accent/5 border border-brand-blue/10 dark:border-brand-accent/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Registration Status:</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">ACTIVE & OPEN</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pt-16">
          <motion.button
            id="scroll-to-about-btn"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={onLearnMoreClick}
            className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-brand-accent transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold tracking-widest uppercase">Discover More</span>
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

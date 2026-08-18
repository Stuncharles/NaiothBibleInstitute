import { CalendarCheck, BookOpen, Scroll, GraduationCap, Flame, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Timeline() {
  const steps = [
    {
      phase: "Registration & Prep",
      title: "Registration Opens",
      date: "July 1 – August 18, 2026",
      desc: "Applicants fill out the online portal. Secure your registration slot early. Direct study materials and orientation details are sent via email.",
      icon: <CalendarCheck className="w-5 h-5 text-white" />,
      color: "bg-amber-500"
    },
    {
      phase: "Week 1",
      title: "Foundations of Faith",
      date: "August 21 – 23, 2026",
      desc: "Introduction to Basic Theology & Bibliology. Study the divine inspiration of Scripture and structural outlines of Old & New Testaments.",
      icon: <BookOpen className="w-5 h-5 text-white" />,
      color: "bg-brand-blue"
    },
    {
      phase: "Week 2",
      title: "Hermeneutics & Study Tools",
      date: "August 28 – 30, 2026",
      desc: "Deepening textual interpretation. Learning context, literary devices, and correct translation rules to avoid doctrinarian errors.",
      icon: <BookOpen className="w-5 h-5 text-white" />,
      color: "bg-brand-blue"
    },
    {
      phase: "Week 3",
      title: "Spiritual Character & Devotions",
      date: "September 4 – 6, 2026",
      desc: "Focusing on prayer structures, Christian maturity, personal holiness, and spiritual leadership development.",
      icon: <Flame className="w-5 h-5 text-white" />,
      color: "bg-brand-blue"
    },
    {
      phase: "Week 4",
      title: "Christian Apologetics",
      date: "September 11 – 13, 2026",
      desc: "Building intellectual frameworks to defend foundational truths of Christ's resurrection, biblical historical accuracy, and gospel ethics.",
      icon: <BookOpen className="w-5 h-5 text-white" />,
      color: "bg-brand-blue"
    },
    {
      phase: "Week 5",
      title: "Business & Marketplace Ministry",
      date: "September 18 – 20, 2026",
      desc: "Stewardship and corporate workplace strategies. Activating the Great Commission inside boardrooms, businesses, and executive offices.",
      icon: <Scroll className="w-5 h-5 text-white" />,
      color: "bg-brand-blue"
    },
    {
      phase: "Graduation",
      title: "Commencement & Graduation",
      date: "September 27, 2026",
      desc: "Joint graduation ceremony. Commissioning of participants, distribution of accredited Certificates, and post-module marketplace networking.",
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      color: "bg-emerald-500"
    }
  ];

  return (
    <section id="timeline-section" className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
            Chronology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
            Academic Schedule & Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
            From registration opening to final graduation, plan your commitment around these specific dates.
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 transform -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className="flex flex-col md:flex-row items-start md:items-center relative">
                  
                  {/* Timeline Badge/Dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className={`w-12 h-12 rounded-full ${step.color} shadow-lg border-4 border-white dark:border-slate-950 flex items-center justify-center`}
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  {/* Desktop Layout - Left / Right alignment */}
                  <div className="w-full flex flex-col md:flex-row md:justify-between items-stretch pl-16 md:pl-0">
                    
                    {/* Left box - visible if even */}
                    <div className={`md:w-[44%] ${isEven ? "md:order-1 md:text-right" : "md:order-2 md:opacity-0 md:pointer-events-none"}`}>
                      {isEven && (
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md"
                        >
                          <span className="text-xs font-black text-brand-accent dark:text-brand-gold uppercase tracking-wider block mb-1">
                            {step.phase}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">{step.title}</h3>
                          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-3">
                            {step.date}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{step.desc}</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Middle gap spacer */}
                    <div className="hidden md:block w-[12%] md:order-2" />

                    {/* Right box - visible if odd */}
                    <div className={`md:w-[44%] ${!isEven ? "md:order-3 md:text-left" : "md:order-1 md:opacity-0 md:pointer-events-none"}`}>
                      {!isEven && (
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md"
                        >
                          <span className="text-xs font-black text-brand-accent dark:text-brand-gold uppercase tracking-wider block mb-1">
                            {step.phase}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">{step.title}</h3>
                          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-3">
                            {step.date}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{step.desc}</p>
                        </motion.div>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

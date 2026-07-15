import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FAQ() {
  const faqs = [
    {
      question: "Is this theology program completely free?",
      answer: "Yes, the tuition for the Basic Theology Module at Naioth Bible Institute is 100% free. The entire cost of lectures, administration, and materials is sponsored by partners. Students only need to cover their basic registration commitment."
    },
    {
      question: "Who is eligible to register for this course?",
      answer: "The program is open to pastors, ministers, cellular group leaders, Christian business leaders, corporate workers, and any believer hungry to establish a structured biblical and apologetic foundation."
    },
    {
      question: "Can I attend classes entirely online?",
      answer: "Absolutely! We offer a full hybrid delivery mode. You can join live online sessions via Zoom/Google Classroom, ask questions, and complete coursework. We also provide onsite classes for local students, and post recorded playbacks of all lectures."
    },
    {
      question: "What are the requirements for graduation?",
      answer: "To qualify for graduation and receive the Certificate of Participation, students must maintain at least 80% attendance in lectures (either onsite or live/recorded online tracking) and complete the simple modules questionnaires."
    },
    {
      question: "How long is the program, and what are the class timings?",
      answer: "The Basic Theology Module is an intensive 6-week training starting August 21 and ending with graduation on September 27, 2026. Lectures are held during the weekends (Friday evenings and Saturday afternoons) to accommodate busy schedules."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
            Support Info
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
            Find answers to common logistical, doctrinal, and operational inquiries regarding Naioth Bible Institute.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <div
                id={`faq-item-${i}`}
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 overflow-hidden transition-colors"
              >
                <button
                  id={`faq-btn-${i}`}
                  onClick={() => toggleFAQ(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-brand-accent dark:text-brand-gold shrink-0" />
                    <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                    {isOpen ? <Minus className="w-4 h-4 text-slate-500" /> : <Plus className="w-4 h-4 text-slate-500" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed border-t border-slate-100 dark:border-slate-800/55 bg-white/50 dark:bg-slate-900/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

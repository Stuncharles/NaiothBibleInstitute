import { Calendar, Monitor, Film, Award, Users, Gift } from "lucide-react";
import { motion } from "motion/react";

export default function Features() {
  const cards = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Weekend Classes",
      description: "Convenient scheduling structured for busy professionals, marketplace workers, and students."
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Flexible Learning",
      description: "Attend onsite classes or stream lectures live online from anywhere in the world."
    },
    {
      icon: <Film className="w-6 h-6" />,
      title: "Recorded Sessions",
      description: "Never miss a lecture. Access our comprehensive library of session playbacks at any time."
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Free Tuition",
      description: "NBI is fully funded by sponsors. Your education is free of tuition costs; registration is all you need."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Experienced Lecturers",
      description: "Learn from anointed theologians, seasoned pastors, and active marketplace leaders."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certificate of Participation",
      description: "Receive an official, accredited certificate upon successful graduation from the program."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="why-join-section" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full border border-slate-200 dark:border-slate-800/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
            Program Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
            Why Study at Naioth Bible Institute?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
            We provide a world-class theology training program that pairs spiritual depth with ultimate convenience and flexibility.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cards.map((card, i) => (
            <motion.div
              id={`feature-card-${i}`}
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md group transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight mb-3">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

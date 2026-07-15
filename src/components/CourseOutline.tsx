import { Book, Compass, ShieldAlert, Award, Briefcase } from "lucide-react";
import { motion } from "motion/react";

export default function CourseOutline() {
  const courses = [
    {
      icon: <Book className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Basic Theology",
      color: "border-indigo-500/20",
      bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
      description: "An in-depth study of the core doctrines of Christian faith: bibliology, theology proper, christology, pneumatology, and eschatology.",
      topics: ["Doctrine of Scripture", "The Nature of God", "Work of Christ", "Holy Spirit"]
    },
    {
      icon: <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: "Hermeneutics",
      color: "border-amber-500/20",
      bg: "bg-amber-50/50 dark:bg-amber-950/20",
      description: "Learning the science and art of biblical interpretation. Principles for reading scripture accurately in historical, cultural, and literary contexts.",
      topics: ["Exegesis vs Eisegesis", "Literary Genres", "Contextual Analysis", "Historical Setting"]
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Spiritual Formation",
      color: "border-emerald-500/20",
      bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
      description: "Focusing on character building, spiritual disciplines, personal devotion, prayer, and lifestyle integrity modeled after Jesus Christ.",
      topics: ["Prayer & Devotion", "Spiritual Disciplines", "Christian Character", "Discipleship Loops"]
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: "Christian Apologetics",
      color: "border-red-500/20",
      bg: "bg-red-50/50 dark:bg-red-950/20",
      description: "Defending the Christian faith logically against common contemporary arguments, scientific doubts, and comparative religious claims.",
      topics: ["Reason & Faith", "Problem of Evil", "Historical Resurrection", "Skeptic Dialogue"]
    },
    {
      icon: <Briefcase className="w-6 h-6 text-brand-blue dark:text-brand-accent" />,
      title: "Business & Leadership",
      color: "border-brand-blue/20",
      bg: "bg-blue-50/50 dark:bg-slate-900/40",
      description: "Activating theology in corporate and business spaces. Applying ethical leadership, steward excellence, and spiritual influence in the marketplace.",
      topics: ["Marketplace Ethics", "Kingdom Wealth", "Servant Leadership", "Organizational Stewardship"]
    }
  ];

  return (
    <section id="courses-section" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
            Curriculum Structure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
            Comprehensive Course Syllabus
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
            Our intensive six-week course syllabus is carefully curated to equip students with rich theology and practical operational strategies.
          </p>
        </div>

        {/* Courses Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div
              id={`course-card-${i}`}
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`p-8 rounded-3xl border ${course.color} ${course.bg} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                {/* Header icon */}
                <div className="w-12 h-12 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-6">
                  {course.icon}
                </div>

                {/* Details */}
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-3">
                  {course.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold leading-relaxed mb-6">
                  {course.description}
                </p>
              </div>

              {/* Syllabus Highlights */}
              <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-4">
                <h4 className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-3">Syllabus Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {course.topics.map((topic, ti) => (
                    <span
                      key={ti}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs border border-slate-100 dark:border-slate-800"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

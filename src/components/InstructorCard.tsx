import { Mail, Linkedin, Twitter, Sparkles, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface Instructor {
  name: string;
  title: string;
  bio: string;
  image: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    email: string;
  };
}

export default function InstructorCard() {
  const instructors: Instructor[] = [
    {
      name: "Pastor Ifeanyi Ihuoma",
      title: "Senior Lecturer & Director of Studies",
      bio: "Over 10 years of pastoral ministry and theological teaching. Specialist in Biblical Theology, Hermeneutics.",
      image: "https://lh3.googleusercontent.com/d/12M_Qzfsxgg4FvTkArgicGN2a5ZvuUD7O",
      socials: { email: "pifeanyi@naioth.org", linkedin: "#", twitter: "#" }
    },
    {
      name: "Evang. Vincent Chukwukelu",
      title: "Head of Spiritual formation",
      bio: "Anointed apologist and missionary. Passionate about defending scriptural truth and raising active evangelistic leaders for the marketplace.",
      image: "https://lh3.googleusercontent.com/d/1KQ0li5spdRpNhEUgm4bOPV7HLSm9lY-2",
      socials: { email: "vchukwukelu@naioth.org", linkedin: "#" }
    },
    {
      name: "Rev. Joshua Agunbiade",
      title: "Professor of Hermeneutics & Exegesis",
      bio: "Theology researcher and language scholar. Grounded in original biblical Greek and Hebrew exegesis and systematic doctrinal studies.",
      image: "https://lh3.googleusercontent.com/d/1Cns7gIEx4ljxzM_Vc3Hc8qMMb1N5VbkU",
      socials: { email: "jagunbiade@naioth.org", twitter: "#" }
    },
    {
      name: "Dr. Nelson Ani",
      title: "Head of apologetics & Evangelism studies",
      bio: "Ph.D. in Organizational Leadership. Prominent corporate consultant and author, focusing on kingdom ethics in business governance.",
      image: "https://lh3.googleusercontent.com/d/1odsDt6PhKpVcVikxYGQN1irJAeN_k9Eu",
      socials: { email: "nelson.ani@naioth.org", linkedin: "#" }
    },
    {
      name: "Pastor Bobby Uchenna",
      title: "Lecturer, Business & Christian Ethics",
      bio: "Dedicated mentor and pastor. Leads spiritual retreat cohorts, spiritual discipleship pathways, and deep devotional character studies.",
      image: "https://lh3.googleusercontent.com/d/1QGxBdPPo9iaupkiRgwUuF0lFkcftHEPA",
      socials: { email: "bobby.uchenna@naioth.org", linkedin: "#", twitter: "#" }
    }
  ];

  return (
    <section id="instructors-section" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
            Faculty
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
            Meet Our Experienced Instructors
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
            Learn from dynamic lecturers who combine profound academic qualifications with active ministerial and marketplace achievements.
          </p>
        </div>

        {/* Instructors Layout */}
        <div className="flex flex-wrap justify-center gap-10">
          {instructors.map((inst, i) => (
            <motion.div
              id={`instructor-card-${i}`}
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-full sm:w-[280px] lg:w-[320px] rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-64 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />
                  <img
                    src={inst.image}
                    alt={inst.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 z-20 p-2 bg-brand-gold rounded-xl text-brand-blue shadow-md font-extrabold flex items-center space-x-1 text-[10px] tracking-wide">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>FACULTY</span>
                  </div>
                </div>

                {/* Profile Data */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight leading-snug">
                    {inst.name}
                  </h3>
                  <span className="block text-xs font-black text-brand-accent dark:text-brand-gold uppercase tracking-wider">
                    {inst.title}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                    {inst.bio}
                  </p>
                </div>
              </div>

              {/* Social Bar */}
              <div className="p-6 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-start space-x-4">
                <a
                  href={`mailto:${inst.socials.email}`}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-accent dark:hover:text-brand-gold hover:bg-slate-100 rounded-xl transition-all shadow-sm"
                  title="Contact Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                {inst.socials.linkedin && (
                  <a
                    href={inst.socials.linkedin}
                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-accent hover:bg-slate-100 rounded-xl transition-all shadow-sm"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {inst.socials.twitter && (
                  <a
                    href={inst.socials.twitter}
                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-accent hover:bg-slate-100 rounded-xl transition-all shadow-sm"
                    title="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

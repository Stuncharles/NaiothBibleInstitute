import { Shield, Users, Compass, Landmark } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const pillars = [
    {
      icon: <Shield className="w-5 h-5 text-brand-gold" />,
      title: "Biblical Foundation",
      description: "Rooted deeply in the absolute authority and inerrancy of Scripture, preparing students with sound doctrine."
    },
    {
      icon: <Compass className="w-5 h-5 text-brand-gold" />,
      title: "Spiritual Formation",
      description: "Cultivating active discipleship, active prayer lives, and deep communion with the Holy Spirit."
    },
    {
      icon: <Users className="w-5 h-5 text-brand-gold" />,
      title: "Leadership Development",
      description: "Equipping visionary servant-leaders who can lead ministries and businesses with integrity."
    },
    {
      icon: <Landmark className="w-5 h-5 text-brand-gold" />,
      title: "Marketplace Influence",
      description: "Positioning believers to operate as salt and light in corporate, governmental, and creative sectors."
    }
  ];

  return (
    <section id="about-section" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Visual Placement */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-200 dark:border-slate-800"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/40 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
                alt="Naioth Bible Institute Classroom"
                className="w-full h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 text-white">
                <span className="text-xs font-black tracking-widest text-brand-gold block uppercase mb-1">OUR FOUNDATION</span>
                <h3 className="text-xl font-bold tracking-tight mb-2">"Study to show thyself approved..."</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." — 2 Timothy 2:15
                </p>
              </div>
            </motion.div>

            {/* Decorative accent squares */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-gold/20 rounded-3xl -z-10 blur-xl" />
          </div>

          {/* Right Column: Mission Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md"
              >
                Who We Are
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight"
              >
                Excellence in Biblical Theology & Spiritual Character
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
              >
                Naioth Bible Institute (NBI) is dedicated to raising sound theologians and leaders with strong spiritual foundations. Our Basic Theology Module offers intensive lectures to ground believers in sound doctrine, spiritual growth, and marketplace influence.
              </motion.p>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col space-y-3 hover:border-brand-accent/30 dark:hover:border-brand-gold/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold flex items-center justify-center font-bold">
                    {pillar.icon}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">{pillar.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

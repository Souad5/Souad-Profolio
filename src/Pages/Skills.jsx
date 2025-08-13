import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNode, FaGitAlt, FaDocker } from "react-icons/fa";
import { SiMongodb, SiExpress ,SiViblo  } from "react-icons/si";

const skillCategories = {
  Frontend: [
    { name: "HTML", level: 90, icon: <FaHtml5 className="text-orange-500" /> },
    { name: "CSS", level: 85, icon: <FaCss3Alt className="text-blue-500" /> },
    { name: "JavaScript", level: 80, icon: <FaJs className="text-yellow-400" /> },
    { name: "React", level: 80, icon: <FaReact className="text-cyan-400" /> },
  ],
  Backend: [
    { name: "Node.js", level: 75, icon: <FaNode className="text-green-500" /> },
    { name: "Express", level: 70, icon: <SiExpress className="text-gray-300" /> },
    { name: "MongoDB", level: 70, icon: <SiMongodb className="text-green-400" /> },
  ],
  Tools: [
    { name: "Git", level: 80, icon: <FaGitAlt className="text-orange-400" /> },
    { name: "Docker", level: 60, icon: <FaDocker className="text-blue-400" /> },
    { name: "VS Code", level: 90, icon: < SiViblo  className="text-blue-500" /> },
  ],
};

export default function Skills() {
  return (
    <section className="px-4 py-16  bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Glow background accents */}
      <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl animate-ping"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl font-extrabold text-center text-white mb-10 tracking-wide"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🚀 My <span className="text-4xl font-extrabold text-center  mb-10 text-blue-400">Skills</span>
        </motion.h2>

        {/* Skill Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skillCategories).map(([category, skills], i) => (
            <motion.div
              key={i}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-blue-500/20 transition-all"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-blue-400">{category}</h3>
              <div className="space-y-5">
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 font-medium">
                        {skill.icon} {skill.name}
                      </span>
                      <span className="text-sm text-gray-300">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-3 rounded-full bg-linear-to-r/decreasing from-indigo-500 to-teal-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: idx * 0.15 + i * 0.4 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee */}
        <section className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-blue-500/20 transition-all mt-5">
          <Marquee pauseOnHover speed={60} gradient={false}>
            {[
              "/Html.png",
              "/Css.svg",
              "/JS.webp",
              "/React.png",
              "/nodejs.png",
              "/Express.png",
              "/MongoDB.png",
            ].map((src, idx) => (
              <motion.img
                key={idx}
                src={src}
                alt="Skill Logo"
                className="w-20 h-20 mx-10 hover:scale-125 transition-transform duration-300"
                whileHover={{ rotate: 5 }}
              />
            ))}
          </Marquee>
        </section>
      </div>
    </section>
  );
}

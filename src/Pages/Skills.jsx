import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

const skillCategories = {
  Frontend: [
    { name: "HTML", level: 90 },
    { name: "CSS", level: 85 },
    { name: "JavaScript", level: 80 },
    { name: "React", level: 80 },
  ],
  Backend: [
    { name: "Node.js", level: 75 },
    { name: "Express", level: 70 },
    { name: "MongoDB", level: 70 },
  ],
  Tools: [
    { name: "Git", level: 80 },
    { name: "Docker", level: 60 },
    { name: "VS Code", level: 90 },
  ],
};

export default function Skills() {
  return (
    <section className="px-4 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-center pb-2">
          My Skills
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skillCategories).map(([category, skills], i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-4 text-blue-600">{category}</h3>
              <div className="space-y-4">
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-4">
                      <motion.div
                        className="bg-blue-600 h-4 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: idx * 0.2 + i * 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-12 bg-white shadow-md rounded-lg py-6 px-4">
          <Marquee pauseOnHover speed={70} gradient={false}>
            <img className="w-20 h-20 mx-10" src="/Html.png" alt="HTML" />
            <img className="w-20 h-20 mx-10" src="/Css.svg" alt="CSS" />
            <img className="w-20 h-20 mx-10" src="/JS.webp" alt="JavaScript" />
            <img className="w-20 h-20 mx-10" src="/React.png" alt="React" />
            <img className="w-20 h-20 mx-10" src="/nodejs.png" alt="Node.js" />
            <img className="w-20 h-20 mx-10" src="/Express.png" alt="Express" />
            <img className="w-20 h-20 mx-10" src="./MongoDB.png" alt="MongoDB" />
          </Marquee>
        </section>
      </div>
    </section>
  );
}

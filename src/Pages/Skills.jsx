import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

const skills = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 85 },
  { name: "JavaScript", level: 80 },
  { name: "React", level: 80 },
  { name: "Node.js", level: 75 },
  { name: "MongoDB", level: 70 },
];

export default function Skills() {
  return (
    <section className="min-h-screen px-4 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 border-b-2 border-blue-600 inline-block pb-2">
          My Skills
        </h2>

        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{skill.name}</span>
                <span>{skill.level}%</span>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-4">
                <motion.div
                  className="bg-blue-600 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
     <section className="mt-12 px-4 py-6 bg-white shadow-md rounded-lg">
         <Marquee>
        <img className="w-20 h-20 mx-20" src="/Html.png" alt="" />
        <img className="w-20 h-20 mx-20" src="/Css.svg" alt="" />
        <img className="w-20 h-20 mx-20" src="/JS.webp" alt="" />
        <img className="w-20 h-20 mx-20" src="/React.png" alt="" />
        <img className="w-20 h-20 mx-20" src="/nodejs.png" alt="" />
        <img className="w-20 h-20 mx-20" src="/Express.png" alt="" />
      </Marquee>
     </section>
    </section>
  );
}

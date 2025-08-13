import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const educationData = [
  {
    institution: "North South University",
    degree: "B.Sc. in Computer Science and Engineering (CSE)",
    result: null,
    image: "/Nsu.png",
  },
  {
    institution: "Major General Mahmudul Hasan Adarsha College, Tangail",
    degree: "Higher Secondary Certificate (HSC) – Science",
    result: "GPA 5.00",
    image: "/Major.jpeg",
  },
  {
    institution: "Bindu Basini Govt. Boys' High School, Tangail",
    degree: "Secondary School Certificate (SSC) – Science",
    result: "GPA 5.00",
    image: "/Bindu.jpeg",
  },
];

export default function Education() {
  return (
    <section className="relative min-h-screen bg-gray-900 px-4 py-20 overflow-hidden">
      <h2 className="text-5xl font-extrabold text-center text-white mb-20">
        🎓 My Education
      </h2>

      {/* Animated Vertical Timeline */}
      <div className="absolute left-1/2  h-full flex flex-col items-center">
        <motion.div
          className="w-2 bg-linear-to-r/decreasing from-indigo-500 to-teal-400 rounded-full"
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col space-y-15 relative z-10">
        {educationData.map((edu, index) => (
          <motion.div
            className={`relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.4, type: "spring", stiffness: 70 }}
          >
            

            {/* Card */}
            <div className="relative w-full md:w-[60%] rounded-3xl p-8 shadow-2xl border-2 border-transparent bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 overflow-hidden  cursor-pointer duration-500">
              {/* Animated Gradient Border */}

              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                <img
                  src={edu.image}
                  alt={`${edu.institution} logo`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover "
                />
                <div className="text-center md:text-left space-y-2">
                  <h3 className="text-2xl font-bold text-white">
                    {edu.institution}
                  </h3>
                  <p className="text-gray-300">{edu.degree}</p>
                  {edu.result && (
                    <p className="text-blue-400 font-semibold">
                      Result: {edu.result}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

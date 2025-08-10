import { motion } from "framer-motion";

const educationData = [
  {
    institution: "North South University",
    degree: "B.Sc. in Computer Science and Engineering (CSE)",
    result: null,
  },
  {
    institution: "Major General Mahmudul Hasan Adarsha College, Tangail",
    degree: "Higher Secondary Certificate (HSC) – Science",
    result: "GPA 5.00",
  },
  {
    institution: "Bindu Basini Govt. Boys' High School, Tangail",
    degree: "Secondary School Certificate (SSC) – Science",
    result: "GPA 5.00",
  },
];

export default function Education() {
  return (
    <section className="px-4 py-12 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center pb-2">
          Education
        </h2>

        <div className="space-y-8">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 shadow-sm border  border-gray-200 p-6 rounded-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h3 className="text-xl font-semibold">{edu.institution}</h3>
              <p className="text-gray-700">{edu.degree}</p>
              {edu.result && <p className="text-gray-600">Result: {edu.result}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

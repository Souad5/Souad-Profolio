import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="min-h-screen px-4 py-10 bg-white text-gray-800 flex items-center justify-center">
      <motion.div
        className="max-w-3xl text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold border-b-2 border-blue-600 inline-block pb-2">
          About Me
        </h2>

        <p className="text-lg leading-relaxed">
          Hi, I’m <span className="font-semibold">Md Souad Al Kabir</span>, a passionate
          and dedicated full stack web developer. My journey started with curiosity
          about how websites work, and over time, I mastered technologies like HTML,
          CSS, JavaScript, React, Node.js, Express, and MongoDB.
        </p>

        <p className="text-lg leading-relaxed">
          I enjoy building dynamic and responsive web applications. My favorite part
          is problem-solving and creating smooth user experiences. I continuously
          strive to learn and improve every day.
        </p>

        <p className="text-lg leading-relaxed">
          Beyond coding, I love playing sports, watching tech videos, and exploring
          new tools in the software world. I believe consistency, curiosity, and
          creativity are key to growth.
        </p>
      </motion.div>
    </section>
  );
}

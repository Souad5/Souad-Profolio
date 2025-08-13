import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="px-6 py-16  bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <motion.div
        className="max-w-7xl w-full flex flex-row-reverse justify-between gap-12 items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <img
            src="/Souad.jpg"
            alt="Md Souad Al Kabir"
            className="h-[375px] rounded-2xl shadow-lg border-4  object-cover transform hover:scale-105 transition-all duration-300 hidden md:inline"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl space-y-6"
        >
          <h2 className="text-4xl font-extrabold underline text-white mb-10">
            About Me
          </h2>

          <p className="text-lg leading-relaxed">
            Hi! I’m{" "}
            <span className="text-blue-400 font-semibold">
              Md Souad Al Kabir
            </span>
            , a passionate{" "}
            <span className="text-green-400 font-semibold">
              MERN Stack Developer
            </span>{" "}
            who loves building{" "}
            <span className="text-yellow-300">scalable</span> and{" "}
            <span className="text-yellow-300">impactful</span> web applications.
            My expertise lies in &nbsp;
            <span className="font-semibold">MongoDB, Express.js, React</span>,
            and <span className="font-semibold">Node.js</span>.
          </p>

          <p className="text-lg leading-relaxed">
            I focus on turning complex ideas into{" "}
            <span className="text-pink-400 font-semibold">
              clean, user-friendly
            </span>{" "}
            solutions with great UI/UX. I enjoy working on both{" "}
            <span className="text-blue-300">frontend</span> and{" "}
            <span className="text-blue-300">backend</span> to create complete
            digital products.
          </p>

          <p className="text-lg italic">
            Outside of coding, I enjoy{" "}
            <span className="text-orange-300">sports</span> and{" "}
            <span className="text-orange-300">painting</span> — they keep my
            creativity flowing!
          </p>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["JavaScript", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Framer Motion"].map(
              (skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500 text-sm"
                >
                  {skill}
                </motion.span>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="px-4 py-10 bg-white text-gray-800 flex items-center justify-center">
      <motion.div
        className="max-w-7xl text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center pb-2">
          About Me
        </h2>

        <p className="text-lg leading-relaxed max-w-7xl mx-auto">
          Hello! I’m <span className="font-semibold">Md Souad Al Kabir</span>, a dedicated MERN stack developer passionate about building scalable and efficient web applications. My journey began with a curiosity for web development, which quickly evolved into mastering MongoDB, Express.js, React, and Node.js to create dynamic, full-featured projects.
        </p>

        <p className="text-lg leading-relaxed max-w-7xl mx-auto">
          I enjoy turning complex problems into elegant, user-friendly solutions while focusing on clean code and seamless user experiences. Whether working on the frontend or backend, I thrive in crafting high-performance apps that make an impact.
        </p>

        <p className="text-lg leading-relaxed max-w-7xl mx-auto">
          Outside of coding, I love playing sports and exploring creative outlets like painting, which help me maintain balance and fresh ideas. I’m always eager to learn new technologies and collaborate with others to grow both personally and professionally.
        </p>

        <p className="text-lg leading-relaxed max-w-7xl mx-auto italic">
          Let’s build something amazing together!
        </p>
      </motion.div>
    </section>
  );
}

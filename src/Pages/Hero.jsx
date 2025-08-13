import React from "react";
import { motion } from "framer-motion";
import { IoMdDownload } from "react-icons/io";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Animated Background Blob */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl animate-ping"></div>

      <div className="max-w-7xl w-full flex flex-col md:flex-row justify-center items-center gap-12 z-10">
        
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500/40 blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          <img
            src="/Souad.jpg"
            alt="Md Souad Al Kabir"
            className="relative w-[350px] h-[350px] rounded-full border-4 border-blue-400 object-cover shadow-lg transform group-hover:scale-105 transition-all duration-500"
          />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl max-w-xl"
        >
          <h1 className="text-5xl font-extrabold mb-3">
            Md Souad <span className="text-blue-400">Al Kabir</span>
          </h1>
          <motion.p
            className="text-xl text-blue-300 font-semibold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            MERN Stack Web Developer
          </motion.p>

          {/* Resume Button */}
          <motion.a
            href="https://drive.google.com/file/d/17FQdoGB4WevmWnxgjgw4CwjY-wS4h9_M/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-linear-to-r/decreasing from-indigo-500 to-teal-400 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg mb-6"
          >
            Download Resume <IoMdDownload size={20} />
          </motion.a>

          {/* Social Links */}
          <motion.div
            className="flex gap-6 text-3xl"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {[
              { icon: <FaGithub />, link: "https://github.com/souad5" },
              { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/souadalkabir/" },
              { icon: <FaFacebook />, link: "https://facebook.com/" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                {item.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

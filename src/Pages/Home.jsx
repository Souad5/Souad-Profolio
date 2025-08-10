// src/pages/Home.jsx
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import About from "./About";
import Skills from "./Skills";
import Contact from "./Contact";
import Education from "./Education";
import Projects from "./Projects";
import { IoMdDownload } from "react-icons/io";

export default function Home() {
  return (
    <div name="home">
        <section className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-4 ">
      {/* Image Section */}
      <motion.img
        src="/Souad.jpg" // put your photo in public/ folder
        alt="Profile"
        className="w-82 h-82 rounded-full border-4 border-blue-300 object-cover"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      />


      {/* Info Section */}
      <motion.div
        className="text-center md:text-left space-y-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold text-gray-800">Md Souad Al Kabir</h1>
        <p className="text-xl ">MERN Stack Web Developer</p>

        {/* Resume Button */}
        <a
          href="/Md Souad Al Kabir (MERN).pdf"
          download
          className="btn btn-primary"
        >
          Download Resume<IoMdDownload />
        </a>

        {/* Social Links */}
        <div className="flex justify-center md:justify-start gap-6 text-2xl mt-4 text-gray-700">
          <a href="https://github.com/souad5" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/souadalkabir/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        </div>
      </motion.div>
    </section>
    <div name="about" className="bg-white py-10">
        <About/>
    </div>
    <section name="skills" className="bg-gray-50 py-12">
        <Skills/>
    </section>
    <section name="projects" className="bg-white py-12">
        <Projects/>
    </section>
    <section>
        <Education/>
    </section>
    <section name="contact" className="bg-gray-50 py-12">
        <Contact/>
    </section>
    </div>
  );
}

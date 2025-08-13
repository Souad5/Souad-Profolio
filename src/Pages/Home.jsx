// src/pages/Home.jsx
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import About from "./About";
import Skills from "./Skills";
import Contact from "./Contact";
import Education from "./Education";
import Projects from "./Projects";
import { IoMdDownload } from "react-icons/io";
import Hero from "./Hero";

export default function Home() {
  return (
    <>
    <div name="home">
      <Hero/>
      </div>  
    <div name="about" >
        <About/>
    </div>
    <section name="skills">
        <Skills/>
    </section>
    <section name="projects">
        <Projects/>
    </section>
    <section>
        <Education/>
    </section>
    <section name="contact">
        <Contact/>
    </section>
    
    </>
  );
}

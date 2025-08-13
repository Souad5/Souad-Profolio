import { useState } from "react";
import { Link } from "react-scroll";
import { IoMdDownload } from "react-icons/io";
import { CiMenuBurger, CiSquareRemove } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Skills", to: "skills" },
    { name: "Projects", to: "projects" },
    { name: "Contact", to: "contact" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with ping animation */}
        <div className="relative flex items-center gap-2">
          
          <h1 className="text-2xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 animate-text">
            Md Souad
          </h1>
          <span className="relative flex w-4 h-4 ">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex w-4 h-4 rounded-full bg-sky-500"></span>
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-white font-medium">
          {navLinks.map((link, i) => (
            <li
              key={i}
              className="hover:text-blue-400 transition-colors cursor-pointer relative group"
            >
              <Link to={link.to} smooth={true} duration={500}>
                {link.name}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Resume Button */}
        <a
          href="https://drive.google.com/file/d/17FQdoGB4WevmWnxgjgw4CwjY-wS4h9_M/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r/decreasing from-indigo-500 to-teal-400 hover:scale-105 transition-transform font-medium"
        >
          Resume <IoMdDownload />
        </a>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl hover:text-blue-400 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <CiSquareRemove /> : <CiMenuBurger />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-800 shadow-md w-full flex flex-col items-center py-6 space-y-4 text-white font-medium"
          >
            {navLinks.map((link, i) => (
              <li
                key={i}
                className="hover:text-blue-400 transition-colors cursor-pointer text-lg"
              >
                <Link
                  to={link.to}
                  smooth={true}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <a
              href="https://drive.google.com/file/d/17FQdoGB4WevmWnxgjgw4CwjY-wS4h9_M/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 px-4 py-2 rounded-lg hover:scale-105 transition-transform font-medium"
            >
              Resume <IoMdDownload />
            </a>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}

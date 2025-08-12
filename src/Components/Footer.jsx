import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Link } from "react-scroll";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left */}
        <div className="text-sm flex justify-end items-end">
          <p>
            &copy; {new Date().getFullYear()} Md Souad Al Kabir. All rights
            reserved.
          </p>
        </div>

        <nav className="flex flex-col">
           <ul className="hidden md:flex flex-col space-x-6 text-gray-700 font-medium">
                      <li className="cursor-pointer">
                        <Link to="home" smooth={true} duration={500}>
                          <span className="text-white">Home</span>
                        </Link>
                      </li>
                      <li className="cursor-pointer">
                        <Link to="about" smooth={true} duration={500}>
                          <span className="text-white">About</span>
                        </Link>
                      </li>
                      <li className="cursor-pointer">
                        <Link to="skills" smooth={true} duration={500}>
                          <span className="text-white">Skills</span>
                        </Link>
                      </li>
                      <li className="cursor-pointer">
                        <Link to="projects" smooth={true} duration={500}>
                          <span className="text-white">Projects</span>
                        </Link>
                      </li>
                      
                    </ul>
        </nav>

        {/* Social Icons */}
        <div className="flex space-x-6 text-xl">
          <nav className="flex flex-col">
            <h6 className="footer-title">Social</h6>

            <a
              href="https://github.com/souad5"
              target="_blank"
              rel="noreferrer"
              className="link link-hover flex items-center gap-2 text-sm"
            >
              <FaGithub /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/md-souad-al-kabir"
              target="_blank"
              rel="noreferrer"
              className="link link-hover flex items-center gap-2 text-sm"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href="https://www.facebook.com/souadalkabirmaruf"
              target="_blank"
              rel="noreferrer"
              className="link link-hover flex items-center gap-2 text-sm"
            >
              <FaFacebook /> Facebook
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

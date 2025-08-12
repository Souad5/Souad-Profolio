// src/components/Navbar.jsx
import { CiMenuBurger } from "react-icons/ci";
import { IoMdDownload } from "react-icons/io";
import { Link } from "react-scroll";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Md Souad.</h1>
        </div>
        <div>
          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
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
            <li className="cursor-pointer">
              <Link to="contact" smooth={true} duration={500}>
                <span className="text-white">Contact</span>
              </Link>
            </li>
          </ul>
        </div>
        <div >
         
          {/* Resume Button */}
          <a
            href={
              "https://drive.google.com/file/d/17FQdoGB4WevmWnxgjgw4CwjY-wS4h9_M/view?usp=drive_link"
            }
            download
            className="btn btn-primary invisible md:visible "
          >
            Resume
            <IoMdDownload />
          </a>

           {/* dropdown */}
        
          <button
            className="btn md:invisible visible"
            popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
          >
            <CiMenuBurger />

          </button>

          <ul
            className="dropdown menu w-22 -ml-8 rounded-box bg-base-100 shadow-sm"
            popover="auto"
            id="popover-1"
            style={
              { positionAnchor: "--anchor-1" } /* as React.CSSProperties */
            }
          >
            <li className="cursor-pointer">
              <Link to="home" smooth={true} duration={500}>
                Home
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link to="about" smooth={true} duration={500}>
                About
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link to="skills" smooth={true} duration={500}>
                Skills
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link to="projects" smooth={true} duration={500}>
                Projects
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link to="contact" smooth={true} duration={500}>
                Contact
              </Link>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
}
// done

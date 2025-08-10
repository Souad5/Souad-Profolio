// src/components/Navbar.jsx
import { IoMdDownload } from 'react-icons/io';
import { Link } from 'react-scroll';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Md Souad.</h1>
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className='cursor-pointer'><Link to="home" smooth={true} duration={500}>Home</Link></li>
          <li className='cursor-pointer'><Link to="about" smooth={true} duration={500}>About</Link></li>
          <li className='cursor-pointer'><Link to="skills" smooth={true} duration={500}>Skills</Link></li>
          <li className='cursor-pointer'><Link to="projects" smooth={true} duration={500}>Projects</Link></li>
          <li className='cursor-pointer'><Link to="contact" smooth={true} duration={500}>Contact</Link></li>
        </ul>
        {/* Resume Button */}
        <a
          href="/Md Souad Al Kabir (MERN).pdf"
          download
          className="btn btn-primary "
        >
           Resume<IoMdDownload />
        </a>
      </div>
    </nav>
  );
}
// done
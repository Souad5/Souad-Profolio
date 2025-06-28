import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left */}
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Md Souad Al Kabir. All rights reserved.
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 text-xl">
          <a href="https://github.com/souad5" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/md-souad-al-kabir" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            <FaLinkedin />
          </a>
          <a href="https://www.facebook.com/souadalkabirmaruf" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}

import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Link } from "react-scroll";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Skills", to: "skills" },
    { name: "Projects", to: "projects" },
    { name: "Contact", to: "contact" },
  ];

  const socialLinks = [
    { name: "GitHub", icon: <FaGithub />, url: "https://github.com/souad5" },
    { name: "LinkedIn", icon: <FaLinkedin />, url: "https://linkedin.com/in/md-souad-al-kabir" },
    { name: "Facebook", icon: <FaFacebook />, url: "https://www.facebook.com/souadalkabirmaruf" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Section */}
        <p className="text-sm text-gray-400">&copy; {currentYear} Md Souad Al Kabir. All rights reserved.</p>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth={true}
              duration={500}
              className="cursor-pointer hover:text-blue-400 transition-colors relative group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex gap-4 text-2xl">
          {socialLinks.map(({ name, icon, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label={name}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

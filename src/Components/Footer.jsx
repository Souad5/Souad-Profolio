import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Link } from "react-scroll";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Skills", to: "skills" },
    { name: "Projects", to: "projects" },
  ];

  const socialLinks = [
    { name: "GitHub", icon: <FaGithub />, url: "https://github.com/souad5" },
    {
      name: "LinkedIn",
      icon: <FaLinkedin />,
      url: "https://linkedin.com/in/md-souad-al-kabir",
    },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      url: "https://www.facebook.com/souadalkabirmaruf",
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Section */}
        <div className="text-sm">
          <p>&copy; {currentYear} Md Souad Al Kabir. All rights reserved.</p>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth={true}
              duration={500}
              className="cursor-pointer hover:text-gray-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex flex-row items-center md:items-end">
          <div className="flex flex-row gap-2 text-sm">
            {socialLinks.map(({ name, icon, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-gray-400"
              >
                {icon} {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

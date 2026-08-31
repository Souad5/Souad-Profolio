import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNode,
  FaGitAlt,
  FaDocker,
  FaCode,
  FaCheckCircle,
  FaImage,
  FaMapMarkerAlt,
  FaTrophy,
  FaStar,
  FaAward,
  FaTag,
  FaMedal,
  FaLaptopCode,
  FaEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { SiMongodb, SiExpress, SiViblo, SiPostgresql, SiTypescript, SiPython, SiTailwindcss } from "react-icons/si";
import { MdEmail } from "react-icons/md";

// Curated registry of icons addressable by the string names stored in the DB.
const REGISTRY = {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNode,
  FaGitAlt,
  FaDocker,
  FaCode,
  FaCheckCircle,
  FaImage,
  FaMapMarkerAlt,
  FaTrophy,
  FaStar,
  FaAward,
  FaTag,
  FaMedal,
  FaLaptopCode,
  FaEnvelope,
  FaExternalLinkAlt,
  SiMongodb,
  SiExpress,
  SiViblo,
  SiPostgresql,
  SiTypescript,
  SiPython,
  SiTailwindcss,
  MdEmail,
};

export default function Icon({ name, className = "", ...props }) {
  const Component = REGISTRY[name] || FaTag;
  return <Component className={className} {...props} aria-hidden="true" />;
}

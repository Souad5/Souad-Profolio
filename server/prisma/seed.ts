import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@portfolio.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin12345";

async function main() {
  console.log("Seeding database...");

  // Idempotent backfill: existing installs (with an admin already present) get
  // the new hero tags so the marquee strip isn't empty, without wiping content.
  const existingSettings = await prisma.siteSetting.findFirst();
  if (
    existingSettings &&
    (!existingSettings.heroTags || existingSettings.heroTags.length === 0)
  ) {
    await prisma.siteSetting.update({
      where: { id: existingSettings.id },
      data: {
        heroTags: [
          "Problem Solver",
          "Quick Learner",
          "MERN Stack Developer",
          "Clean Code Advocate",
          "Team Player",
          "Frontend & Backend",
          "Attention to Detail",
          "Always Curious",
        ],
      },
    });
    console.log("  Backfilled hero tags on existing settings.");
  }

  // Non-destructive by default: skip if an admin user exists so re-running the
  // seed never wipes content edited through the dashboard. Pass RESEED=1 to
  // force a clean reset (dev only).
  if (process.env.RESEED !== "1") {
    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
      console.log(
        "Database already seeded (admin user found). Skipping to avoid wiping content.",
      );
      console.log("  Run with RESEED=1 to force a clean reseed.");
      return;
    }
  }

  // -------- Clear existing content (idempotent reseed) --------
  await prisma.contactMessage.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.service.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.about.deleteMany();
  await prisma.sectionVisibility.deleteMany();
  await prisma.project.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // -------- Site settings (single document) --------
  const settings = await prisma.siteSetting.create({
    data: {
      name: "Md Souad Al Kabir",
      title: "MERN Stack Developer",
      shortBio:
        "Passionate MERN Stack Developer who loves building scalable and impactful web applications.",
      email: "souadalkabir@gmail.com",
      phone: "+8801830807523",
      location: "Bangladesh",
      profileImage: "/Souad.jpg",
      resumeUrl:
        "https://drive.google.com/file/d/17FQdoGB4WevmWnxgjgw4CwjY-wS4h9_M/view?usp=drive_link",
      availability: "Available for opportunities",
      heroGreeting: "Hi, I'm",
      heroHeading: "Md Souad Al Kabir",
      heroHighlight: "Al Kabir",
      heroSubtitle: "MERN Stack Web Developer",
      heroDescription:
        "I design and build complete digital products — from polished frontends to robust backends.",
      heroPrimaryCta: "Download Resume",
      heroSecondaryCta: "Contact Me",
      heroEnabled: true,
      heroTags: [
        "Problem Solver",
        "Quick Learner",
        "MERN Stack Developer",
        "Clean Code Advocate",
        "Team Player",
        "Frontend & Backend",
        "Attention to Detail",
        "Always Curious",
      ],
      seoTitle: "Souad || MERN Developer",
      seoDescription:
        "Portfolio of Md Souad Al Kabir, a MERN stack web developer building scalable and impactful web applications.",
      seoKeywords:
        "MERN, React, Node.js, MongoDB, Express, portfolio, web developer",
      seoOgImage: "/Souad.jpg",
      seoAuthor: "Md Souad Al Kabir",
      seoCanonicalUrl: "",
    },
  });

  // -------- Social links --------
  const socials = [
    {
      label: "GitHub",
      url: "https://github.com/souad5",
      icon: "FaGithub",
      order: 0,
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/souadalkabir/",
      icon: "FaLinkedin",
      order: 1,
    },
    {
      label: "Facebook",
      url: "https://www.facebook.com/souadalkabirmaruf",
      icon: "FaFacebook",
      order: 2,
    },
  ];
  await prisma.socialLink.createMany({
    data: socials.map((s) => ({ ...s, settingId: settings.id })),
  });

  // -------- Navigation --------
  const nav = [
    { label: "Home", target: "home", order: 0 },
    { label: "About", target: "about", order: 1 },
    { label: "Skills", target: "skills", order: 2 },
    { label: "Projects", target: "projects", order: 3 },
    { label: "Contact", target: "contact", order: 4 },
  ];
  await prisma.navigationItem.createMany({ data: nav });

  // -------- Section visibility --------
  const sections = [
    { key: "about", label: "About", enabled: true, order: 0 },
    { key: "skills", label: "Skills", enabled: true, order: 1 },
    { key: "experience", label: "Experience", enabled: true, order: 2 },
    { key: "education", label: "Education", enabled: true, order: 3 },
    { key: "projects", label: "Projects", enabled: true, order: 4 },
    { key: "services", label: "Services", enabled: false, order: 5 },
    { key: "testimonials", label: "Testimonials", enabled: false, order: 6 },
    {
      key: "certifications",
      label: "Certifications",
      enabled: false,
      order: 7,
    },
    { key: "achievements", label: "Achievements", enabled: false, order: 8 },
    { key: "contact", label: "Contact", enabled: true, order: 9 },
  ];
  await prisma.sectionVisibility.createMany({ data: sections });

  // -------- About --------
  await prisma.about.create({
    data: {
      heading: "About Me",
      description:
        "Hi! I'm Md Souad Al Kabir, a passionate MERN Stack Developer who loves building scalable and impactful web applications. My expertise lies in MongoDB, Express.js, React, and Node.js.\n\nI focus on turning complex ideas into clean, user-friendly solutions with great UI/UX. I enjoy working on both frontend and backend to create complete digital products.\n\nOutside of coding, I enjoy sports and painting — they keep my creativity flowing!",
      image: "/Souad.jpg",
      skillTags: [
        "JavaScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Tailwind CSS",
        "Framer Motion",
      ],
      focusPoints: [
        { text: "MERN Stack Developer", color: "text-green-400 font-semibold" },
        { text: "scalable", color: "text-yellow-300" },
        { text: "impactful", color: "text-yellow-300" },
        { text: "clean, user-friendly", color: "text-pink-400 font-semibold" },
        { text: "frontend", color: "text-blue-300" },
        { text: "backend", color: "text-blue-300" },
        { text: "sports", color: "text-orange-300" },
        { text: "painting", color: "text-orange-300" },
      ],
      enabled: true,
      order: 0,
    },
  });

  // -------- Skills --------
  const frontendCat = await prisma.skillCategory.create({
    data: { name: "Frontend", order: 0 },
  });
  const backendCat = await prisma.skillCategory.create({
    data: { name: "Backend", order: 1 },
  });
  const toolsCat = await prisma.skillCategory.create({
    data: { name: "Tools", order: 2 },
  });
  const skills = [
    {
      name: "HTML",
      level: 90,
      icon: "FaHtml5",
      categoryId: frontendCat.id,
      order: 0,
    },
    {
      name: "CSS",
      level: 85,
      icon: "FaCss3Alt",
      categoryId: frontendCat.id,
      order: 1,
    },
    {
      name: "JavaScript",
      level: 80,
      icon: "FaJs",
      categoryId: frontendCat.id,
      order: 2,
    },
    {
      name: "React",
      level: 80,
      icon: "FaReact",
      categoryId: frontendCat.id,
      order: 3,
    },
    {
      name: "Node.js",
      level: 75,
      icon: "FaNode",
      categoryId: backendCat.id,
      order: 0,
    },
    {
      name: "Express",
      level: 70,
      icon: "SiExpress",
      categoryId: backendCat.id,
      order: 1,
    },
    {
      name: "MongoDB",
      level: 70,
      icon: "SiMongodb",
      categoryId: backendCat.id,
      order: 2,
    },
    {
      name: "Git",
      level: 80,
      icon: "FaGitAlt",
      categoryId: toolsCat.id,
      order: 0,
    },
    {
      name: "Docker",
      level: 60,
      icon: "FaDocker",
      categoryId: toolsCat.id,
      order: 1,
    },
    {
      name: "VS Code",
      level: 90,
      icon: "SiViblo",
      categoryId: toolsCat.id,
      order: 2,
    },
  ];
  await prisma.skill.createMany({ data: skills });

  // -------- Education --------
  await prisma.education.createMany({
    data: [
      {
        institution: "North South University",
        degree: "B.Sc. in Computer Science and Engineering (CSE)",
        result: null,
        image: "/Nsu.png",
        order: 0,
        enabled: true,
      },
      {
        institution: "Major General Mahmudul Hasan Adarsha College, Tangail",
        degree: "Higher Secondary Certificate (HSC) – Science",
        result: "GPA 5.00",
        image: "/Major.jpeg",
        order: 1,
        enabled: true,
      },
      {
        institution: "Bindu Basini Govt. Boys' High School, Tangail",
        degree: "Secondary School Certificate (SSC) – Science",
        result: "GPA 5.00",
        image: "/Bindu.jpeg",
        order: 2,
        enabled: true,
      },
    ],
  });

  // -------- Projects --------
  const projects = [
    {
      title: "Roommate Finder",
      shortDescription:
        "A platform to find and connect roommates easily with authentication and real-time chats.",
      description:
        "A platform to find and connect roommates easily with authentication and real-time chats.",
      thumbnail: "/Roommate.png",
      technologies: ["React", "Firebase", "MongoDB", "Express"],
      category: "Full Stack",
      liveUrl: "https://assignment-10-ca8b0.web.app",
      githubUrl: "https://github.com/Souad5/Assignment-10-Client",
      challenges:
        "Managing real-time data and user authentication flow was complex.",
      improvements: "Add more filtering options and mobile app version.",
      featured: true,
      published: true,
      order: 0,
    },
    {
      title: "Bill Management App",
      shortDescription:
        "An app for users to manage and pay utility bills with notifications and history tracking.",
      description:
        "An app for users to manage and pay utility bills with notifications and history tracking.",
      thumbnail: "/Pay Bill.png",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      category: "Full Stack",
      liveUrl: "https://assignment9b11ph.surge.sh/",
      githubUrl: "https://github.com/Souad5/Bill-Management-App",
      challenges: "Ensuring secure payment integration and responsive UI.",
      improvements: "Add multi-language support and offline bill entry.",
      featured: false,
      published: true,
      order: 1,
    },
    {
      title: "Knowledge Sharing Platform",
      shortDescription:
        "A platform for users to share knowledge articles, comment, and like posts.",
      description:
        "A platform for users to share knowledge articles, comment, and like posts.",
      thumbnail: "/Knowledge Share.png",
      technologies: ["MERN", "JWT"],
      category: "Full Stack",
      liveUrl: "https://assignment-11-d2902.web.app/",
      githubUrl: "https://github.com/Souad5/Knowledge-Share",
      challenges:
        "Implementing secure JWT auth and optimizing database queries.",
      improvements: "Add notifications and AI-based content suggestions.",
      featured: false,
      published: true,
      order: 2,
    },
    {
      title: "Local Food Waste Management",
      shortDescription:
        "A community-driven platform to reduce food waste by connecting surplus food to those in need.",
      description:
        "A community-driven platform to reduce food waste by connecting restaurants, grocery stores, and individuals with surplus food to those in need.",
      thumbnail: "/Local Food.png",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      category: "Full Stack",
      liveUrl: "https://assignment-12-ph-b12.web.app/",
      githubUrl: "https://github.com/Souad5/Local-food-management",
      challenges:
        "Implementing location-based search and real-time availability updates was challenging.",
      improvements:
        "Integrate a mobile app, add food safety verification, and enable automated pickup scheduling.",
      featured: false,
      published: true,
      order: 3,
    },
    {
      title: "Auctions Gallery",
      shortDescription:
        "A simple auction platform where users can add items to their favorites list and view total cost.",
      description:
        "A simple auction platform where users can add items to their favorites list and view the total cost of selected items.",
      thumbnail: "/Auction Bid.png",
      technologies: ["React", "Tailwind CSS"],
      category: "Frontend",
      liveUrl: "https://souada11assignment7ph.surge.sh/",
      githubUrl: "https://github.com/Souad5/React-Assignment-7",
      challenges:
        "Implementing persistent favorites state and calculating total cost dynamically.",
      improvements:
        "Add authentication, real-time bidding, and database integration for storing auction data.",
      featured: false,
      published: true,
      order: 4,
    },
    {
      title: "English Janala",
      shortDescription:
        "An interactive platform to help users learn and practice English vocabulary with quizzes.",
      description:
        "An interactive platform to help users learn and practice English vocabulary with Bangla meanings, examples, and quizzes.",
      thumbnail: "/Vocab.png",
      technologies: ["HTML", "Tailwind CSS", "JavaScript"],
      category: "Frontend",
      liveUrl: "https://souad5.github.io/English-Janala-A6-PH/",
      githubUrl: "https://github.com/Souad5/English-Janala-A6-PH",
      challenges:
        "Designing an engaging UI and organizing vocabulary data efficiently.",
      improvements:
        "Add spaced repetition learning, user accounts, and progress tracking.",
      featured: false,
      published: true,
      order: 5,
    },
  ];

  for (const p of projects) {
    const slug = p.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    await prisma.project.create({ data: { ...p, slug } });
  }

  // -------- Admin user --------
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Seed complete. Admin login:");
  console.log(`  email: ${ADMIN_EMAIL}`);
  console.log("  password: (from ADMIN_PASSWORD env)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

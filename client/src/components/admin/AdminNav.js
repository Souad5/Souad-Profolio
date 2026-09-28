// Single source of truth for admin navigation.
// Mirrors the routes registered in `src/Layout/Layouts.jsx` (all under /admin).
// Icons are names from the curated registry at `src/components/ui/Icon.jsx`.
export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: "FaTachometerAlt", end: true },
      { to: "/admin/messages", label: "Messages", icon: "FaEnvelope" },
    ],
  },
  {
    label: "Portfolio Content",
    items: [
      { to: "/admin/projects", label: "Projects", icon: "FaProjectDiagram" },
      { to: "/admin/skills", label: "Skills", icon: "FaCode" },
      { to: "/admin/experience", label: "Experience", icon: "FaBriefcase" },
      { to: "/admin/education", label: "Education", icon: "FaGraduationCap" },
      { to: "/admin/services", label: "Services", icon: "FaLayerGroup" },
      { to: "/admin/testimonials", label: "Testimonials", icon: "FaStar" },
      { to: "/admin/certifications", label: "Certifications", icon: "FaAward" },
      { to: "/admin/achievements", label: "Achievements", icon: "FaTrophy" },
    ],
  },
  {
    label: "Site Config",
    items: [
      { to: "/admin/navigation", label: "Navigation", icon: "FaListAlt" },
      { to: "/admin/settings", label: "Site Settings", icon: "FaCog" },
      { to: "/admin/preferences", label: "Preferences", icon: "FaSlidersH" },
    ],
  },
];

export const FLAT_NAV = NAV_GROUPS.flatMap((g) => g.items);

// Resolve the current page title from the active path.
export function titleFromPath(pathname) {
  const active =
    FLAT_NAV.find((i) => i.end && pathname === i.to) ||
    FLAT_NAV.find((i) => !i.end && pathname.startsWith(i.to));
  return active?.label ?? "Admin";
}
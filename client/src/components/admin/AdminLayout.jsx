import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaCog,
  FaEnvelope,
  FaLayerGroup,
  FaListAlt,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaTrophy,
  FaAward,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";

const sections = [
  { to: "/admin", label: "Dashboard", icon: <FaTachometerAlt />, end: true },
  { to: "/admin/settings", label: "Site Settings", icon: <FaCog /> },
  { to: "/admin/projects", label: "Projects", icon: <FaProjectDiagram /> },
  { to: "/admin/skills", label: "Skills", icon: <FaCode /> },
  { to: "/admin/experience", label: "Experience", icon: <FaBriefcase /> },
  { to: "/admin/education", label: "Education", icon: <FaGraduationCap /> },
  { to: "/admin/services", label: "Services", icon: <FaLayerGroup /> },
  { to: "/admin/testimonials", label: "Testimonials", icon: <FaStar /> },
  { to: "/admin/certifications", label: "Certifications", icon: <FaAward /> },
  { to: "/admin/achievements", label: "Achievements", icon: <FaTrophy /> },
  { to: "/admin/navigation", label: "Navigation", icon: <FaListAlt /> },
  { to: "/admin/messages", label: "Messages", icon: <FaEnvelope /> },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 inset-y-0 left-0 w-64 bg-base-100 border-r border-base-300 transform transition-transform lg:transform-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-base-300">
          <h1 className="text-lg font-bold">Portfolio CMS</h1>
          <p className="text-xs opacity-60">{user?.name || "Admin"}</p>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-80px)]">
          {sections.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
                }`
              }
            >
              {s.icon}
              {s.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-base-100 border-b border-base-300 px-4 h-14 flex items-center justify-between">
          <button className="btn btn-ghost btn-sm lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            ☰
          </button>
          <div className="text-sm opacity-70 hidden sm:block">Admin Dashboard</div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              View Site
            </a>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>
        <main className="p-4 lg:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

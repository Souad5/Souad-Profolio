import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { admin as adminApi } from "../../api/endpoints.js";
import StatCard from "../../components/admin/StatCard.jsx";
import { LoadingState, ErrorState } from "../../components/admin/States.jsx";
import { timeAgo } from "../../lib/utils.js";
import {
  FaProjectDiagram,
  FaStar,
  FaCode,
  FaEnvelope,
  FaGraduationCap,
  FaBriefcase,
  FaAward,
  FaTrophy,
} from "react-icons/fa";

const quickActions = [
  { to: "/admin/projects", label: "Add Project" },
  { to: "/admin/settings", label: "Edit Settings" },
  { to: "/admin/skills", label: "Manage Skills" },
  { to: "/admin/messages", label: "View Messages" },
];

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["stats"],
    queryFn: adminApi.stats,
    select: (res) => res?.data,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState retry={refetch} />;

  const s = data?.stats ?? {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Projects" value={s.projects} icon={<FaProjectDiagram />} accent="primary" />
        <StatCard label="Featured" value={s.featuredProjects} icon={<FaStar />} accent="warning" />
        <StatCard label="Skills" value={s.skills} icon={<FaCode />} accent="info" />
        <StatCard label="Experience" value={s.experience} icon={<FaBriefcase />} accent="success" />
        <StatCard label="Education" value={s.education} icon={<FaGraduationCap />} accent="neutral" />
        <StatCard label="Certifications" value={s.certifications} icon={<FaAward />} accent="success" />
        <StatCard label="Achievements" value={s.achievements} icon={<FaTrophy />} accent="warning" />
        <StatCard label="Unread Messages" value={s.unreadMessages} icon={<FaEnvelope />} accent="error" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick actions */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((a) => (
                <Link key={a.to} to={a.to} className="btn btn-outline btn-sm">{a.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent messages */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Recent Messages</h2>
            {data?.recentMessages?.length ? (
              <ul className="space-y-2">
                {data.recentMessages.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-sm border-b border-base-200 pb-2">
                    <div className="min-w-0">
                      <span className="font-medium">{m.name}</span>
                      <span className="block text-xs opacity-60 truncate">{m.message}</span>
                    </div>
                    <span className="text-xs opacity-60 shrink-0">{timeAgo(m.createdAt)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-base-400">No messages yet</p>
            )}
            <Link to="/admin/messages" className="link link-primary text-sm">View all →</Link>
          </div>
        </div>
      </div>

      {/* Section visibility status */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Portfolio Sections</h2>
            <Link to="/admin/settings" className="link link-primary text-sm">Manage →</Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(data?.visibility ?? []).map((v) => (
              <span key={v.key} className={`badge badge-lg ${v.enabled ? "badge-success" : "badge-neutral"}`}>
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

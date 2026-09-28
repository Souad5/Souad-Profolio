import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { admin as adminApi } from "../../api/endpoints.js";
import { useAdminMessages } from "../../hooks/useAdmin.js";
import { useSkills } from "../../hooks/usePortfolio.js";
import { LoadingState, ErrorState } from "../../components/admin/States.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { AppButton } from "../../components/ui/app-button.jsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { timeAgo, initials, cn } from "../../lib/utils.js";
import { usePreferences } from "../../hooks/usePreferences.js";

const QUICK_ACTIONS = [
  { to: "/admin/projects", label: "Add Project", icon: "FaPlus" },
  { to: "/admin/messages", label: "View Messages", icon: "FaEnvelope" },
  { to: "/admin/skills", label: "Manage Skills", icon: "FaCode" },
  { to: "/admin/settings", label: "Edit Settings", icon: "FaCog" },
];

const CHART_COLORS = [
  "#10b981",
  "#059669",
  "#34d399",
  "#a7f3d0",
  "#047857",
  "#6ee7b7",
  "#0d9488",
  "#2dd4bf",
];

function CardShell({ children, className = "" }) {
  return (
    <Card className={cn("ring-border/70 shadow-sm", className)}>{children}</Card>
  );
}

function ChartEmpty({ label }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
      <span className="rounded-full bg-muted p-3 text-muted-foreground">
        <Icon name="FaChartBar" className="h-5 w-5" />
      </span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay },
  };
}

function KpiStat({ label, value, icon, sub, to, color = "brand" }) {
  const palette = {
    brand: {
      border: "border-l-brand-500",
      icon: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
    },
    sky: {
      border: "border-l-sky-500",
      icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    amber: {
      border: "border-l-amber-500",
      icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    violet: {
      border: "border-l-violet-500",
      icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  }[color];

  const inner = (
    <CardShell className={cn("group h-full overflow-hidden border-l-4", palette.border)}>
      <CardContent className="flex items-start gap-4 p-5">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            palette.icon,
          )}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-3xl font-bold tracking-tight text-foreground">
            {value ?? 0}
          </p>
          {sub && <p className="mt-1 truncate text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </CardShell>
  );
  return to ? (
    <Link to={to} className="block h-full transition hover:-translate-y-0.5">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function DonutCard({ title, description, data, emptyLabel, children }) {
  const hasData = Array.isArray(data) && data.length > 0;
  return (
    <CardShell>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription className="mt-0.5 text-xs">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          children
        ) : (
          <ChartEmpty label={emptyLabel ?? `No ${title.toLowerCase()} yet`} />
        )}
      </CardContent>
    </CardShell>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["stats"],
    queryFn: adminApi.stats,
    select: (res) => res?.data,
  });

  const { data: categories = [] } = useSkills();
  const { prefs } = usePreferences();
  const reduceMotion = !!prefs.reduceMotion;

  const { data: messagesData } = useAdminMessages(4);
  const messages = messagesData?.items ?? [];

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState retry={refetch} />;

  const s = data?.stats ?? {};
  const charts = data?.charts ?? {};
  const visibility = data?.visibility ?? [];

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const skillRadar = Array.isArray(categories)
    ? categories
        .map((c) => {
          const list = c.skills ?? [];
          const avg = list.length
            ? Math.round(
                list.reduce((sum, sk) => sum + (sk.level || 0), 0) / list.length,
              )
            : 0;
          return { name: c.name, level: avg };
        })
        .filter((c) => c.level > 0)
    : [];

  const projectsByCategory = charts.projectsByCategory ?? [];
  const projectsByStatus = charts.projectsByStatus ?? [];
  const projectsFeatured = charts.projectsFeatured ?? [];

  const featuredPct =
    s.projects > 0 ? Math.round((s.featuredProjects / s.projects) * 100) : 0;

  const visibleSections = visibility.filter((v) => v.enabled).length;
  const hiddenSections = visibility.length - visibleSections;
  const unread = s.unreadMessages ?? 0;

  const readRatio =
    s.totalMessages > 0
      ? Math.round(((s.totalMessages - unread) / s.totalMessages) * 100)
      : 0;

  const M = reduceMotion ? "div" : motion.div;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {today}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Overview of your portfolio content at a glance
          </p>
        </div>
        <AppButton size="sm" variant="outline" asChild>
          <Link to="/admin/messages">
            <Icon name="FaEnvelope" className="h-4 w-4" />
            {unread > 0 ? (
              <>
                {unread} unread message{unread > 1 ? "s" : ""}
                <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-500 align-middle" />
              </>
            ) : (
              "Inbox"
            )}
          </Link>
        </AppButton>
      </div>

      {/* KPI row */}
      <M {...fade(0)}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiStat
            label="Projects"
            value={s.projects}
            sub={`${s.featuredProjects ?? 0} featured`}
            icon="FaProjectDiagram"
            to="/admin/projects"
            color="brand"
          />
          <KpiStat
            label="Skills"
            value={s.skills}
            sub={`${s.skillCategories ?? 0} categories`}
            icon="FaCode"
            to="/admin/skills"
            color="sky"
          />
          <KpiStat
            label="Unread messages"
            value={unread}
            sub={
              s.totalMessages > 0
                ? `${readRatio}% read of ${s.totalMessages}`
                : "No messages yet"
            }
            icon="FaEnvelope"
            to="/admin/messages"
            color={unread > 0 ? "amber" : "brand"}
          />
          <KpiStat
            label="Testimonials"
            value={s.testimonials}
            sub={s.testimonials > 0 ? "From happy clients" : "Add a review"}
            icon="FaStar"
            to="/admin/testimonials"
            color="violet"
          />
        </div>
      </M>

      {/* Primary charts: skills radar + projects donut */}
      <div className="grid gap-4 lg:grid-cols-2">
        <M {...fade(0.05)}>
          <CardShell>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle>Skills proficiency</CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Average level by category
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/admin/skills">Manage →</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {skillRadar.length ? (
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillRadar} outerRadius="72%">
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      />
                      <Radar
                        name="Proficiency"
                        dataKey="level"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                      <Legend
                        payload={[{ value: "Proficiency", type: "circle", color: "#10b981" }]}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ChartEmpty label="No skills added yet" />
              )}
            </CardContent>
          </CardShell>
        </M>

        <M {...fade(0.1)}>
          <CardShell>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle>Projects by category</CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Distribution across project categories
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/admin/projects">Manage →</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {projectsByCategory.length ? (
                <div style={{ height: 280 }} className="flex items-center">
                  <ResponsiveContainer width="55%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectsByCategory}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="55%"
                        outerRadius="85%"
                        paddingAngle={2}
                        strokeWidth={2}
                      >
                        {projectsByCategory.map((entry, i) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
                        formatter={(v, n) => [`${v} project${v === 1 ? "" : "s"}`, n]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-1 flex-col gap-2">
                    {projectsByCategory.slice(0, 5).map((c, i) => (
                      <div key={c.name} className="flex items-center gap-2 text-sm">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            background: CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                        <span className="min-w-0 flex-1 truncate text-muted-foreground">
                          {c.name}
                        </span>
                        <span className="font-semibold text-foreground">
                          {c.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ChartEmpty label="No projects added yet" />
              )}
            </CardContent>
          </CardShell>
        </M>
      </div>

      {/* Secondary charts: status + featured */}
      <div className="grid gap-4 lg:grid-cols-2">
        <M {...fade(0.15)}>
          <CardShell>
            <CardHeader>
              <CardTitle>Project status</CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Published vs draft projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectsByStatus.length ? (
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectsByStatus} barSize={48}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]}>
                        {projectsByStatus.map((entry, i) => (
                          <Cell
                            key={entry.name}
                            fill={i === 0 ? "#10b981" : "#94a3b8"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ChartEmpty label="No projects added yet" />
              )}
            </CardContent>
          </CardShell>
        </M>

        <M {...fade(0.2)}>
          <CardShell>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle>Featured projects</CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Highlighted on the public site
                </CardDescription>
              </div>
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                {featuredPct}%
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {s.featuredProjects ?? 0}
                </span>
                <span className="text-sm text-muted-foreground">
                  of {s.projects ?? 0} total projects
                </span>
              </div>
              {projectsFeatured.length ? (
                <div style={{ height: 130 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectsFeatured}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="88%"
                        startAngle={90}
                        endAngle={-270}
                        strokeWidth={0}
                      >
                        <Cell key="featured" fill="#10b981" />
                        <Cell key="standard" fill="var(--muted)" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No projects yet — add one to see the featured breakdown.
                </p>
              )}
            </CardContent>
          </CardShell>
        </M>
      </div>

      {/* Messages + Sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        <M {...fade(0.25)}>
          <CardShell>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent messages</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/admin/messages">View all →</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {messages.length ? (
                <ul className="space-y-1">
                  {messages.map((m) => (
                    <Link
                      key={m.id}
                      to="/admin/messages"
                      className="flex items-start gap-3 rounded-lg p-2 transition hover:bg-muted/50"
                    >
                      <Avatar className="size-9 text-xs">
                        <AvatarFallback
                          className={
                            m.read
                              ? "text-muted-foreground"
                              : "font-semibold text-brand-600 dark:text-brand-400"
                          }
                        >
                          {initials(m.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">
                            {m.name}
                            {!m.read && (
                              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-500 align-middle" />
                            )}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {timeAgo(m.createdAt)}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.message}
                        </p>
                      </div>
                    </Link>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <span className="rounded-full bg-muted p-3 text-muted-foreground">
                    <Icon name="FaEnvelope" className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    No messages yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    New contact-form submissions appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </CardShell>
        </M>

        <M {...fade(0.3)}>
          <CardShell>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Portfolio sections</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/admin/settings">Manage →</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Icon name="FaEye" className="h-3 w-3" />
                  {visibleSections} visible
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Icon name="FaEyeSlash" className="h-3 w-3" />
                  {hiddenSections} hidden
                </span>
              </div>
              {visibility.length ? (
                <ul className="space-y-1.5">
                  {visibility.map((v) => (
                    <li
                      key={v.key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <span className="text-foreground">{v.label}</span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          v.enabled
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {v.enabled ? "Visible" : "Hidden"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sections configured yet.
                </p>
              )}
            </CardContent>
          </CardShell>
        </M>
      </div>

      {/* Quick actions */}
      <M {...fade(0.35)}>
        <CardShell>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((a) => (
              <AppButton key={a.to} variant="outline" size="sm" asChild>
                <Link to={a.to}>
                  <Icon name={a.icon} className="h-3.5 w-3.5" />
                  {a.label}
                </Link>
              </AppButton>
            ))}
          </CardContent>
        </CardShell>
      </M>
    </div>
  );
}

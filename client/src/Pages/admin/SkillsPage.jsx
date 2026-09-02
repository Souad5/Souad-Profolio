import { useQuery } from "@tanstack/react-query";
import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";

const columns = [
  { label: "Skill", render: (r) => <span className="font-medium">{r.name}</span> },
  {
    label: "Level",
    render: (r) => (
      <div className="flex items-center gap-2">
        <progress className="progress progress-primary w-24" value={r.level} max="100"></progress>
        <span className="text-xs opacity-70">{r.level}%</span>
      </div>
    ),
  },
  { label: "Category", render: (r) => <span className="badge badge-ghost badge-sm">{r.category?.name ?? r.categoryId}</span> },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

export default function SkillsPage() {
  const { data: categories = [] } = useQuery({
    queryKey: ["skillCats"],
    queryFn: () => adminApi.skillCategories.list({ limit: 500 }),
    select: (res) => res?.data?.items ?? [],
  });

  const api = adminApi.skills;

  return (
    <CrudPage
      title="Skills"
      subtitle="Manage the skills shown on the public portfolio"
      queryKey="skills"
      reorderable
      api={{
        list: (p) => api.list(p),
        create: (d) => api.create(d),
        update: (id, d) => api.update(id, d),
        remove: (id) => api.remove(id),
        reorder: (items) => api.reorder(items),
      }}
      columns={columns}
      fields={[
        { name: "name", label: "Skill Name", required: true },
        { name: "level", label: "Level (0-100)", type: "number" },
        { name: "icon", label: "Icon", hint: "react-icons name, e.g. FaReact, FaHtml5, SiMongodb" },
        { name: "categoryId", label: "Category", type: "select", required: true, default: categories[0]?.id, options: categories.map((c) => ({ value: c.id, label: c.name })) },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No skills yet"
    />
  );
}

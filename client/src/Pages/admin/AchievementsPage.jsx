import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";

const columns = [
  { label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
  { label: "Detail", render: (r) => <span className="text-xs line-clamp-1">{r.detail || "—"}</span> },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

export default function AchievementsPage() {
  const api = adminApi.achievements;
  return (
    <CrudPage
      title="Achievements"
      subtitle="Manage your achievements and honors"
      queryKey="achievements"
      api={api}
      columns={columns}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "detail", label: "Detail", type: "textarea", rows: 3 },
        { name: "icon", label: "Icon", hint: "react-icons name, e.g. FaTrophy, FaMedal" },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No achievements yet"
    />
  );
}

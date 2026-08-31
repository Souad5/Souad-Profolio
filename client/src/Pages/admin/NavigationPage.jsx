import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";

const columns = [
  { label: "Order", render: (r) => <span className="text-xs opacity-60">{r.order}</span> },
  { label: "Label", render: (r) => <span className="font-medium">{r.label}</span> },
  { label: "Target", render: (r) => <code className="text-xs bg-base-200 px-1.5 py-0.5 rounded">{r.target}</code> },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

export default function NavigationPage() {
  const api = adminApi.navigation;
  return (
    <CrudPage
      title="Navigation"
      subtitle="Manage the public navigation links"
      queryKey="navigation"
      api={api}
      columns={columns}
      fields={[
        { name: "label", label: "Label", required: true },
        { name: "target", label: "Anchor Target", hint: "Must match a section name on the homepage (e.g. home, about, skills, projects, contact)", required: true },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No navigation items"
    />
  );
}

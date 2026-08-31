import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";

const columns = [
  { label: "Institution", render: (r) => <span className="font-medium">{r.institution}</span> },
  { label: "Degree", render: (r) => <span className="text-xs">{r.degree}</span> },
  { label: "Result", render: (r) => <span className="text-xs">{r.result || "—"}</span> },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

export default function EducationPage() {
  const api = adminApi.education;
  return (
    <CrudPage
      title="Education"
      subtitle="Manage your education history"
      queryKey="education"
      api={api}
      columns={columns}
      fields={[
        { name: "institution", label: "Institution", required: true },
        { name: "degree", label: "Degree / Qualification", required: true },
        { name: "result", label: "Result (optional)" },
        { name: "startYear", label: "Start Year" },
        { name: "endYear", label: "End Year" },
        { name: "image", label: "Institution Logo URL", type: "image" },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No education yet"
    />
  );
}

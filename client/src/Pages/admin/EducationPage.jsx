import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";
import { formatDate } from "../../lib/utils.js";

const columns = [
  { label: "Institution", render: (r) => <span className="font-medium">{r.institution}</span> },
  { label: "Degree", render: (r) => <span className="text-xs">{r.degree}</span> },
  {
    label: "Period",
    render: (r) => (
      <span className="text-xs">
        {formatDate(r.startYear)}
        {r.startYear && r.endYear ? " – " : ""}
        {formatDate(r.endYear)}
      </span>
    ),
  },
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
        { name: "startYear", label: "Start Date", type: "date" },
        { name: "endYear", label: "End Date", type: "date" },
        { name: "image", label: "Institution Logo URL", type: "image" },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No education yet"
    />
  );
}

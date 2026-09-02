import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";
import { formatDate } from "../../lib/utils.js";

const columns = [
  { label: "Position", render: (r) => (
      <div>
        <div className="font-medium">{r.position}</div>
        <div className="text-xs opacity-70">{r.company}</div>
      </div>
    ),
  },
  { label: "Type", render: (r) => <span className="text-xs">{r.employmentType}</span> },
  { label: "Period", render: (r) => (
      <span className="text-xs">
        {formatDate(r.startDate)} – {r.current ? "Present" : formatDate(r.endDate)}
      </span>
    ),
  },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

const api = adminApi.experience;

export default function ExperiencePage() {
  return (
    <CrudPage
      title="Experience"
      subtitle="Manage your professional work history"
      queryKey="experience"
      api={api}
      columns={columns}
      fields={[
        { name: "position", label: "Position / Title", required: true },
        { name: "company", label: "Company", required: true },
        { name: "employmentType", label: "Employment Type", placeholder: "Full-time, Freelance, Internship…" },
        { name: "location", label: "Location", placeholder: "Remote / City" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
        {
          name: "current",
          label: "Current Position",
          type: "radio",
          default: false,
          options: [
            { value: true, label: "Current", description: "I still work here" },
            { value: false, label: "Past", description: "This role has ended" },
          ],
        },
        { name: "description", label: "Description", type: "textarea", rows: 4 },
        {
          name: "highlights",
          label: "Highlights",
          type: "tags",
          hint: "Key duties or achievements — one per line",
        },
        { name: "technologies", label: "Technologies", type: "tags", hint: "One per line" },
        { name: "logo", label: "Company Logo URL", type: "image" },
        { name: "order", label: "Order", type: "number" },
        {
          name: "enabled",
          label: "Visibility",
          type: "radio",
          default: false,
          options: [
            { value: true, label: "Published", description: "Visible on the site" },
            { value: false, label: "Hidden", description: "Not shown publicly" },
          ],
        },
      ]}
      emptyMessage="No experience yet"
    />
  );
}

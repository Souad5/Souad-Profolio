import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";

const columns = [
  { label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
  { label: "Issuer", render: (r) => <span className="text-xs">{r.issuer}</span> },
  { label: "Year", render: (r) => <span className="text-xs">{r.year || "—"}</span> },
  { label: "Link", render: (r) => (r.link ? <a className="link link-primary text-xs" href={r.link} target="_blank" rel="noreferrer">View</a> : <span className="text-base-400">—</span>) },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

export default function CertificationsPage() {
  const api = adminApi.certifications;
  return (
    <CrudPage
      title="Certifications"
      subtitle="Manage your certifications"
      queryKey="certifications"
      api={api}
      columns={columns}
      fields={[
        { name: "title", label: "Certification Title", required: true },
        { name: "issuer", label: "Issuer", required: true },
        { name: "year", label: "Year" },
        { name: "link", label: "Credential URL" },
        { name: "image", label: "Image URL", type: "image" },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No certifications yet"
    />
  );
}

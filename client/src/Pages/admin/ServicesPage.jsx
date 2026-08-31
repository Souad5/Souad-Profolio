import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";

const columns = [
  { label: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
  { label: "Description", render: (r) => <span className="text-xs line-clamp-1">{r.description}</span> },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

export default function ServicesPage() {
  const api = adminApi.services;
  return (
    <CrudPage
      title="Services"
      subtitle="Manage services offered"
      queryKey="services"
      api={api}
      columns={columns}
      fields={[
        { name: "title", label: "Service Title", required: true },
        { name: "description", label: "Description", type: "textarea", rows: 4 },
        { name: "icon", label: "Icon", hint: "react-icons name, e.g. FaCode, FaLaptopCode" },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No services yet"
    />
  );
}

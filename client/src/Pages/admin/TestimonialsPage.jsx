import CrudPage from "../../components/admin/CrudPage.jsx";
import StatusBadge from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";

const columns = [
  { label: "Name", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="avatar"><div className="w-8 rounded-full bg-base-200">{r.avatar ? <img src={r.avatar} alt="" /> : <span className="text-xs flex items-center justify-center h-full">{r.name?.[0]}</span>}</div></div>
        <span className="font-medium">{r.name}</span>
      </div>
    ),
  },
  { label: "Role", render: (r) => <span className="text-xs">{r.role || "—"}</span> },
  { label: "Featured", render: (r) => (r.featured ? <span className="badge badge-warning badge-sm">★</span> : <span className="text-base-400">—</span>) },
  { label: "Status", render: (r) => <StatusBadge enabled={r.enabled} /> },
];

export default function TestimonialsPage() {
  const api = adminApi.testimonials;
  return (
    <CrudPage
      title="Testimonials"
      subtitle="Manage client testimonials"
      queryKey="testimonials"
      api={api}
      columns={columns}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "role", label: "Role" },
        { name: "company", label: "Company" },
        { name: "content", label: "Testimonial", type: "textarea", rows: 4, required: true },
        { name: "avatar", label: "Avatar URL", type: "image" },
        { name: "rating", label: "Rating (0-5)", type: "number" },
        { name: "featured", label: "Featured", type: "boolean" },
        { name: "order", label: "Order", type: "number" },
        { name: "enabled", label: "Enabled", type: "boolean" },
      ]}
      emptyMessage="No testimonials yet"
    />
  );
}

import { useQueryClient } from "@tanstack/react-query";
import CrudPage from "../../components/admin/CrudPage.jsx";
import { PublishedBadge, FeaturedBadge } from "../../components/admin/Badges.jsx";
import { admin as adminApi } from "../../api/endpoints.js";
import { useToast } from "../../lib/toast.jsx";

const columns = [
  {
    label: "Project",
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="avatar">
          <div className="w-10 h-10 rounded-lg bg-base-200 overflow-hidden">
            {r.thumbnail ? <img src={r.thumbnail} alt="" className="object-cover w-full h-full" /> : <div className="w-full h-full" />}
          </div>
        </div>
        <span className="font-medium">{r.title}</span>
      </div>
    ),
  },
  { label: "Category", render: (r) => <span className="text-xs">{r.category || "—"}</span> },
  { label: "Status", render: (r) => (
        <div className="flex gap-1">
          <PublishedBadge published={r.published} />
          <FeaturedBadge featured={r.featured} />
        </div>
      ),
  },
];

export default function ProjectsPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const api = adminApi.projects;

  const handleDuplicate = async (row) => {
    try {
      await api.duplicate(row.id);
      toast.success("Project duplicated");
      await qc.invalidateQueries({ queryKey: ["adminProjects"] });
    } catch (err) {
      toast.error(err.message || "Failed to duplicate");
    }
  };

  return (
    <CrudPage
      title="Projects"
      subtitle="Add, edit, and publish projects shown on the portfolio"
      queryKey="adminProjects"
      api={{
        list: (p) => api.list(p),
        create: (d) => api.create(d),
        update: (id, d) => api.update(id, d),
        remove: (id) => api.remove(id),
      }}
      columns={columns}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "category", label: "Category (e.g. Full Stack, Frontend, MERN)" },
        { name: "shortDescription", label: "Short Description", type: "textarea", rows: 2 },
        { name: "description", label: "Full Description", type: "textarea", rows: 5 },
        { name: "thumbnail", label: "Thumbnail", type: "image", placeholder: "/project.png" },
        { name: "technologies", label: "Technologies", type: "tags", hint: "One per line" },
        { name: "liveUrl", label: "Live Project URL" },
        { name: "githubUrl", label: "GitHub URL" },
        { name: "challenges", label: "Challenges Faced", type: "textarea", rows: 2 },
        { name: "improvements", label: "Improvements / Future Plans", type: "textarea", rows: 2 },
        { name: "featured", label: "Featured", type: "boolean" },
        { name: "published", label: "Published", type: "boolean" },
        { name: "order", label: "Order", type: "number" },
      ]}
      onDuplicate={handleDuplicate}
      duplicateLabel="Duplicate"
      emptyMessage="No projects yet"
    />
  );
}

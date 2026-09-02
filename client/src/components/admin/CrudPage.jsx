import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "./DataTable.jsx";
import FormModal from "./FormModal.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { Field, TextInput, TextArea, RadioField } from "./FormFields.jsx";
import ImageInput from "./ImageInput.jsx";
import { useToast } from "../../lib/toast.jsx";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import { AppButton } from "../ui/app-button.jsx";
import PageHeader from "./PageHeader.jsx";
import { usePreferences } from "../../hooks/usePreferences.js";

function toFormState(row, fields) {
  const s = {};
  for (const f of fields) {
    let v = row ? row[f.name] : f.default;
    if (v === undefined && (f.type === "boolean" || f.type === "radio")) v = false;
    else if (v === undefined) v = "";
    if (f.type === "tags" && Array.isArray(v)) v = v.join("\n");
    if (f.type === "date" && v) v = new Date(v).toISOString().slice(0, 10);
    s[f.name] = v;
  }
  return s;
}

function fromFormState(state, fields) {
  const data = {};
  for (const f of fields) {
    let v = state[f.name];
    if (f.type === "tags") v = String(v).split("\n").map((s) => s.trim()).filter(Boolean);
    else if (f.type === "number") v = v === "" ? undefined : Number(v);
    else if (f.type === "boolean") v = !!v;
    else if (f.type === "select" && v !== "") {
      const opt = f.options?.find((o) => String(o.value) === String(v));
      v = opt !== undefined && typeof opt.value === "number" ? Number(v) : v;
    }
    data[f.name] = v;
  }
  return data;
}

function FieldRenderer({ field, value, onChange }) {
  if (field.type === "textarea")
    return (
      <Field label={field.label}>
        <TextArea rows={field.rows || 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={field.required} />
      </Field>
    );
  if (field.type === "tags")
    return (
      <Field label={field.label} hint={field.hint ?? "One per line"}>
        <TextArea rows={field.rows || 4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  if (field.type === "boolean")
    return (
      <RadioField
        label={field.label}
        value={value}
        onChange={onChange}
        options={
          field.options ?? [
            { value: true, label: field.yesLabel ?? "Yes", description: field.yesDescription ?? "On / Published" },
            { value: false, label: field.noLabel ?? "No", description: field.noDescription ?? "Off / Hidden" },
          ]
        }
      />
    );
  if (field.type === "image")
    return <ImageInput label={field.label} value={value} onChange={onChange} placeholder={field.placeholder} />;
  if (field.type === "date")
    return (
      <Field label={field.label}>
        <TextInput type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  if (field.type === "select")
    return (
      <Field label={field.label}>
        <select className="select select-bordered w-full" value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={field.required}>
          <option value="" disabled>Select {field.label.toLowerCase()}</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>
    );
  if (field.type === "radio")
    return (
      <RadioField
        label={field.label}
        value={value}
        onChange={onChange}
        options={field.options}
        className={field.className}
      />
    );
  return (
    <Field label={field.label}>
      <TextInput type={field.inputType ?? "text"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} required={field.required} />
    </Field>
  );
}

export default function CrudPage({
  title,
  subtitle,
  api,
  queryKey,
  columns,
  fields,
  emptyMessage = "No records found",
  onDuplicate,
  duplicateLabel,
  reorderable = false,
}) {
  const qc = useQueryClient();
  const toast = useToast();
  const { prefs } = usePreferences();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(undefined); // null => closed
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState([]);

  // Namespace admin list caches under an "admin" prefix so they never collide
  // with (or invalidate) the public landing page's same-named caches (e.g.
  // ["experience"] vs ["admin", "experience", search]). Without this, editing
  // in the admin prefix-invalidates the public cache and the two views
  // interfere with each other.
  const adminKey = ["admin", queryKey];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...adminKey, search],
    queryFn: () => api.list({ search, limit: 500 }),
    select: (res) => res?.data?.items ?? [],
  });

  // Keep the view in sync with fresh server data (covers refetches that follow
  // create/update/delete, and reverts after a failed reorder).
  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  const deleteMut = useMutation({ mutationFn: (id) => api.remove(id) });

  const isEdit = !!editing?.id;

  function startAdd() {
    setEditing({ ...toFormState(null, fields), id: null });
  }
  function startEdit(row) {
    setEditing({ ...toFormState(row, fields), id: row.id });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = fromFormState(editing, fields);
      if (isEdit) await api.update(editing.id, payload);
      else await api.create(payload);
      toast.success(isEdit ? "Updated" : "Created");
      setEditing(null);
      await qc.invalidateQueries({ queryKey: adminKey });
      await refetch();
    } catch (err) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Deleted");
      setDeleting(null);
      await qc.invalidateQueries({ queryKey: adminKey });
      await refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  }

  // Optimistically reorders the visible rows, then persists the new order.
  async function handleReorder(next) {
    setRows(next);
    const payload = next.map((r, i) => ({ id: r.id, order: i }));
    try {
      await api.reorder(payload);
      toast.success("Order updated");
      await qc.invalidateQueries({ queryKey: adminKey });
      await refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update order");
      await refetch();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} count={data?.length} />

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load. Check server connection.
        </div>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        loading={isLoading}
        emptyMessage={emptyMessage}
        searchValue={search}
        onSearch={setSearch}
        addLabel={`Add ${title.replace(/s$/, "")}`}
        onAdd={startAdd}
        density={prefs.tableDensity}
        reorderable={reorderable}
        onReorder={handleReorder}
        actions={(row) => (
          <div className="flex justify-end gap-1">
            {onDuplicate && (
              <AppButton
                variant="ghost"
                size="icon-sm"
                title={duplicateLabel || "Duplicate"}
                aria-label={`Duplicate ${row.title || row.name || "record"}`}
                onClick={() => onDuplicate(row)}
              >
                <FaCopy />
              </AppButton>
            )}
            <AppButton
              variant="ghost"
              size="icon-sm"
              title="Edit"
              aria-label={`Edit ${row.title || row.name || "record"}`}
              onClick={() => startEdit(row)}
            >
              <FaEdit />
            </AppButton>
            <AppButton
              variant="ghost"
              size="icon-sm"
              className="text-error hover:text-error dark:hover:text-red-400"
              title="Delete"
              aria-label={`Delete ${row.title || row.name || "record"}`}
              onClick={() => setDeleting(row)}
            >
              <FaTrash />
            </AppButton>
          </div>
        )}
      />

      {editing !== null && editing !== undefined && (
        <FormModal
          open={true}
          title={isEdit ? `Edit ${title.replace(/s$/, "")}` : `Add ${title.replace(/s$/, "")}`}
          onClose={() => setEditing(null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          {fields.map((f) => (
            <FieldRenderer
              key={f.name}
              field={f}
              value={editing[f.name]}
              onChange={(val) => setEditing((prev) => ({ ...prev, [f.name]: val }))}
            />
          ))}
        </FormModal>
      )}

      <ConfirmDialog
        open={!!deleting}
        message={`Delete "${deleting?.title || deleting?.name || "this record"}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}

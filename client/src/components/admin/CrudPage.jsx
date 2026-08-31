import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "./DataTable.jsx";
import FormModal from "./FormModal.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { Field, TextInput, TextArea } from "./FormFields.jsx";
import ImageInput from "./ImageInput.jsx";
import { useToast } from "../../lib/toast.jsx";
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";

function toFormState(row, fields) {
  const s = {};
  for (const f of fields) {
    let v = row ? row[f.name] : f.default ?? "";
    if (f.type === "tags" && Array.isArray(v)) v = v.join("\n");
    if (f.type === "date" && v) v = new Date(v).toISOString().slice(0, 10);
    s[f.name] = v ?? "";
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
      <div className="form-control">
        <label className="label cursor-pointer justify-between">
          <span className="label-text">{field.label}</span>
          <input type="checkbox" className="toggle toggle-primary" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        </label>
      </div>
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
        <select className="select select-bordered w-full" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>
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
}) {
  const qc = useQueryClient();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(undefined); // null => closed
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [queryKey, search],
    queryFn: () => api.list({ search, limit: 500 }),
    select: (res) => res?.data?.items ?? [],
  });

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
      await qc.invalidateQueries({ queryKey: [queryKey] });
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
      await qc.invalidateQueries({ queryKey: [queryKey] });
      await refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="opacity-70 text-sm">{subtitle}</p>}
      </div>

      {isError && <div className="alert alert-error">Failed to load. Check server connection.</div>}

      <DataTable
        columns={columns}
        rows={data ?? []}
        loading={isLoading}
        emptyMessage={emptyMessage}
        searchValue={search}
        onSearch={setSearch}
        addLabel={`Add ${title.replace(/s$/, "")}`}
        onAdd={startAdd}
        actions={(row) => (
          <div className="flex justify-end gap-1">
            {onDuplicate && (
              <button className="btn btn-ghost btn-xs" title={duplicateLabel || "Duplicate"} onClick={() => onDuplicate(row)}>
                <FaCopy />
              </button>
            )}
            <button className="btn btn-ghost btn-xs" title="Edit" onClick={() => startEdit(row)}>
              <FaEdit />
            </button>
            <button className="btn btn-ghost btn-xs text-error" title="Delete" onClick={() => setDeleting(row)}>
              <FaTrash />
            </button>
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

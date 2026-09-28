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

// Mirrors the server's link rule: http(s), mailto:, tel: or a site-relative path.
const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i;
const isLinkField = (f) => f.type !== "image" && /(url|link)$/i.test(f.name);

// Client-side checks run before submit; the server re-validates with Zod.
function validateFields(state, fields) {
  const errors = {};
  for (const f of fields) {
    const v = state[f.name];
    const empty = v === undefined || v === null || String(v).trim() === "";
    if (f.required && empty) errors[f.name] = `${f.label} is required`;
    else if (!empty && f.type === "image" && !/^(https?:\/\/|\/(?!\/))/i.test(String(v).trim()))
      errors[f.name] = "Use an https:// URL or a /path";
    else if (!empty && isLinkField(f) && !SAFE_LINK.test(String(v).trim()))
      errors[f.name] = "Enter a full URL starting with https:// (or a /path)";
    else if (!empty && f.type === "number") {
      const n = Number(v);
      if (Number.isNaN(n)) errors[f.name] = "Must be a number";
      else if (f.min !== undefined && n < f.min) errors[f.name] = `Must be at least ${f.min}`;
      else if (f.max !== undefined && n > f.max) errors[f.name] = `Must be at most ${f.max}`;
    }
  }
  return errors;
}

// The API reports Zod failures as "field: message; other: message".
function parseServerErrors(message, fields) {
  const names = new Set(fields.map((f) => f.name));
  const errors = {};
  for (const part of String(message || "").split(";")) {
    const i = part.indexOf(":");
    if (i === -1) continue;
    const key = part.slice(0, i).trim().split(".")[0];
    if (names.has(key)) errors[key] = part.slice(i + 1).trim();
  }
  return errors;
}

function FieldRenderer({ field, value, onChange, error }) {
  if (field.type === "textarea")
    return (
      <Field label={field.label} required={field.required} error={error}>
        <TextArea rows={field.rows || 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={field.required} aria-invalid={!!error} />
      </Field>
    );
  if (field.type === "tags")
    return (
      <Field label={field.label} hint={field.hint ?? "One per line"} error={error}>
        <TextArea rows={field.rows || 4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
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
    return <ImageInput label={field.label} value={value} onChange={onChange} placeholder={field.placeholder} error={error} />;
  if (field.type === "date")
    return (
      <Field label={field.label} required={field.required} error={error}>
        <TextInput type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={field.required} aria-invalid={!!error} />
      </Field>
    );
  if (field.type === "select")
    return (
      <Field label={field.label} required={field.required} error={error}>
        <select className="select select-bordered w-full" value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={field.required} aria-invalid={!!error}>
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
    <Field label={field.label} required={field.required} error={error} hint={field.hint}>
      <TextInput
        type={field.type === "number" ? "number" : field.inputType ?? (isLinkField(field) ? "url" : "text")}
        min={field.min}
        max={field.max}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? (isLinkField(field) ? "https://" : undefined)}
        required={field.required}
        aria-invalid={!!error}
      />
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
  // Public-site query keys showing this data (default: [queryKey]); they are
  // invalidated after every write so the portfolio reflects changes at once.
  publicKeys,
}) {
  const qc = useQueryClient();
  const toast = useToast();
  const { prefs } = usePreferences();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(undefined); // null => closed
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  // Namespace admin list caches under an "admin" prefix so they never collide
  // with (or invalidate) the public landing page's same-named caches (e.g.
  // ["experience"] vs ["admin", "experience", search]). Without this, editing
  // in the admin prefix-invalidates the public cache and the two views
  // interfere with each other.
  const adminKey = ["admin", queryKey];

  // Admin list + public-site cache + dashboard counts, refreshed after writes.
  async function invalidateAll() {
    const keys = [adminKey, ...(publicKeys ?? [[queryKey]]), ["stats"], ["admin-stats"]];
    await Promise.all(keys.map((queryKey) => qc.invalidateQueries({ queryKey })));
  }

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
    setFieldErrors({});
    setEditing({ ...toFormState(null, fields), id: null });
  }
  function startEdit(row) {
    setFieldErrors({});
    setEditing({ ...toFormState(row, fields), id: row.id });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const clientErrors = validateFields(editing, fields);
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = fromFormState(editing, fields);
      if (isEdit) await api.update(editing.id, payload);
      else await api.create(payload);
      toast.success(isEdit ? "Changes saved" : "Created");
      setEditing(null);
      await invalidateAll();
      await refetch();
    } catch (err) {
      const serverErrors = err.status === 400 ? parseServerErrors(err.message, fields) : {};
      setFieldErrors(serverErrors);
      toast.error(Object.keys(serverErrors).length ? "Please fix the highlighted fields" : err.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Deleted");
      setDeleting(null);
      await invalidateAll();
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
      await invalidateAll();
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
              error={fieldErrors[f.name]}
              onChange={(val) => {
                setEditing((prev) => ({ ...prev, [f.name]: val }));
                if (fieldErrors[f.name]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next[f.name];
                    return next;
                  });
                }
              }}
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

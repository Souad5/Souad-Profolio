import { FaPlus } from "react-icons/fa";

export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  actions = null,
  emptyMessage = "No records found",
  searchValue,
  onSearch,
  addLabel,
  onAdd,
}) {
  return (
    <div className="space-y-4">
      {(searchValue !== undefined || addLabel) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {searchValue !== undefined && (
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Search…"
              className="input input-bordered input-sm w-full sm:max-w-xs"
              aria-label="Search"
            />
          )}
          {addLabel && (
            <button onClick={onAdd} className="btn btn-primary btn-sm">
              <FaPlus /> {addLabel}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table table-sm w-full">
          <thead>
            <tr className="bg-base-200">
              {columns.map((c) => (
                <th key={c.key || c.label}>{c.label}</th>
              ))}
              {actions && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-10">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-10 text-base-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-base-200/60">
                  {columns.map((c) => (
                    <td key={c.key || c.label}>
                      {c.render ? c.render(row) : row[c.key] ?? "—"}
                    </td>
                  ))}
                  {actions && <td className="text-right whitespace-nowrap">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

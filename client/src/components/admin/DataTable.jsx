import { FaPlus } from "react-icons/fa";
import { AppButton } from "../ui/app-button.jsx";
import { AppInput } from "../ui/app-input.jsx";
import { Skeleton } from "../ui/skeleton.jsx";

function SkeletonRows({ columnsCount, actions, cellPadding }) {
  const rowCount = 5;
  const cells = columnsCount + (actions ? 1 : 0);
  return (
    <>
      {Array.from({ length: rowCount }).map((_, r) => (
        <tr key={r} className="border-b border-border/60 last:border-0">
          {Array.from({ length: cells }).map((__, c) => (
            <td key={c} className={`${cellPadding} align-middle`}>
              <Skeleton className="h-4 w-24" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

const densityPaddings = {
  compact: { cell: "px-4 py-2", row: "px-4 py-2", head: "px-4 py-2.5" },
  comfortable: { cell: "px-6 py-5", row: "px-7 py-5", head: "px-6 py-4" },
};

function TableBody({ columns, rows, loading, actions, emptyMessage, density }) {
  const colSpan = columns.length + (actions ? 1 : 0);
  const { cell, row } = densityPaddings[density] ?? densityPaddings.comfortable;

  if (loading) {
    return (
      <SkeletonRows
        columnsCount={columns.length}
        actions={!!actions}
        cellPadding={cell}
      />
    );
  }

  if (rows.length === 0) {
    return (
      <tr>
        <td colSpan={colSpan} className={`${row} text-center`}>
          <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
            <span className="rounded-full bg-muted p-3 text-muted-foreground">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
            </span>
            <p className="text-sm font-medium text-foreground">
              {emptyMessage}
            </p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search, or add a new record.
            </p>
          </div>
        </td>
      </tr>
    );
  }

  return rows.map((row, i) => (
    <tr
      key={row.id ?? i}
      className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
    >
      {columns.map((c) => (
        <td key={c.key || c.label} className={`${row} align-middle p-4`}>
          {c.render
            ? c.render(row)
            : (row[c.key] ?? <span className="text-muted-foreground">—</span>)}
        </td>
      ))}
      {actions && (
        <td className={`whitespace-nowrap ${row} text-right align-middle`}>
          {actions(row)}
        </td>
      )}
    </tr>
  ));
}

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
  density = "comfortable",
}) {
  const showToolbar = searchValue !== undefined || addLabel;
  const headPadding =
    densityPaddings[density]?.head ?? densityPaddings.comfortable.head;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {showToolbar && (
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchValue !== undefined && (
            <AppInput
              type="search"
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Search…"
              className="w-full max-w-xs"
              aria-label="Search"
            />
          )}
          {addLabel && (
            <AppButton size="sm" onClick={onAdd}>
              <FaPlus /> {addLabel}
            </AppButton>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border bg-muted/40 text-left">
              {columns.map((c) => (
                <th
                  key={c.key || c.label}
                  className={`whitespace-nowrap ${headPadding} text-xs font-semibold uppercase tracking-wider text-muted-foreground`}
                >
                  {c.label}
                </th>
              ))}
              {actions && (
                <th
                  className={`whitespace-nowrap ${headPadding} text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <TableBody
              columns={columns}
              rows={rows}
              loading={loading}
              actions={actions}
              emptyMessage={emptyMessage}
              density={density}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

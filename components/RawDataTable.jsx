"use client";

import { useState } from "react";

const STATUS_COLORS = {
  approve: { text: "#34d399", bg: "rgba(52,211,153,0.1)" },
  revision: { text: "#fb7185", bg: "rgba(251,113,133,0.1)" },
  redo: { text: "#fb7185", bg: "rgba(251,113,133,0.1)" },
  pending: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  default: { text: "#8c8775", bg: "rgba(140,135,117,0.1)" },
};

function getStatusColor(status = "") {
  const s = status.toLowerCase();
  if (s.includes("approv")) return STATUS_COLORS.approve;
  if (s.includes("revis")) return STATUS_COLORS.revision;
  if (s.includes("redo")) return STATUS_COLORS.redo;
  if (s.includes("pend")) return STATUS_COLORS.pending;
  return STATUS_COLORS.default;
}

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function RawDataTable({ rows }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.clientName?.toLowerCase().includes(q) ||
      r.writerName?.toLowerCase().includes(q) ||
      r.editor?.toLowerCase().includes(q) ||
      r.contentType?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q) ||
      r.remarks?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const columns = [
    { key: "date",        label: "Date",         mono: true },
    { key: "editor",      label: "Editor" },
    { key: "clientCode",  label: "Code",          mono: true },
    { key: "clientName",  label: "Client" },
    { key: "empId",       label: "Emp ID",        mono: true },
    { key: "writerName",  label: "Writer" },
    { key: "contentType", label: "Content Type" },
    { key: "wordCount",   label: "WC",            mono: true, num: true },
    { key: "approvedWC",  label: "Appr. WC",      mono: true, num: true, color: "jade" },
    { key: "revisionWC",  label: "Rev. WC",       mono: true, num: true, color: "rose" },
    { key: "status",      label: "Status",        badge: true },
    { key: "remarks",     label: "Remarks",       muted: true },
  ];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b flex-wrap gap-3"
        style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="font-display font-bold text-base text-ink-100">Raw Data</h2>
          <p className="text-xs text-ink-500 mt-0.5">{filtered.length} rows</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-ink-200 focus:outline-none"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search rows…"
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-ink-200 placeholder:text-ink-600
              focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-40"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
              <th className="px-4 py-3 text-left font-mono text-ink-500 uppercase tracking-wider">#</th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-mono text-ink-400 uppercase tracking-wider whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, idx) => (
              <tr key={idx}
                className="border-b hover:bg-white/[0.02] transition-colors"
                style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-2.5 font-mono text-ink-600">
                  {(safePage - 1) * pageSize + idx + 1}
                </td>
                {columns.map((col) => {
                  const val = row[col.key];
                  if (col.badge) {
                    const c = getStatusColor(val);
                    return (
                      <td key={col.key} className="px-4 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono"
                          style={{ color: c.text, background: c.bg }}>
                          {val || "—"}
                        </span>
                      </td>
                    );
                  }
                  const textColor = col.color === "jade" ? "#34d399"
                    : col.color === "rose" ? "#fb7185"
                    : col.muted ? "var(--text-muted)"
                    : "var(--text-primary)";
                  return (
                    <td key={col.key}
                      className={`px-4 py-2.5 ${col.num ? "text-right" : ""} ${col.mono ? "font-mono" : ""} ${col.muted ? "max-w-[160px] truncate" : "whitespace-nowrap"}`}
                      style={{ color: textColor }}
                      title={col.muted ? val : undefined}>
                      {col.num ? (val ? Number(val).toLocaleString() : "—") : (val || "—")}
                    </td>
                  );
                })}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-ink-600 font-mono text-xs">
                  No rows found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 flex items-center justify-between border-t" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-mono text-ink-500">
          Page {safePage} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <PagBtn onClick={() => setPage(1)} disabled={safePage === 1}>«</PagBtn>
          <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>‹</PagBtn>
          {getPaginationRange(safePage, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`e-${i}`} className="px-2 text-ink-600 font-mono text-xs">…</span>
            ) : (
              <PagBtn key={p} onClick={() => setPage(p)} active={p === safePage}>{p}</PagBtn>
            )
          )}
          <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>›</PagBtn>
          <PagBtn onClick={() => setPage(totalPages)} disabled={safePage === totalPages}>»</PagBtn>
        </div>
      </div>
    </div>
  );
}

function PagBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded-lg font-mono text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        background: active ? "var(--amber)" : "var(--bg-elevated)",
        color: active ? "var(--bg-base)" : "var(--text-muted)",
        border: `1px solid ${active ? "var(--amber)" : "var(--border)"}`,
      }}
    >
      {children}
    </button>
  );
}

function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

"use client";

import { useState } from "react";

const SORT_FIELDS = [
  { key: "totalArticles", label: "Articles" },
  { key: "totalWordCount", label: "Total WC" },
  { key: "totalApprovedWC", label: "Approved WC" },
  { key: "totalRevisionWC", label: "Revision WC" },
  { key: "approved", label: "Approved" },
  { key: "revision", label: "Revision" },
];

export default function AggregateTable({ title, data, nameLabel, colorAccent = "amber" }) {
  const [sortKey, setSortKey] = useState("totalArticles");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");

  const accentColor = {
    amber: "#f59e0b",
    sky:   "#38bdf8",
    jade:  "#34d399",
    rose:  "#fb7185",
  }[colorAccent] || "#f59e0b";

  const sorted = [...data]
    .filter((row) => row.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "desc" ? -1 : 1;
      return (a[sortKey] - b[sortKey]) * mul;
    });

  const maxVal = Math.max(...sorted.map((r) => r[sortKey] || 0), 1);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <h2 className="font-display font-bold text-base text-ink-100">{title}</h2>
          <p className="text-xs text-ink-500 mt-0.5">{sorted.length} entries</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${nameLabel.toLowerCase()}…`}
          className="px-3 py-1.5 rounded-lg text-xs font-mono text-ink-200 placeholder:text-ink-600
            focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-44"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        />
      </div>

      {/* Sort pills */}
      <div className="px-5 py-3 flex gap-2 flex-wrap border-b" style={{ borderColor: "var(--border)" }}>
        {SORT_FIELDS.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleSort(f.key)}
            className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
            style={{
              background: sortKey === f.key ? `rgba(${hexToRgb(accentColor)},0.15)` : "var(--bg-elevated)",
              border: `1px solid ${sortKey === f.key ? accentColor + "50" : "var(--border)"}`,
              color: sortKey === f.key ? accentColor : "var(--text-muted)",
            }}
          >
            {f.label} {sortKey === f.key ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
              <th className="px-5 py-3 text-left font-mono text-ink-400 uppercase tracking-wider w-8">#</th>
              <th className="px-5 py-3 text-left font-mono text-ink-400 uppercase tracking-wider">{nameLabel}</th>
              {SORT_FIELDS.map((f) => (
                <th key={f.key} className="px-4 py-3 text-right font-mono text-ink-400 uppercase tracking-wider cursor-pointer hover:text-ink-200 transition-colors"
                  onClick={() => toggleSort(f.key)}>
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-mono text-ink-400 uppercase tracking-wider">Rate</th>
              <th className="px-5 py-3 text-left font-mono text-ink-400 uppercase tracking-wider">Top Content</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => {
              const pct = maxVal > 0 ? (row[sortKey] / maxVal) * 100 : 0;
              const approvalRate = row.totalArticles > 0
                ? Math.round((row.approved / row.totalArticles) * 100)
                : 0;
              const topContent = Object.entries(row.contentTypes)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

              return (
                <tr key={row.name}
                  className="border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3 font-mono text-ink-600">{idx + 1}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-ink-100">{row.name}</div>
                    {/* Mini bar */}
                    <div className="mt-1.5 h-1 rounded-full w-full max-w-[120px]" style={{ background: "var(--bg-elevated)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: accentColor }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-200">{row.totalArticles}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-400">{fmtNum(row.totalWordCount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-jade-400">{fmtNum(row.totalApprovedWC)}</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-400">{fmtNum(row.totalRevisionWC)}</td>
                  <td className="px-4 py-3 text-right font-mono text-jade-400">{row.approved}</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-400">{row.revision}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono"
                      style={{
                        color: approvalRate >= 70 ? "#34d399" : approvalRate >= 40 ? "#fbbf24" : "#fb7185",
                        background: approvalRate >= 70 ? "rgba(52,211,153,0.1)" : approvalRate >= 40 ? "rgba(251,191,36,0.1)" : "rgba(251,113,133,0.1)",
                      }}>
                      {approvalRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-400 font-mono">{topContent}</td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={10} className="px-5 py-10 text-center text-ink-600 font-mono text-xs">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function fmtNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n?.toLocaleString() ?? "0";
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

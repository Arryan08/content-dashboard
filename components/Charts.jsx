"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#f59e0b", "#38bdf8", "#34d399", "#fb7185", "#a78bfa", "#f97316", "#e879f9"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs font-mono shadow-xl"
      style={{ background: "#1a1916", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="text-ink-300 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value?.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
}

export function TopClientsChart({ data }) {
  const chartData = data.slice(0, 10).map((d) => ({
    name: d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name,
    Articles: d.totalArticles,
    "Approved WC": d.totalApprovedWC,
  }));

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <h3 className="font-display font-bold text-sm text-ink-100 mb-4">Top Clients by Articles</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4}>
          <XAxis dataKey="name" tick={{ fill: "#6e6a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6e6a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="Articles" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPieChart({ rows }) {
  const counts = {};
  rows.forEach((r) => {
    const s = r.status || "Unknown";
    counts[s] = (counts[s] || 0) + 1;
  });
  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <h3 className="font-display font-bold text-sm text-ink-100 mb-4">Status Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
            strokeWidth={0} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: "#413e34", strokeWidth: 1 }}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(v) => <span style={{ color: "#8c8775", fontSize: 11, fontFamily: "JetBrains Mono" }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WriterWCChart({ data }) {
  const chartData = data.slice(0, 8).map((d) => ({
    name: d.name.split(" ")[0],
    "Total WC": d.totalWordCount,
    "Approved": d.totalApprovedWC,
    "Revision": d.totalRevisionWC,
  }));

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <h3 className="font-display font-bold text-sm text-ink-100 mb-4">Writer Word Count Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fill: "#6e6a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6e6a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="Approved" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Revision" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]} />
          <Legend formatter={(v) => <span style={{ color: "#8c8775", fontSize: 11, fontFamily: "JetBrains Mono" }}>{v}</span>} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ContentTypeChart({ rows }) {
  const counts = {};
  rows.forEach((r) => {
    const t = r.contentType || "Unknown";
    counts[t] = (counts[t] || 0) + 1;
  });
  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <h3 className="font-display font-bold text-sm text-ink-100 mb-4">Content Type Mix</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fill: "#6e6a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={100}
            tick={{ fill: "#8c8775", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" name="Articles" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

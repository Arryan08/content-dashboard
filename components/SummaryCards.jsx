"use client";

export default function SummaryCards({ rows }) {
  const totalArticles = rows.length;
  const totalWC = rows.reduce((s, r) => s + r.wordCount, 0);
  const totalApprovedWC = rows.reduce((s, r) => s + r.approvedWC, 0);
  const totalRevisionWC = rows.reduce((s, r) => s + r.revisionWC, 0);
  const approvedCount = rows.filter((r) => (r.status || "").toLowerCase().includes("approv")).length;
  const revisionCount = rows.filter((r) => {
    const s = (r.status || "").toLowerCase();
    return s.includes("revis") || s.includes("redo");
  }).length;
  const pendingCount = totalArticles - approvedCount - revisionCount;
  const uniqueClients = new Set(rows.map((r) => r.clientName).filter(Boolean)).size;
  const uniqueWriters = new Set(rows.map((r) => r.writerName).filter(Boolean)).size;

  const cards = [
    {
      label: "Total Articles",
      value: totalArticles.toLocaleString(),
      sub: `${uniqueClients} clients · ${uniqueWriters} writers`,
      color: "amber",
    },
    {
      label: "Total Word Count",
      value: fmtNum(totalWC),
      sub: `Avg ${totalArticles ? Math.round(totalWC / totalArticles).toLocaleString() : 0} / article`,
      color: "sky",
    },
    {
      label: "Approved WC",
      value: fmtNum(totalApprovedWC),
      sub: `${totalWC ? Math.round((totalApprovedWC / totalWC) * 100) : 0}% of total`,
      color: "jade",
    },
    {
      label: "Revision WC",
      value: fmtNum(totalRevisionWC),
      sub: `${totalWC ? Math.round((totalRevisionWC / totalWC) * 100) : 0}% of total`,
      color: "rose",
    },
    {
      label: "Approved",
      value: approvedCount.toLocaleString(),
      sub: `${totalArticles ? Math.round((approvedCount / totalArticles) * 100) : 0}% approval rate`,
      color: "jade",
      badge: true,
    },
    {
      label: "In Revision",
      value: revisionCount.toLocaleString(),
      sub: `${totalArticles ? Math.round((revisionCount / totalArticles) * 100) : 0}% revision rate`,
      color: "rose",
      badge: true,
    },
    {
      label: "Pending / Other",
      value: pendingCount.toLocaleString(),
      sub: `${totalArticles ? Math.round((pendingCount / totalArticles) * 100) : 0}% of total`,
      color: "amber",
      badge: true,
    },
  ];

  const colorMap = {
    amber: { text: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)" },
    sky:   { text: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.18)" },
    jade:  { text: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.18)" },
    rose:  { text: "#fb7185", bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.18)" },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {cards.map((card) => {
        const c = colorMap[card.color];
        return (
          <div
            key={card.label}
            className="rounded-xl p-4 flex flex-col gap-1 transition-all hover:scale-[1.01]"
            style={{ background: "var(--bg-surface)", border: `1px solid var(--border)` }}
          >
            <span className="text-xs font-mono uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}>
              {card.label}
            </span>
            <span className="text-2xl font-display font-bold" style={{ color: c.text }}>
              {card.value}
            </span>
            <span className="text-xs text-ink-500">{card.sub}</span>
          </div>
        );
      })}
    </div>
  );
}

function fmtNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

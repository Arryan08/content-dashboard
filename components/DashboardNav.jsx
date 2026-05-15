"use client";

export default function DashboardNav({ url, onReset, onRefresh, loading }) {
  const displayUrl = url?.replace("https://docs.google.com/spreadsheets/d/", "…/")
    .split("/edit")[0]
    .split("/pub")[0];

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: "rgba(15,14,12,0.9)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
      <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="#f59e0b" opacity="0.9" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="#f59e0b" opacity="0.6" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="#f59e0b" opacity="0.6" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="#f59e0b" opacity="0.3" />
            </svg>
          </div>
          <span className="font-display font-bold text-sm text-ink-100">Content Dashboard</span>
        </div>

        {/* Sheet URL indicator */}
        {url && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-md"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-jade-400 flex-shrink-0" />
            <span className="text-xs font-mono text-ink-400 truncate">{displayUrl}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-ink-300
              hover:text-ink-100 transition-all disabled:opacity-40"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <svg className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} viewBox="0 0 16 16" fill="none">
              <path d="M14 8A6 6 0 1 1 8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 0l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-ink-300
              hover:text-amber-400 transition-all"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            ← Change Sheet
          </button>
        </div>
      </div>
    </header>
  );
}

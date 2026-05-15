"use client";

export default function FilterBar({ filters, setFilters, options, totalRows, filteredRows }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setFilters({ dateFrom: "", dateTo: "", client: "", editor: "", writer: "", status: "", contentType: "" });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="rounded-2xl border p-5 mb-6" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-display font-semibold text-ink-200">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-mono text-amber-400"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-ink-500">
            <span className="text-ink-200">{filteredRows}</span> / {totalRows} rows
          </span>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs text-ink-400 hover:text-amber-400 transition-colors font-mono">
              Clear all ×
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* Date From */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-mono text-ink-500 uppercase tracking-wider">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
            className="px-3 py-2 rounded-lg text-xs font-mono text-ink-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-mono text-ink-500 uppercase tracking-wider">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange("dateTo", e.target.value)}
            className="px-3 py-2 rounded-lg text-xs font-mono text-ink-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          />
        </div>

        {/* Client */}
        <FilterSelect
          label="Client"
          value={filters.client}
          onChange={(v) => handleChange("client", v)}
          options={options.clients}
          placeholder="All Clients"
        />

        {/* Editor */}
        <FilterSelect
          label="Editor"
          value={filters.editor}
          onChange={(v) => handleChange("editor", v)}
          options={options.editors}
          placeholder="All Editors"
        />

        {/* Writer */}
        <FilterSelect
          label="Writer"
          value={filters.writer}
          onChange={(v) => handleChange("writer", v)}
          options={options.writers}
          placeholder="All Writers"
        />

        {/* Status */}
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(v) => handleChange("status", v)}
          options={options.statuses}
          placeholder="All Statuses"
        />

        {/* Content Type */}
        <FilterSelect
          label="Content Type"
          value={filters.contentType}
          onChange={(v) => handleChange("contentType", v)}
          options={options.contentTypes}
          placeholder="All Types"
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-mono text-ink-500 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg text-xs text-ink-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

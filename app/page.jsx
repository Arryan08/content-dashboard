"use client";

import { useState, useCallback } from "react";
import SheetForm from "@/components/SheetForm";
import DashboardNav from "@/components/DashboardNav";
import FilterBar from "@/components/FilterBar";
import SummaryCards from "@/components/SummaryCards";
import AggregateTable from "@/components/AggregateTable";
import RawDataTable from "@/components/RawDataTable";
import {
  TopClientsChart, StatusPieChart, WriterWCChart, ContentTypeChart
} from "@/components/Charts";
import {
  parseCSV, normalizeRow, getUniqueValues, applyFilters, aggregateBy,
  extractSheetId, extractGid,
} from "@/lib/parseSheet";

const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "clients",   label: "Client Wise" },
  { id: "editors",   label: "Editor Wise" },
  { id: "writers",   label: "Writer Wise" },
  { id: "raw",       label: "Raw Data" },
];

export default function Home() {
  const [sheetMeta, setSheetMeta] = useState(null); // { csv, sheetId, gid, url }
  const [rows, setRows]           = useState([]);
  const [filters, setFilters]     = useState({ dateFrom: "", dateTo: "", client: "", editor: "", writer: "", status: "", contentType: "" });
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(({ csv, sheetId, gid, url }) => {
    const parsed = parseCSV(csv).map(normalizeRow);
    setRows(parsed);
    setSheetMeta({ sheetId, gid, url });
    setFilters({ dateFrom: "", dateTo: "", client: "", editor: "", writer: "", status: "", contentType: "" });
    setActiveTab("overview");
  }, []);

  const handleRefresh = async () => {
    if (!sheetMeta) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/fetch-sheet?sheetId=${sheetMeta.sheetId}&gid=${sheetMeta.gid}`);
      if (res.ok) {
        const csv = await res.text();
        const parsed = parseCSV(csv).map(normalizeRow);
        setRows(parsed);
      }
    } catch (_) {}
    finally { setRefreshing(false); }
  };

  const handleReset = () => {
    setSheetMeta(null);
    setRows([]);
  };

  if (!sheetMeta) {
    return <SheetForm onLoad={loadData} />;
  }

  const filtered = applyFilters(rows, filters);

  // Aggregate data
  const clientData  = aggregateBy(filtered, "clientName");
  const editorData  = aggregateBy(filtered, "editor");
  const writerData  = aggregateBy(filtered, "writerName");

  // Filter options (from full data, not filtered — so dropdowns always show all values)
  const options = {
    clients:      getUniqueValues(rows, "clientName"),
    editors:      getUniqueValues(rows, "editor"),
    writers:      getUniqueValues(rows, "writerName"),
    statuses:     getUniqueValues(rows, "status"),
    contentTypes: getUniqueValues(rows, "contentType"),
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <DashboardNav url={sheetMeta.url} onReset={handleReset} onRefresh={handleRefresh} loading={refreshing} />

      <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border-b-2 -mb-px"
              style={{
                color: activeTab === tab.id ? "var(--amber)" : "var(--text-muted)",
                borderBottomColor: activeTab === tab.id ? "var(--amber)" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters (shown on all tabs) */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          options={options}
          totalRows={rows.length}
          filteredRows={filtered.length}
        />

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <SummaryCards rows={filtered} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TopClientsChart data={clientData} />
              <StatusPieChart rows={filtered} />
              <WriterWCChart data={writerData} />
              <ContentTypeChart rows={filtered} />
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <AggregateTable
            title="Client-Wise Breakdown"
            data={clientData}
            nameLabel="Client Name"
            colorAccent="amber"
          />
        )}

        {activeTab === "editors" && (
          <AggregateTable
            title="Editor-Wise Breakdown"
            data={editorData}
            nameLabel="Editor"
            colorAccent="sky"
          />
        )}

        {activeTab === "writers" && (
          <AggregateTable
            title="Writer-Wise Breakdown"
            data={writerData}
            nameLabel="Writer Name"
            colorAccent="jade"
          />
        )}

        {activeTab === "raw" && (
          <RawDataTable rows={filtered} />
        )}
      </main>
    </div>
  );
}

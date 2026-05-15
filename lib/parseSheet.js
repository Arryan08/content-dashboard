/**
 * Extract Google Sheet ID from various URL formats
 */
export function extractSheetId(url) {
  const patterns = [
    /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
    /^([a-zA-Z0-9-_]{20,})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractGid(url) {
  const match = url.match(/[#&]gid=(\d+)/);
  return match ? match[1] : "0";
}

export function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  return lines
    .slice(1)
    .map((line) => {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((header, i) => { row[header] = (values[i] || "").trim(); });
      return row;
    })
    .filter((row) => Object.values(row).some((v) => v !== ""));
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === "," && !inQuotes) {
      result.push(current); current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * FIX 1: parseFloat("1,500") returns 1 — it stops at the comma.
 * Strip all non-numeric characters before parsing.
 */
function parseNum(raw) {
  if (!raw) return 0;
  const cleaned = String(raw).replace(/[^0-9.\-]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export const COLUMNS = {
  EDITOR: "Editor",
  DATE: "Date",
  CLIENT_CODE: "Client Code",
  CLIENT_NAME: "Client Name",
  EMP_ID: "Emp ID",
  WRITER_NAME: "Writer Name",
  CONTENT_TYPE: "Content Type",
  WORD_COUNT: "Word Count",
  APPROVED_WC: "Approved WC",
  REVISION_WC: "Revision WC",
  STATUS: "Status",
  REMARKS: "Remarks",
};

export function normalizeRow(row) {
  return {
    editor:      row[COLUMNS.EDITOR] || "",
    date:        row[COLUMNS.DATE] || "",
    clientCode:  row[COLUMNS.CLIENT_CODE] || "",
    clientName:  row[COLUMNS.CLIENT_NAME] || "",
    empId:       row[COLUMNS.EMP_ID] || "",
    writerName:  row[COLUMNS.WRITER_NAME] || "",
    contentType: row[COLUMNS.CONTENT_TYPE] || "",
    wordCount:   parseNum(row[COLUMNS.WORD_COUNT]),
    approvedWC:  parseNum(row[COLUMNS.APPROVED_WC]),
    revisionWC:  parseNum(row[COLUMNS.REVISION_WC]),
    status:      row[COLUMNS.STATUS] || "",
    remarks:     row[COLUMNS.REMARKS] || "",
  };
}

export function getUniqueValues(rows, field) {
  return [...new Set(rows.map((r) => r[field]).filter(Boolean))].sort();
}

export function applyFilters(rows, filters) {
  return rows.filter((row) => {
    if (filters.dateFrom && row.date) {
      const rowDate = parseDate(row.date);
      const from = new Date(filters.dateFrom);
      if (rowDate && rowDate < from) return false;
    }
    if (filters.dateTo && row.date) {
      const rowDate = parseDate(row.date);
      const to = new Date(filters.dateTo);
      if (rowDate && rowDate > to) return false;
    }
    if (filters.client      && row.clientName  !== filters.client)      return false;
    if (filters.editor      && row.editor       !== filters.editor)      return false;
    if (filters.writer      && row.writerName   !== filters.writer)      return false;
    if (filters.status      && row.status       !== filters.status)      return false;
    if (filters.contentType && row.contentType  !== filters.contentType) return false;
    return true;
  });
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function classifyStatus(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("approv")) return "approved";
  if (s.includes("revis") || s.includes("redo")) return "revision";
  return "pending";
}

/**
 * FIX 2: totalApprovedWC and totalRevisionWC were summing their columns
 * across ALL rows regardless of status, inflating the numbers.
 *
 * Correct logic:
 *   totalWordCount   = Word Count for every row (gross output)
 *   totalApprovedWC  = Approved WC column, only for approved-status rows
 *   totalRevisionWC  = Revision WC column, only for revision-status rows
 */
export function aggregateBy(rows, keyField) {
  const map = {};

  for (const row of rows) {
    const key = row[keyField] || "Unknown";
    if (!map[key]) {
      map[key] = {
        name: key,
        totalArticles: 0,
        totalWordCount: 0,
        totalApprovedWC: 0,
        totalRevisionWC: 0,
        approved: 0,
        pending: 0,
        revision: 0,
        statuses: {},
        contentTypes: {},
      };
    }

    const g = map[key];
    const statusClass = classifyStatus(row.status);

    g.totalArticles  += 1;
    g.totalWordCount += row.wordCount;

    if (statusClass === "approved") {
      g.approved++;
      // Fall back to wordCount if Approved WC column is empty
      g.totalApprovedWC += row.approvedWC || row.wordCount;
    } else if (statusClass === "revision") {
      g.revision++;
      g.totalRevisionWC += row.revisionWC || row.wordCount;
    } else {
      g.pending++;
    }

    g.statuses[row.status]         = (g.statuses[row.status] || 0) + 1;
    g.contentTypes[row.contentType] = (g.contentTypes[row.contentType] || 0) + 1;
  }

  return Object.values(map).sort((a, b) => b.totalArticles - a.totalArticles);
}
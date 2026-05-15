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

/**
 * Extract GID (tab ID) from URL
 */
export function extractGid(url) {
  const match = url.match(/[#&]gid=(\d+)/);
  return match ? match[1] : "0";
}

/**
 * Parse raw CSV text into array of objects using headers
 */
export function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());

  return lines
    .slice(1)
    .map((line) => {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((header, i) => {
        row[header] = (values[i] || "").trim();
      });
      return row;
    })
    .filter((row) => Object.values(row).some((v) => v !== ""));
}

/**
 * Parse a single CSV line respecting quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Expected column headers (normalized)
 */
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

/**
 * Normalize a row to consistent field names
 */
export function normalizeRow(row) {
  return {
    editor: row[COLUMNS.EDITOR] || "",
    date: row[COLUMNS.DATE] || "",
    clientCode: row[COLUMNS.CLIENT_CODE] || "",
    clientName: row[COLUMNS.CLIENT_NAME] || "",
    empId: row[COLUMNS.EMP_ID] || "",
    writerName: row[COLUMNS.WRITER_NAME] || "",
    contentType: row[COLUMNS.CONTENT_TYPE] || "",
    wordCount: parseFloat(row[COLUMNS.WORD_COUNT]) || 0,
    approvedWC: parseFloat(row[COLUMNS.APPROVED_WC]) || 0,
    revisionWC: parseFloat(row[COLUMNS.REVISION_WC]) || 0,
    status: row[COLUMNS.STATUS] || "",
    remarks: row[COLUMNS.REMARKS] || "",
  };
}

/**
 * Get unique sorted values for a field
 */
export function getUniqueValues(rows, field) {
  return [...new Set(rows.map((r) => r[field]).filter(Boolean))].sort();
}

/**
 * Apply all active filters to rows
 */
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
    if (filters.client && row.clientName !== filters.client) return false;
    if (filters.editor && row.editor !== filters.editor) return false;
    if (filters.writer && row.writerName !== filters.writer) return false;
    if (filters.status && row.status !== filters.status) return false;
    if (filters.contentType && row.contentType !== filters.contentType) return false;
    return true;
  });
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Aggregate rows by a given grouping key
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
    g.totalArticles += 1;
    g.totalWordCount += row.wordCount;
    g.totalApprovedWC += row.approvedWC;
    g.totalRevisionWC += row.revisionWC;

    const status = (row.status || "").toLowerCase();
    if (status.includes("approv")) g.approved++;
    else if (status.includes("revis") || status.includes("redo")) g.revision++;
    else g.pending++;

    g.statuses[row.status] = (g.statuses[row.status] || 0) + 1;
    g.contentTypes[row.contentType] = (g.contentTypes[row.contentType] || 0) + 1;
  }
  return Object.values(map).sort((a, b) => b.totalArticles - a.totalArticles);
}
